import json

data = {
    "page": "home",
    "type": "servicesTeaser",
    "order": 1,
    "isVisible": True,
    "content": {
        "tag": "· What we make",
        "title": "Three engines. One business.",
        "italicWord": "One business.",
        "linkText": "View all services",
        "linkHref": "/services",
        "services": [
            {"n": "01", "title": "Websites", "desc": "Blazing-fast sites that load on any phone, any network.", "accent": "#E85D2C", "href": "/services"},
            {"n": "02", "title": "Software", "desc": "Custom ERPs, dashboards, internal tools — made for your shop floor.", "accent": "#FF8A3D", "href": "/services"},
            {"n": "03", "title": "Marketing", "desc": "Targeted local ads that fill your phone with ready-to-buy customers.", "accent": "#FFD9B8", "href": "/services"},
        ],
    },
}

with open('/var/www/serwell/services_payload.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ Payload file written!")
