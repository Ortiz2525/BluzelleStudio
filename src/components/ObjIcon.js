import React from "react";

export const TextIcon = () => <span></span>;

// <BS.Glyphicon glyph='font'/>;

export const FileIcon = () => TextIcon();

//<BS.Glyphicon glyph='file'/>;

export const JSONIcon = () => (
    <span
        style={{
            fontWeight: "bold",
            fontFamily: "monospace",
        }}>
        {"{}"}
    </span>
);

export const ValIcon = ({ val }) => {
    if (typeof val === "string") {
        return <TextIcon />;
    }

    if (val instanceof Uint8Array) {
        return <FileIcon />;
    }

    if (typeof val === "object") {
        return <JSONIcon />;
    }

    return <FileIcon />; // <BS.Glyphicon glyph='question-sign'/>;
};
