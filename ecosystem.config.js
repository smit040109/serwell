module.exports = {
  apps: [{
    name: "serwell",
    script: "server.js",
    cwd: "/var/www/serwell/.next/standalone",
    env: {
      MONGODB_URI: "mongodb+srv://ankit458591_db_user:cU5FUjPSVPcBSLO4@vayucodes.mmyh8dl.mongodb.net/vayucodes_cms?retryWrites=true&w=majority",
      NEXT_PUBLIC_API_URL: "https://vayucodes.com",
      PORT: 3000
    }
  }]
}
