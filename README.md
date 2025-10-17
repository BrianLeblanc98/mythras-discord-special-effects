# mythras-discord-special-effects

## Setup
### Step 1
```
npm i
npm run copy-env
```

### Step 2
In `.env` and `.env.dev`, set `DISCORD_TOKEN=` and `CLIENT_ID=` to the Discord token and Client ID. The Token and Client ID can be found by:

- Token: `Discord Developer Portal > "Bot" > "Token"`

- Client ID: `Discord Developer Portal > "General Information" > application id`

in `.env.dev` set `GUILD_ID=` to the ID of the server you have to bot installed to for development. This can be found by:

- `Enable developer mode > Right-click the server title > "Copy ID"`

### Step 3
```
# Development mode (only deploy commands to development server)
npm run dev

# Production mode (deploy commands to EVERY server the bot is installed to)
npm run prod
```