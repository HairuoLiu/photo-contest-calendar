#!/usr/bin/env python3
"""Auto-check photography competition deadlines and sync the calendar.

Reads ``src/data/competitions.ts``, visits each official URL with Playwright
(falls back to a plain HTTP + BeautifulSoup fetch if the browser is
unavailable), extracts candidate deadline dates, and reports changes. When a
change is detected it updates ``competitions.ts`` IN PLACE (deadline lines
only) and writes a Markdown report.

A GitHub Action runs this on a yearly schedule (+ manual dispatch) and opens a
PR for human review -- nothing merges automatically, because correctness is
the top priority. After a human merges the PR, the existing deploy workflow
rebuilds and republishes the site.

Usage:
    python scripts/check_updates.py \
        --src src/data/competitions.ts \
        --report scripts/report.md
"""
from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except Exception:  # pragma: no cover - browser optional in CI fallback
    sync_playwright = None

KEYWORDS = [
    "deadline", "submission", "submit", "entries close", "closes", "due",
    "last chance", "register", "registration", "open",
    "截止", "投稿", "报名", "征稿", "截稿", "报名截止",
]

MONTHS_EN = {
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10, "november": 11,
    "december": 12,
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "jun": 6, "jul": 7, "aug": 8,
    "sep": 9, "sept": 9, "oct": 10, "nov": 11, "dec": 12,
}

# Order matters: more specific / less ambiguous patterns first.
DATE_PATTERNS = [
    (re.compile(r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})"),
     lambda m: (int(m[1]), int(m[2]), int(m[3]))),
    (re.compile(r"(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]?"),
     lambda m: (int(m[1]), int(m[2]), int(m[3]))),
    (re.compile(r"(\d{4})\s*年\s*(\d{1,2})\s*月"),
     lambda m: (int(m[1]), int(m[2]), None)),
    (re.compile(r"(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(\d{4})", re.I),
     lambda m: (int(m[3]), MONTHS_EN[m[2].lower()], int(m[1]))),
    (re.compile(r"(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})", re.I),
     lambda m: (int(m[3]), MONTHS_EN[m[1].lower()], int(m[2]))),
    (re.compile(r"(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})"),
     lambda m: (int(m[3]), int(m[1]), int(m[2]))),
]


def parse_competitions(ts_text: str) -> list[dict]:
    """Extract competition objects from the TS file via ordered-field regex.

    Only the ``competitions`` array body is parsed, so the ``Competition``
    interface declaration above it is ignored.
    """
    marker = "competitions: Competition[] = ["
    idx = ts_text.find(marker)
    body = ts_text[idx:] if idx != -1 else ts_text

    field = lambda name: re.compile(rf"{name}:\s*'([^']*)'", re.DOTALL)
    ids = field("id").findall(body)
    names = field("name").findall(body)
    names_zh = field("nameZh").findall(body)
    deadlines = re.compile(r"deadline:\s*'(\d{4}-\d{2}-\d{2})'").findall(body)
    categories = field("category").findall(body)
    regions = field("region").findall(body)
    fees = field("fee").findall(body)
    official = field("officialUrl").findall(body)
    submit = field("submitUrl").findall(body)

    n = min(len(ids), len(names), len(deadlines), len(official), len(submit))
    out: list[dict] = []
    for i in range(n):
        out.append({
            "id": ids[i],
            "name": names[i],
            "nameZh": names_zh[i],
            "deadline": deadlines[i],
            "category": categories[i] if i < len(categories) else "",
            "region": regions[i] if i < len(regions) else "",
            "fee": fees[i] if i < len(fees) else "",
            "officialUrl": official[i],
            "submitUrl": submit[i],
        })
    return out


def fetch_text(url: str) -> str:
    """Return page text. Prefer Playwright; fall back to requests+bs4."""
    if sync_playwright is not None:
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(args=["--no-sandbox"])
                page = browser.new_page()
                page.goto(url, timeout=20000, wait_until="domcontentloaded")
                try:
                    page.wait_for_timeout(1500)
                except Exception:
                    pass
                text = page.inner_text()
                browser.close()
                return text or ""
        except Exception as e:  # pragma: no cover
            print(f"  [warn] playwright failed for {url}: {e}", file=sys.stderr)
    # fallback: static HTTP fetch
    try:
        import requests
        from bs4 import BeautifulSoup
        resp = requests.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0"})
        resp.encoding = resp.apparent_encoding or "utf-8"
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()
        return soup.get_text(" ", strip=True)
    except Exception as e:
        print(f"  [warn] fetch failed for {url}: {e}", file=sys.stderr)
        return ""


