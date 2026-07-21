path = "/etc/nginx/sites-enabled/serwell"
with open(path, "r") as f:
    content = f.read()

old = """    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }"""

new = """    location /cms-api/ {
        rewrite ^/cms-api/(.*)$ /$1 break;
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }"""

assert content.count(old) == 1, "anchor not found or not unique"
content = content.replace(old, new, 1)

with open(path, "w") as f:
    f.write(content)

print("✅ Nginx config patched!")
