import fs from 'node:fs';
import path from 'node:path';
import { Sequelize, DataTypes, Op } from 'sequelize';
import { isSpecialEffect, isSpecialEffectSet, specialEffect } from './util';

/** Database connection */
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data.db',
    logging: false
});

/** Model to describe a Guild */
export const Guild = sequelize.define(
    'Guild',
    {
        guildId: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true
        },
        enabledSourcesCSV: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    },
    {
        timestamps: false, 
    },
);

/** Model to describe a Special Effect */
export const SpecialEffect = sequelize.define(
    'SpecialEffect',
    {
        guildId: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        source: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        attacker: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        defender: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        critRequired: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        opponentFumbleRequired: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        weaponTypesCSV: {
            type: DataTypes.TEXT
        }
    },
    {
        timestamps: false, 
    },
);

/** Special effects that are imported from disk are assigned this guildId */
export const GLOBAL_GUILD_ID = 'GLOBAL';

/**
 * Initialize the database 
 * @param {string} specialEffectsPath Path to the folder where special effects files are stored
 * @returns {Promise<number>} Returns amount of special effects imported to the database
*/
export async function dbInit(specialEffectsPath: string): Promise<number> {
    // await sequelize.sync({ force: true }); // DELETES DATABASE, only for dev use
    await sequelize.sync();
    const specialEffectsFiles = fs.readdirSync(specialEffectsPath).filter((file: string) => file.endsWith('.js'));
    
    const specialEffects: specialEffect[] = [];

    // Read all the special effect files and prepare them for the database
    for (const file of specialEffectsFiles) {
        const filePath = path.join(specialEffectsPath, file);
        await import(filePath).then(se_or_seSet => {
            if (isSpecialEffectSet(se_or_seSet)) {
                // Loop through the set
                for (const se of se_or_seSet.specialEffects) {
                    se.guildId = GLOBAL_GUILD_ID;
                    se.source = se_or_seSet.source;
                    specialEffects.push(se);
                }
            } else if (isSpecialEffect(se_or_seSet)) {
                se_or_seSet.guildId = GLOBAL_GUILD_ID;
                specialEffects.push(se_or_seSet);
            } else {
                console.error('database.js: dbInit() - Error on importing');
            }
        });
    }

    const dbSpecialEffects = await SpecialEffect.bulkCreate(specialEffects);
    return(dbSpecialEffects.length);
}

/**
 * Add a guild to guilds table
 * @param {string} guildId
 * @returns {Promise<boolean>} True if the guildI already existed in the database
*/
export async function dbAddGuild(guildId: string): Promise<boolean> {
    const guild = await Guild.findOne({
        where: {
            guildId: guildId
        }
    });
    if (guild) return true;

    // Create the guild if it wasn't in the database already
    await Guild.create({
        guildId: guildId,
        enabledSourcesCSV: 'Core Rule Book' // Enable the Core Rule Book by default
    });

    return false;
}

/**
 * Get array of enabled sources for a guildId
 * @param {string} guildId
 * @returns {string[]}
*/
export async function dbGetGuildEnabledSources(guildId: string): Promise<string[]> {
    const guildEnabledSourcesCSV = await Guild.findOne({
        attributes: ['enabledSourcesCSV'],
        where: {
            guildId: guildId
        }
    });

    if (!guildEnabledSourcesCSV) {
        console.error('database.js: dbGetGuildEnabledSources - guildId does not exist');
        return [];
    }
    
    const sourcesString = guildEnabledSourcesCSV.toJSON().enabledSourcesCSV as string;
    if (sourcesString) return sourcesString.split(',');
    return [];
}

/**
 * Get currently enabled special effects for a guildId
 * @param {string} guildId
 * @returns {Promise<specialEffect[]>}
*/
export async function dbGetGuildSpecialEffects(guildId: string): Promise<specialEffect[]> {
    // Gets global special effects and any special effects associated with the guild, must be filtered to exlude disabled special effects
    const dbSpecialEffects = await SpecialEffect.findAll({
        where: {
            [Op.or]: [
                { guildId: GLOBAL_GUILD_ID },
                { guildId: guildId }
            ]
        }
    });

    const specialEffects: specialEffect[] = [];
    dbSpecialEffects.forEach(dbSe => {
        specialEffects.push(dbSe.toJSON());
    });

    // Filter the speical effects so that there's only the enabled ones
    const enabledSources = await dbGetGuildEnabledSources(guildId);
    return specialEffects.filter((se) => { return enabledSources.includes(se.source); });
}

/**
 * Get array of available sources for a guildId. Includes enabled and disabled sources
 * @param {string} guildId
 * @returns {string[]}
*/
export async function dbGetAvailableSources(guildId: string): Promise<string[]> {
    // Gets all the sources that are global and associated with the guildId, must be trimmed down
    const dbSpecialEffects = await SpecialEffect.findAll({
        attributes: ['source'],
        where: {
            [Op.or]: [
                { guildId: GLOBAL_GUILD_ID },
                { guildId: guildId }
            ]
        }
    });
    
    // SELECT DISTINCT source FROM SpecialEffects WHERE guildId='${guildId}' OR guildId='${GLOBAL_GUILD_ID}'
    // Sequelize does not support 'DISTINCT', so do this instead
    const sources = dbSpecialEffects.map((se) => se.toJSON().source as string);
    const uniqueSources = [...new Set(sources)];

    return uniqueSources;
}

/**
 * Set enabledSourcesCSV value for specific guildId in the database
 * @param {string} guildId
 * @param {string[]} sources
*/
async function dbSetGuildEnabledSourcesCSV(guildId: string, sources: string[]): Promise<void> {
    const newSources = sources.join(',');
    await Guild.update(
        { enabledSourcesCSV: newSources },
        {
            where: {
                guildId: guildId
            }
        }
    );

    return;
}

/**
 * Add a source to the enabledSourcesCSV value for specific guildId in the database
 * @param guildId 
 * @param source 
 */
export async function dbAddEnabledSource(guildId: string, source: string): Promise<void> {
    const enabledSources = await dbGetGuildEnabledSources(guildId);
    if (enabledSources.includes(source)) {
        // This shouldn't happen
        console.warn('database.js: dbAddEnabledSource() - Source already exists');
        return;
    }

    enabledSources.push(source);
    dbSetGuildEnabledSourcesCSV(guildId, enabledSources);
}

/**
 * Delete a source in the enabledSourcesCSV value for specific guildId in the database
 * @param guildId 
 * @param source 
 */
export async function dbDeleteEnabledSource(guildId: string, source: string): Promise<void> {
    const availableSources = await dbGetGuildEnabledSources(guildId);
    if (!availableSources.includes(source)) {
        // This shouldn't happen
        console.warn('database.js: dbAddEnabledSource() - Source isn\' available to provided guildId');
        return;
    }

    const enabledSources = await dbGetGuildEnabledSources(guildId);
    dbSetGuildEnabledSourcesCSV(guildId, enabledSources.filter((s) => {return s != source;}));
}