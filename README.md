# Solana-Token-Info-SPL-
Telegram bot that can source and provide  info on Solana SPL tokens.

[Demo](https://t.me/spl_token_info_bot)
## want to run it yourself?
Clone this project

```bash
> git clone https://github.com/debugtitan/Solana-Token-Info-SPL.git
> cd Solana-Token-Info-SPL

```

Install the dependencies:

```bash
> npm i
```

create .env before run the program
```
cp .env.example .env
```

Edit .env file: 

Input telegram bot token.

```
BOT_TOKEN=
```

run:

```bash
> node bot.js
```

## using docker
build app:

``` bash
> docker build -t spl-info .
```
run app:

``` bash
> docker run spl-bot
```

