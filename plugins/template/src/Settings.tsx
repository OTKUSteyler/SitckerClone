import React, { useState } from "react";

interface SettingsProps {
    settings: {
        sourceGuildId: string;
        targetGuildId: string;
    };
    saveSettings: (newSettings: { sourceGuildId: string; targetGuildId: string }) => void;
}

const CloneStickersSettings: React.FC<SettingsProps> = ({ settings, saveSettings }) => {
    const [sourceGuildId, setSourceGuildId] = useState(settings.sourceGuildId || "");
    const [targetGuildId, setTargetGuildId] = useState(settings.targetGuildId || "");

    const handleSave = () => {
        saveSettings({ sourceGuildId, targetGuildId });
    };

    return (
        <div style={{ padding: "10px" }}>
            <h2>Clone Stickers Plugin Settings</h2>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>Source Server ID:</strong>
                </label>
                <input
                    type="text"
                    value={sourceGuildId}
                    onChange={(e) => setSourceGuildId(e.target.value)}
                    placeholder="Enter Source Server ID"
                    style={{
                        width: "100%",
                        padding: "5px",
                        marginTop: "5px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                    }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>Target Server ID:</strong>
                </label>
                <input
                    type="text"
                    value={targetGuildId}
                    onChange={(e) => setTargetGuildId(e.target.value)}
                    placeholder="Enter Target Server ID"
                    style={{
                        width: "100%",
                        padding: "5px",
                        marginTop: "5px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                    }}
                />
            </div>
            <button
                onClick={handleSave}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Save Settings
            </button>
        </div>
    );
};

export default CloneStickersSettings;
