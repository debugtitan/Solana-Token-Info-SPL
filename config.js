require('dotenv').config()

const BOT_TOKEN = process.env.BOT_TOKEN
const  config = {
    baseUrl: "https://api.mainnet-beta.solana.com"
}

module.exports = {
    BOT_TOKEN
}