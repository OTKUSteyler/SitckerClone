import { registerCommand } from "@vendetta/commands";
import settings from "./settings";
import { storage } from "@vendetta/plugin";

// Default settings
if (!storage.sourceGuildId) storage.sourceGuildId = "";
if (!storage.targetGuildId) storage.targetGuildId = "";

// Sticker cloning function
async function cloneSticker(stickerId: string, targetGuildId: string) {
    try {
        // Fetch the sticker metadata
        const sticker = await fetch(`https://discord.com/api/v10/stickers/${stickerId}`, {
            headers: {
                Authorization: `Bearer ${window.DiscordNative.user.token}`, // Use user's token
            },
        }).then((res) => res.json());

        if (!sticker || !sticker.id) {
            return console.error("Sticker not found or invalid.");
        }

        // Download sticker file
        const stickerFile = await fetch(sticker.asset).then((res) => res.blob());

        // Create form data for the upload
        const formData = new FormData();
        formData.append("name", sticker.name);
        formData.append("description", sticker.description || "Cloned sticker");
        formData.append("tags", sticker.tags);
        formData.append("file", stickerFile, `${sticker.name}.png`);

        // Upload sticker to the target guild
        await fetch(`https://discord.com/api/v10/guilds/${targetGuildId}/stickers`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${window.DiscordNative.user.token}`,
            },
            body: formData,
        });

        console.log(`Sticker '${sticker.name}' successfully cloned.`);
    } catch (error) {
        console.error("Error cloning sticker:", error);
    }
}

// Register a command to clone stickers
const unregister = registerCommand({
    name: "cloneSticker",
    displayName: "cloneSticker",
    description: "Clone a selected sticker to another server",
    options: [
        {
            name: "stickerId",
            description: "ID of the sticker to clone",
            required: true,
            type: 3, // STRING
        },
        {
            name: "targetGuildId",
            description: "ID of the target server",
            required: true,
            type: 3, // STRING
        },
    ],
    execute: async (args, ctx) => {
        const stickerId = args[0].value;
        const targetGuildId = args[1].value;

        if (!stickerId || !targetGuildId) {
            return {
                content: "Usage: /cloneSticker <stickerId> <targetGuildId>",
            };
        }

        await cloneSticker(stickerId, targetGuildId);

        return {
            content: "Sticker cloning initiated. Check logs for progress.",
        };
    },
});

// Export settings panel for configuration
export const settingsPanel = () =>
    settings({
        sourceGuildId: storage.sourceGuildId,
        targetGuildId: storage.targetGuildId,
        saveSettings: (newSettings: { sourceGuildId: string; targetGuildId: string }) => {
            storage.sourceGuildId = newSettings.sourceGuildId;
            storage.targetGuildId = newSettings.targetGuildId;
        },
    });

export const onUnload = () => {
    unregister();
};
