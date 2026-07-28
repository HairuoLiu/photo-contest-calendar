// Generates a Markdown table of all competitions from src/data/competitions.ts.
// Data-only eval of the array literal is safe here (no functions, just values).
import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../src/data/competitions.ts', import.meta.url), 'utf8')
const start = src.indexOf('[')
const end = src.lastIndexOf(']')
const arrText = src.slice(start, end + 1)
const competitions = eval(arrText)

const fmt = (iso) => iso
const grouped = {}
for (const c of competitions) {
  const year = c.deadline.slice(0, 4)
  ;(grouped[year] ??= []).push(c)
}
for (const y of Object.keys(grouped)) grouped[y].sort((a, b) => a.deadline.localeCompare(b.deadline))

let out = ''
for (const year of Object.keys(grouped).sort()) {
  out += `\n### ${year} 年（共 ${grouped[year].length} 场）\n\n`
  out += '| 比赛 | 英文名 | 截止日 | 类别 | 地区 | 费用 | 官网 |\n'
  out += '| --- | --- | --- | --- | --- | --- | --- |\n'
  for (const c of grouped[year]) {
    const fee = c.fee === 'Free' ? '免费' : '付费'
    out += `| ${c.nameZh} | ${c.name} | ${fmt(c.deadline)} | ${c.category} | ${c.region} | ${fee} | [链接](${c.officialUrl}) |\n`
  }
  out += '\n'
}
process.stdout.write(out)
