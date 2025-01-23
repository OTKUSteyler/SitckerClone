import { registerCommand } from "@vendetta/commands";
import settings from "./settings";
import { storage } from "@vendetta/plugin";
// Default settings
storage.sourceGuildId ||= ""; // Set default if undefined
storage.targetGuildId ||= ""; // Set default if undefined
// Fetch utility to encapsulate error handling
async function fetchWithErrorHandling(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(HTTP error! status: ${response.status}, message: ${errorMessage});
    }
    return response;
}
// Sticker cloning function
async function cloneSticker(stickerId: string, targetGuildId: string) {
    try {
        // Fetch the sticker metadata
        const stickerResponse = await fetchWithErrorHandling(
            https://discord.com/api/v10/stickers/${stickerId},
            {
                headers: {
                    Authorization: Bearer ${window.DiscordNative.user.token},
                },
            }
        );
        const sticker = await stickerResponse.json();
        if (!sticker || !sticker.id) {
            throw new Error("Sticker not found or invalid.");
        }
        // Download sticker file
        const stickerFileResponse = await fetchWithErrorHandling(sticker.asset);
        const stickerFile = await stickerFileResponse.blob();
        // Create form data for the upload
        const formData = new FormData();
        formData.append("name", sticker.name);
        formData.append("description", sticker.description || "Cloned sticker");
        formData.append("tags", sticker.tags || ""); // Ensure a default value
        formData.append("file", stickerFile, ${sticker.name}.png);
        // Upload sticker to the target guild
        await fetchWithErrorHandling(https://discord.com/api/v10/guilds/${targetGuildId}/stickers, {
            method: "POST",
            headers: {
                Authorization: Bearer ${window.DiscordNative.user.token},
            },
            body: formData,
        });
        console.log(Sticker '${sticker.name}' successfully cloned.);
    } catch (error) {
        console.error("Error cloning sticker:", error);
    }
}
// Register a command to clone stickers
const unregister = registerCommand({
    name: "cloneSticker",
    displayName: "Clone Sticker",
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
HTTP error! status: ${response.status}, message: ${errorMessage}https://discord.com/api/v10/stickers/${stickerId}Bearer ${window.DiscordNative.user.token}${sticker.name}.pnghttps://discord.com/api/v10/guilds/${targetGuildId}/stickersBearer ${window.DiscordNative.user.token}Sticker '${sticker.name}' successfully clone
