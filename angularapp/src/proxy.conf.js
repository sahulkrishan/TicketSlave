const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/login"
    ],
    target: "https://localhost:7074",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
