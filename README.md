# Mythras Discord Special Effects (v0.1.0)

A Discord bot to help with Mythras' special effects. [Add this bot to your server!](https://discord.com/oauth2/authorize?client_id=1427154107910721658)

Currently only contains special effects from the Core Rule Book, excluding Weapon Malfunction as it's not chosen. In future other special effects will be included, ideally accompanied by an admin only command: `/config` to set which effects will show in the server.
### Commands
`/se attacker-los:"" defender-los:""`
- Compares Levels of Success (LOS), determines who gets how many special effects and shows which are available to choose

`/se-info special-effect:""`
- Shows the description and other information (weapon restrictions, critical only, stackable, etc.) for the given Special Effect

By default, responses from the bot will be ephemeral (i.e. only shown to the user who sent the command). This can be overridden by adding the optional flag `show-all: True` to the end of any command.

## Developer Setup
### Step 1 - Install node and create .env files
```
npm i
npm run copy-env
```

### Step 2 - Setup environment variables for production and development
In `.env` and `.env.dev`, set `DISCORD_TOKEN=` and `CLIENT_ID=` to the Discord token and Client ID. The Token and Client ID can be found by:

- Token: `Discord Developer Portal > "Bot" > "Token"`

- Client ID: `Discord Developer Portal > "General Information" > application id`

in `.env.dev` set `GUILD_ID=` to the ID of the server you have to bot installed to for development. This can be found by:

- `Enable developer mode > Right-click the server title > "Copy ID"`

### Step 3 - Run the bot
```
# Runs tests
npm run test

# Development mode (deploy commands to the development guild, commands are ready instantaneously)
npm run dev

# Production mode (globally deploys commands, takes up to an hour for commands to be ready)
npm run prod
```

### Package.json scripts descriptions
Most of the time you will only need `dev` and `prod`, but there are more scripts if needed.

```
"copy-env"    # Create env files that are not tracked by git
"test"        # Run the unit tests
"build"       # Build the TypeScript files
"clean"       # Deletes the dist folder
"lint"        # Lint
"lint:fix"    # Lint fix
"start:dev"   # Runs the bot using .env.dev
"start:prod"  # Runs the bot using .env
"deploy-commands:dev"   # Deploys the commands to the dev guild only
"deploy-commands:prod"  # Deploys the commands globally, takes up to an hour
"clear-commands"  # Clears the commands from both the dev guild and globally
"dev"   # Runs clean, deploy-commands:dev, and start:dev
"prod"  # Runs clean, deploy-commands:prod, and start:prod
```