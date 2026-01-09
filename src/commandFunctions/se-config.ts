import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { dbGetAvailableSources, dbGetGuildEnabledSources } from '../database';
import { ACCENT_COLOR } from '../util';

const headerText = '## Special Effect Source Configuration\n';

export const specialEffectSourceEnableButtonID = 'specialEffectSourceEnableButton';
export const specialEffectSourceDisableButtonID = 'specialEffectSourceDisableButton';

/**
 * Returns the ContainerBuilder to be used as a component in commands/se-config.ts
 * @param {string} guildId
 * @param {string} [selectedSource]
*/
export async function seConfigContainerBuilder(guildId: string, selectedSource?: string): Promise<ContainerBuilder> {
    const availableSources = await dbGetAvailableSources(guildId);
    const enabledSources = await dbGetGuildEnabledSources(guildId);

    /** Helper function to get all available special effect sources based on guildId, then create a StringSelectMenuOptionBuilder() for each */
    const sourceMenuOptions = (): StringSelectMenuOptionBuilder[] => {
        const returnArray: StringSelectMenuOptionBuilder[] = [];
        availableSources.forEach((source) => {
            let option = new StringSelectMenuOptionBuilder()
                .setLabel(source)
                .setValue(source);
            
            // Once the user selects an option, make sure it stays selected after the message is updated
            if (selectedSource && selectedSource === source) {
                option = option.setDefault(true);
            }

            returnArray.push(option);
        });
        return returnArray;
    };

    // Select menu
    const specialEffectSourceSelect = new StringSelectMenuBuilder()
        .setCustomId('specialEffectSourceSelect')
        .addOptions(sourceMenuOptions());

    const selectMenuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(specialEffectSourceSelect);
    
    // Buttons, if there's no selected source, both buttons are disabled
    let enableButton = new ButtonBuilder()
        .setCustomId(specialEffectSourceEnableButtonID)
        .setLabel('Enable')
        .setStyle(ButtonStyle.Success)
        .setDisabled(true);

    let disableButton = new ButtonBuilder()
        .setCustomId(specialEffectSourceDisableButtonID)
        .setLabel('Disable')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true);

    // If there is a selected source, enable the appropriate button depending on if the source itself is enabled or not
    if (selectedSource) {
        const sourceIsEnabled = enabledSources.includes(selectedSource);
        if (sourceIsEnabled) disableButton = disableButton.setDisabled(false);
        else enableButton = enableButton.setDisabled(false);
    }
    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(enableButton, disableButton);

    // Text for the begginning of the message, shows all sources available and their status'
    let sourceInformationText = '**Available sources** (:green_square: - *Enabled*, :red_square: - *Disabled*):\n';
    for (const source of availableSources) {
        const toConcat = enabledSources.includes(source) ? ':green_square:' : ':red_square:';
        sourceInformationText = sourceInformationText.concat(`- ${toConcat} ${source}\n`);
    }
    sourceInformationText = sourceInformationText.concat('');

    return new ContainerBuilder()
        .setAccentColor(ACCENT_COLOR)
        .addTextDisplayComponents(textDisplay => textDisplay.setContent(headerText))
        .addSeparatorComponents(separator => separator)
        .addTextDisplayComponents(textDisplay => textDisplay.setContent(sourceInformationText))
        .addSeparatorComponents(separator => separator)
        .addTextDisplayComponents(textDisplay => textDisplay.setContent('*Select which source you\'d like to enable/disable*'))
        .addActionRowComponents(selectMenuRow)
        .addActionRowComponents(buttonRow);
}

/**
 * Returns the ContainerBuilder to be used as a component in commands/se-config.ts when it times out
*/
export function seConfigTimedOutContainerBuilder(): ContainerBuilder {
    return new ContainerBuilder()
        .setAccentColor(ACCENT_COLOR)
        .addTextDisplayComponents(textDisplay => textDisplay.setContent(headerText))
        .addSeparatorComponents(separator => separator)
        .addTextDisplayComponents(textDisplay => textDisplay.setContent('*This instance of /se-config has timed out*'));
}