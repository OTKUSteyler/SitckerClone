/**
 * @name CloneStickers
 * @version 1.0.0
 * @description Clones stickers from one server to another.
 * @author btmc727
 * @source https://github.com/OTKUSteyler/StickerClone
 */

import { BdApiModule } from "betterdiscord-types";

declare const BdApi: BdApiModule;

interface Sticker {
    id: string;
    name: string;
    description: string | null;
    tags: string[];
    url: string;
}

export default class CloneStickers {
    start(): void {
        BdApi.showToast("CloneStickers Plugin Enabled!");
    }

    stop(): void {
        BdApi.showToast("CloneStickers Plugin Disabled!");
    }

    async cloneStickers(sourceGuildId: string, targetGuildId: string): Promise<void> {
        try {
            const guildModule = BdApi.findModuleByProps("getGuild");
            const stickersModule = BdApi.findModuleByProps("getStickers", "uploadSticker");

            const sourceGuild = guildModule.getGuild(sourceGuildId);
            const targetGuild = guildModule.getGuild(targetGuildId);

            if (!sourceGuild || !targetGuild) {
                BdApi.showToast("Invalid server IDs provided.", { type: "error" });
                return;
            }

            const stickers: Sticker[] = stickersModule.getStickers(sourceGuildId);

            if (!stickers || stickers.length === 0) {
                BdApi.showToast("No stickers found in the source server.", { type: "error" });
                return;
            }

            for (const sticker of stickers) {
                const blob = await fetch(sticker.url).then((res) => res.blob());

                await stickersModule.uploadSticker(targetGuildId, {
                    name: sticker.name,
                    description: sticker.description,
                    tags: sticker.tags,
                    file: blob,
                });

                BdApi.showToast(`Cloned sticker: ${sticker.name}`, { type: "success" });
            }

            BdApi.showToast(`Successfully cloned ${stickers.length} stickers to ${targetGuild.name}.`);
        } catch (error) {
            console.error("Error cloning stickers:", error);
            BdApi.showToast("An error occurred while cloning stickers.", { type: "error" });
        }
    }

    getSettingsPanel(): HTMLElement {
        const panel = document.createElement("div");

        panel.innerHTML = `
            <h3>Clone Stickers Settings</h3>
            <label>Source Server ID:</label><br>
            <input type="text" id="sourceGuildId" placeholder="Enter Source Server ID"><br><br>
            <label>Target Server ID:</label><br>
            <input type="text" id="targetGuildId" placeholder="Enter Target Server ID"><br><br>
            <button id="cloneButton">Clone Stickers</button>
        `;

        panel.querySelector<HTMLButtonElement>("#cloneButton")!.onclick = () => {
            const sourceGuildId = (panel.querySelector<HTMLInputElement>("#sourceGuildId")!.value || "").trim();
            const targetGuildId = (panel.querySelector<HTMLInputElement>("#targetGuildId")!.value || "").trim();

            if (!sourceGuildId || !targetGuildId) {
                BdApi.showToast("Please enter both Source and Target Server IDs.", { type: "error" });
                return;
            }

            this.cloneStickers(sourceGuildId, targetGuildId);
        };

        return panel;
    }
}
