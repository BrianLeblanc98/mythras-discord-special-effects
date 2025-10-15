import { Collection, Client, SlashCommandBuilder, RepliableInteraction, AutocompleteInteraction } from "discord.js";

export type Command = {
  data: SlashCommandBuilder,
  execute(interaction: RepliableInteraction): void,
  autocomplete(interaction: AutocompleteInteraction): void
}

export type ClientWithCommands = Client & {
  commands?: Collection<string, Command>,
}