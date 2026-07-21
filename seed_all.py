import json, subprocess, os

TOKEN = os.environ.get("TOKEN")
if not TOKEN:
    raise SystemExit("❌ TOKEN env var missing — pehle login karke TOKEN set karo")

sections = [
    {
        "page": "home", "type": "workTeaser", "order": 2, "isVisible": True,
        "content": {
            "tag": "· Selected work · 2024 – 2025",
            "title": "Real businesses. Real numbers.",
            "italicWord": "Real numbers.",
            "linkText": "See all case studies",
            "linkHref": "/our-work",
            "projects": [
                {"n": "01", "title": "Nirvana Eco-Resort", "tag": "Hospitality", "img": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80"},
                {"n": "02", "title": "Sutra Textile Co.", "tag": "Manufacturing", "img": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=80"},
                {"n": "03", "title": "Anaya Jewels", "tag": "D2C", "img": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80"},
            ],
        },
    },
    {
        "page": "home", "type": "trustTeaser", "order": 3, "isVisible": True,
        "content": {
            "tag": "· Why Gujarat trusts vayucodes",
            "titleLine1": "You don't need Mumbai.",
            "titleItalic": "You need us.",
            "linkText": "Read full story",
            "linkHref": "/why-us",
            "points": [
                {"icon": "MapPin", "k": "Local Partners", "v": "Right here in Valsad. Call us in Gujarati."},
                {"icon": "Users", "k": "Gujarat-Native", "v": "We know your festive cycle, your customer."},
                {"icon": "ShieldCheck", "k": "One Partner", "v": "No five vendors fighting each other."},
            ],
        },
    },
    {
        "page": "home", "type": "bentoGrid", "order": 4, "isVisible": True,
        "content": {
            "tag": "· What we build",
            "title": "One studio. Six superpowers.",
            "italicWord": "Six superpowers.",
            "linkText": "All services",
            "linkHref": "/services",
            "cards": [
                {"size": "large", "icon": "🎬", "title": "Cinema for Business", "body": "Brand films & reels shot in 4K Apple Log. Not commercials — cinema.", "accent": "#E85D2C"},
                {"size": "small", "icon": "⚡", "title": "Blazing-fast sites", "body": "Sub-second loads.", "accent": ""},
                {"size": "small", "icon": "🛠", "title": "Custom Software", "body": "Built for your floor.", "accent": ""},
                {"size": "large", "icon": "📈", "title": "Performance That Pays", "body": "Every rupee tracked to a rupee earned. Local-first growth.", "accent": "#FFD9B8"},
                {"size": "small", "icon": "🇮🇳", "title": "Gujarati-first", "body": "We speak your buyer.", "accent": ""},
                {"size": "small", "icon": "🤝", "title": "One Partner", "body": "Predictable, monthly.", "accent": ""},
            ],
        },
    },
    {
        "page": "home", "type": "animatedStats", "order": 5, "isVisible": True,
        "content": {
            "stats": [
                {"num": 150, "suffix": "+", "label": "Projects Shipped"},
                {"num": 5, "suffix": " yrs", "label": "In the studio"},
                {"num": 99, "suffix": "%", "label": "Client Satisfaction"},
                {"num": 50, "suffix": "+", "label": "Brands Onboarded"},
            ],
        },
    },
    {
        "page": "home", "type": "clientMarquee", "order": 6, "isVisible": True,
        "content": {
            "tag": "· Trusted by independent businesses across India",
            "brands": ["Nirvana", "Sutra", "Anaya", "Bandhan", "ChaiSnap", "Saurav Studios", "Vayu Mills", "Patel Co.", "Lumière", "Athena", "Indigo Bay", "Sahyadri Group"],
        },
    },
]

for i, sec in enumerate(sections):
    fname = f"/var/www/serwell/payload_{sec['type']}.json"
    with open(fname, "w", encoding="utf-8") as f:
        json.dump(sec, f, ensure_ascii=False, indent=2)

    result = subprocess.run(
        ["curl", "-s", "-X", "POST", "https://vayucodes.com/cms-api/api/sections/admin",
         "-H", "Content-Type: application/json",
         "-H", f"Authorization: Bearer {TOKEN}",
         "-d", f"@{fname}"],
        capture_output=True, text=True,
    )
    print(f"[{sec['type']}] -> {result.stdout[:150]}")

print("✅ All 5 sections seeded!")