def extract_dates(text: str) -> list[tuple[int, int | None, int | None]]:
    found: list[tuple[int, int | None, int | None]] = []
    for pat, fn in DATE_PATTERNS:
        for m in pat.finditer(text):
            try:
                y, mo, d = fn(m)
            except Exception:
                continue
            if 1990 <= y <= 2100 and (mo is None or 1 <= mo <= 12) and (d is None or 1 <= d <= 31):
                found.append((y, mo, d))
    return found


def best_candidate(text: str, current: str) -> tuple[str | None, str | None]:
    """Pick the most likely deadline, prioritizing dates near keywords."""
    if not text:
        return None, None
    current_year = int(current[:4])
    sentences = re.split(r"(?<=[.!?。！？\n])", text)
    scored: list[tuple[int, int, int, str]] = []
    for s in sentences:
        low = s.lower()
        if not any(k in low for k in KEYWORDS):
            continue
        for (y, mo, d) in extract_dates(s):
            if d is None:
                continue
            if y < current_year - 1 or y > current_year + 2:
                continue
            scored.append((y, mo or 0, d, s.strip()[:160]))
    if scored:
        scored.sort(key=lambda x: (x[0], x[1], x[2]))
        y, mo, d, ctx = scored[0]
        return (f"{y:04d}-{mo:02d}-{d:02d}", ctx)
    # fallback: any plausible date anywhere on the page
    for (y, mo, d) in extract_dates(text):
        if d is None:
            continue
        if current_year - 1 <= y <= current_year + 2:
            return (f"{y:04d}-{mo:02d}-{d:02d}", text[:160])
    return None, None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default="src/data/competitions.ts")
    ap.add_argument("--report", default="scripts/report.md")
    args = ap.parse_args()

    src = Path(args.src)
    text = src.read_text(encoding="utf-8")
    comps = parse_competitions(text)
    print(f"Parsed {len(comps)} competitions from {src}")

    changes: list[tuple[str, str, str, str]] = []
    rows: list[str] = []
    for c in comps:
        url = c["officialUrl"] or c["submitUrl"]
        print(f"Checking {c['id']} ({c['nameZh']}) -> {url}")
        page = fetch_text(url)
        cand, ctx = best_candidate(page, c["deadline"]) if page else (None, None)
        if cand and cand != c["deadline"]:
            changes.append((c["id"], c["deadline"], cand, ctx or ""))
            rows.append(f"| 🔄 | {c['nameZh']} | {c['deadline']} | **{cand}** | {ctx} |")
        elif cand:
            rows.append(f"| ✅ | {c['nameZh']} | {c['deadline']} | {cand} (无变化) | — |")
        else:
            rows.append(f"| ❓ | {c['nameZh']} | {c['deadline']} | 未检测到 | — |")

    # Apply changes in place (deadline lines only), preserving everything else.
    new_text = text
    for cid, old, new, _ in changes:
        pat = re.compile(
            r"(id:\s*'" + re.escape(cid) + r"'.*?deadline:\s*')"
            + re.escape(old) + r"(')",
            re.DOTALL,
        )
        new_text, n = pat.subn(rf"\g<1>{new}\2", new_text)
        if n == 0:
            print(f"  [warn] could not patch {cid}", file=sys.stderr)

    if changes:
        src.write_text(new_text, encoding="utf-8")
        print(f"Updated {len(changes)} deadline(s) in {src}")

    report = [
        "# 比赛截止日自动核对报告",
        "",
        f"生成时间：{dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        f"检测条目：{len(comps)} ｜ 发现变化：{len(changes)}",
        "",
        "| 状态 | 比赛 | 原截止 | 检测截止 | 证据片段 |",
        "| --- | --- | --- | --- | --- |",
    ]
    report += rows
    if changes:
        report += ["", "⚠️ 以上变化已由脚本写入 `src/data/competitions.ts`，请人工复核证据片段后合并 PR。"]
    else:
        report += ["", "✅ 未检测到截止日变化（或无法自动判定）。"]
    Path(args.report).write_text("\n".join(report), encoding="utf-8")
    print(f"Report written to {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
