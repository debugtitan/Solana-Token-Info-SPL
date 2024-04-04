const {Telegraf} = require("telegraf");
const Config = require("./config");
const {SPLData} = require("./actions");
const bot = new Telegraf(Config.BOT_TOKEN);

const SPL = new SPLData();

bot.command("start", async ctx => {
  const firstName = ctx.message.chat.first_name;
  let msg = `Hi *${firstName}*,\n\nI'm your companion for SPL tokens on the Solana blockchain\n\nUsage:\n/search [contract]\n\nStay ahead of the game and find detailed information about any "SPL" token`;
  await ctx.reply(msg, {parse_mode: "Markdown"});
});

bot.command("search", async ctx => {
  const userMessage = ctx.message.text.split(" ");
  if (userMessage.length == 2) {
    let data = await SPL.GetTokenInfo(userMessage[1]);
    console.log(data);
    let tokenInfo = `Name:${data.tokenName} (${data.tokenSymbol})\n\n${data.description}\n\nOwner: _${data.owner}_\n\nDecimal: ${data.decimal}\n`;
    if (data.tokenLogo) {
      await ctx.sendPhoto(data.tokenLogo, {
        caption: `${data.tokenSymbol} Logo`,
      });
    }
    return await ctx.reply(tokenInfo, {
      parse_mode: "Markdown",
    });
  }
  await ctx.reply("*Usage*\n/search [contract]", {
    parse_mode: "Markdown",
  });
});
bot.launch();
