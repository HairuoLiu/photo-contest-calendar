// Prestige classification for the calendar.
//
// Single source of truth for which competitions are high-value, so we don't
// have to touch every entry in `competitions.ts`. A competition's own
// `tier` field (if set) always wins; otherwise this map is consulted by id.
//
//   elite = 殿堂级 / 业内公认最高荣誉
//   major = 重要级 / 行业高度认可
//
// Classification is based on authoritative sources and the research agent's
// "photography master" curation (2026-07-28): official sites, Wikipedia
// "List of photography awards", LensCulture, and reputable photo-media roundups.

export const TIER_MAP: Record<string, 'elite' | 'major'> = {
  // ---- Existing, widely-recognized elite competitions ----
  'sony-world-photography-awards': 'elite',
  'sony-world-photography-awards-2027': 'elite',
  'world-press-photo-contest': 'elite',
  'wildlife-photographer-of-the-year': 'elite',
  'international-photography-awards': 'elite',
  'taylor-wessing-photo-portrait-prize': 'elite',
  'prix-pictet': 'elite',
  'leica-oskar-barnack-award': 'elite',
  'nikon-small-world': 'elite',
  'hipa': 'elite',
  'siena-international-photo-awards': 'elite',
  'prix-de-la-photographie-paris': 'elite',

  // ---- Existing, important / industry-recognized ----
  'lensculture-portrait-awards': 'major',
  'lensculture-street-photography-awards': 'major',
  'lensculture-critics-choice': 'major',
  'bjp-portrait-of-britain': 'major',
  'aperture-portfolio-prize': 'major',
  'foam-talent': 'major',
  'aesthetica-art-prize': 'major',
  'fine-art-photography-awards': 'major',
  'all-about-photo-awards': 'major',
  'bigpicture-natural-world': 'major',
  'audubon-photography-awards': 'major',
  'iphone-photography-awards': 'major',
  'nd-awards': 'major',
  'monochrome-awards': 'major',
  'monovisions-photography-awards': 'major',
  'travel-photographer-of-the-year': 'major',
  'smithsonian-photo-contest': 'major',
  'comedy-wildlife-photography-awards': 'major',
  'ocean-art-underwater': 'major',
  'british-wildlife-photography-awards': 'major',
  'close-up-photographer-of-the-year': 'major',
  'world-nature-photography-awards': 'major',
  '35awards': 'major',
  'cewe-photo-award': 'major',
  'nikon-photo-contest': 'major',
  'canon-photo-contest': 'major',
  'fujifilm-x-series-contest': 'major',
  'sony-alpha-cafe-monthly': 'major',
  'der-greif-open-call': 'major',
  'fisheye-magazine-open-call': 'major',

  // ---- Newly researched elite competitions ----
  'hasselblad-masters': 'elite',
  'pictures-of-the-year-international': 'elite',
  'underwater-photographer-of-the-year': 'elite',
  'astronomy-photographer-of-the-year': 'elite',
  'rps-international-photography-exhibition': 'elite',

  // ---- Newly researched important competitions ----
  'andrei-stenin-international-press-photo-contest': 'major',
  'gdt-european-wildlife-photographer-of-the-year': 'major',
  'magnum-photography-awards': 'major',
  'world-food-photography-awards': 'major',
  'international-landscape-photographer-of-the-year': 'major',
  'nature-ttl-photographer-of-the-year': 'major',
  'urban-photo-awards': 'major',
  'british-photography-awards': 'major',
  'communication-arts-photography': 'major',
  'portrait-of-humanity': 'major',
  'nature-photographer-of-the-year-npoty': 'major',
  'bw-child-photo-competition': 'major',
}
