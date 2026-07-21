import re

path = "/var/www/serwell/app/page.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import after the Shared import block
old_import = """} from '@/components/site/Shared'"""
new_import = """} from '@/components/site/Shared'
import { useSectionContent } from '@/hooks/useSectionContent'"""
assert content.count(old_import) == 1, "import anchor not found or not unique"
content = content.replace(old_import, new_import, 1)

# 2. Add hook call inside EditorialHero, right after useVideoColor()
old_hook_anchor = """function EditorialHero() {
  const vc = useVideoColor()"""
new_hook_anchor = """function EditorialHero() {
  const vc = useVideoColor()
  const { content: hero } = useSectionContent('home', 'hero', {
    kicker: 'Premium Software Studio · Est. 2025',
    headlineLine1: 'The Last Team',
    headlinePre: "You'll ",
    headlineEmphasis: 'Ever',
    headlinePost: ' Need.',
    description: 'We build websites, automate operations, create custom software and help businesses grow through performance-driven marketing. Everything your business needs — one team.',
    cta1Text: 'Start Your Project',
    cta2Text: 'See Our Work',
  })"""
assert content.count(old_hook_anchor) == 1, "hook anchor not found or not unique"
content = content.replace(old_hook_anchor, new_hook_anchor, 1)

# 3. Kicker text
old_kicker = """                <span className="text-[10px] tracking-[0.4em] uppercase text-white/65" style={{ fontFamily: 'var(--font-inter)' }}>
                  Premium Software Studio · Est. 2025
                </span>"""
new_kicker = """                <span className="text-[10px] tracking-[0.4em] uppercase text-white/65" style={{ fontFamily: 'var(--font-inter)' }}>
                  {hero.kicker}
                </span>"""
assert content.count(old_kicker) == 1, "kicker anchor not found or not unique"
content = content.replace(old_kicker, new_kicker, 1)

# 4. Headline
old_headline = """                The Last Team
                <br />
                You&apos;ll <span className="italic text-[#FFD9B8]">Ever</span> Need."""
new_headline = """                {hero.headlineLine1}
                <br />
                {hero.headlinePre}<span className="italic text-[#FFD9B8]">{hero.headlineEmphasis}</span>{hero.headlinePost}"""
assert content.count(old_headline) == 1, "headline anchor not found or not unique"
content = content.replace(old_headline, new_headline, 1)

# 5. Description
old_desc = """                We build websites, automate operations, create custom software and help businesses grow through performance-driven marketing. Everything your business needs — one team."""
new_desc = """                {hero.description}"""
assert content.count(old_desc) == 1, "description anchor not found or not unique"
content = content.replace(old_desc, new_desc, 1)

# 6. CTA 1 text
old_cta1 = """                  Start Your Project
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />"""
new_cta1 = """                  {hero.cta1Text}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />"""
assert content.count(old_cta1) == 1, "cta1 anchor not found or not unique"
content = content.replace(old_cta1, new_cta1, 1)

# 7. CTA 2 text
old_cta2 = """                  See Our Work
                </Link>"""
new_cta2 = """                  {hero.cta2Text}
                </Link>"""
assert content.count(old_cta2) == 1, "cta2 anchor not found or not unique"
content = content.replace(old_cta2, new_cta2, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ All 7 patches applied successfully!")
