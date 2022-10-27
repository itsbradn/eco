# EcoBot Source

Supprt: <https://discord.gg/3EQjy52tXa>

EcoBot is a simple and expansive economy bot that starts users off simple and expands in any direction they want. Starting off with a simple work command, users earn money and can buy items such as pickaxes, axes, and swords to fight in dungeons, go mining, and more. With features being added frequently it is soon to be the most expansive economy bot on discord.

## Enviroment Setup

1. Fork the repository at <https://github.com/itsbradn/eco/fork> and clone it to your computer
2. Open terminal in the main directory of the project and run `yarn install`
3. Rename `.env.example` to `.env` and fill out the fields
6. Your bot enviroment should be ready for you to get started!

## Starting the bot

There are two ways to start the bot, for production and for development. If you're doing this on your local machine follow the development instructions. If you're going to host the bot do the production instructions

### Production

For production enviroments we highly recommend using docker, however if you need to you can use the development instructions and replace `yarn` with something like `pm2` so your process is kept alive.

To get started run `docker-compose build` to build/rebuild the bot files

After thats done you should be able to run `docker-compose up -d` and start the bot with no issues.

Make sure everythings working correctly in a development server and enjoy!

### Development

For development enviroments we use several process to give more control and make it easier to update seperate sections of the bot. If you are using this for production please use something like `pm2` instead of `yarn` to keep your processes alive long term and replace `dev_` with `start_`.

First compile your project files by running `yarn run build`

After you've done that you need to start the REST, bot, and gateway processes.

- Start REST
  - `yarn run devr`
- Start Bot
  - `yarn run devb`
- Start Gateway
  - `yarn run devg`

After you run all of these you should be up and running!

### Credits

Based on discordeno for future expansion.
Thanks to the members of my discord server for ideas and more, if you want to contribute join the server!
<https://discord.gg/3EQjy52tXa>