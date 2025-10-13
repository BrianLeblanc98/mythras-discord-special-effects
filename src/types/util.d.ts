import { Collection, Client, SlashCommandBuilder, RepliableInteraction } from "discord.js";

export type Command = {
  data: SlashCommandBuilder,
  execute(interaction: RepliableInteraction): void
}

export type ClientWithCommands = Client & {
  commands?: Collection<string, Command>,
}