const PROXY_CONFIG = [
  {
    context: [
      "/api/v1/",
    ],
    target: "https://localhost:7074",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
