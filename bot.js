const {Telegraf} = require("telegraf");
const {message} = require("telegraf/filters");
const Config = require("./config");

const bot = new Telegraf(Config.BOT_TOKEN);

bot.command("start", async (ctx) => {
  const firstName = ctx.message.chat.first_name;
  let msg = `Hi *${firstName}*,\n\nI'm your companion for SPL tokens on the Solana blockchain\n\nUsage:\n/search [token name , symbol or contract]\n\nStay ahead of the game and find detailed information about any "SPL" token`;
  await ctx.reply(msg,{parse_mode:"Markdown"});
});

bot.command("search", async (ctx) => {
    const userMessage = ctx.message.text.split(" ")
    if (userMessage.length == 2 ){
        return await ctx.reply(`searching token ${userMessage[1]}`)
    }
    await ctx.reply("*Usage*\n/search [token name, symbol or contract]",{parse_mode:"Markdown"})
})
bot.launch();
