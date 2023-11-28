const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/event",
      "/payment-form",
      "/location",


    ],
    target: "https://localhost:7074",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
