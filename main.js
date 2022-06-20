const { Client } = require("discord.js")
const { get } = require("https")
const client = new Client()
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

client.once("ready", async () => {
  while (true) {
    var gas
    var ethCost
    var URLS = [
      "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=" + process.env.APIKEY,
      "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + process.env.APIKEY,
    ]
    for (i in URLS) {
      get(URLS[i], (res) => {
        let data = ""
        res.on("data", (chunk) => {
          data += chunk
        })
        res.on("end", () => {
          try {
            if (URLS[i] == URLS[1]) {
              gas = ("gas", JSON.parse(data)["result"]["SafeGasPrice"])
            } else {
              ethCost = ("ethCost", JSON.parse(data)["result"]["ethusd"])
            }
          } catch {}
        })
      }).on("error", (error) => {
        console.log(error)
      })
      await delay(1 * 1000)
    }
    if (gas != undefined && ethCost != undefined) {
      var USD = ((110000 * gas) / 10 ** 9) * ethCost
      await delay(5 * 1000)
      console.log("GAS", gas, "ETH/USD", Math.round(ethCost), "MIGRATION/USD", Math.round(USD))
      client.user.setStatus("available")
      client.user.setActivity("Estimate at: $" + USD.toFixed(2) + " | Gas: " + gas, {
        type: "WATCHING",
        url: "http://glm.golem.network/",
      })
    }
    await delay(15 * 1000)
  }
})

console.log("ENV", process.env.TOKEN)
client.login(process.env.TOKEN)
