import React from "react";

import JSONEditor from "./JSONEditor";
import ExpiryBar from "./ExpiryBar";
import PlainTextEditor from "./PlainTextEditor";
import FileEditor from "./FileEditor/FileEditor";
import loadingBar from "./loadingBar";

import useData from "./DataContext/useData";

const Editor = () => {
    const { activeValue, loadingValue } = useData();

    const showExpiryBar = activeValue !== undefined && !loadingValue;

    return (
        <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
            {showExpiryBar && <ExpiryBar />}
            {showExpiryBar && (
                <div>
                    <hr style={{ marginBottom: 0 }} />
                </div>
            )}
            <Body />
            {showExpiryBar && (
                <div
                    style={{
                        fontStyle: "italic",
                        fontSize: "0.7em",
                        textAlign: "center",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}>
                    Actual database value may change. Refresh to see the most
                    up-to-date.
                </div>
            )}
        </div>
    );
};

const Body = () => {
    const { activeValue, loadingValue } = useData();

    if (activeValue instanceof Uint8Array) {
        return <FileEditor />;
    }

    const type = typeof activeValue;

    if (type === "string") {
        return <PlainTextEditor />;
    }

    if (type === "object" || type === "boolean" || type === "number") {
        return <JSONEditor />;
    }

    if (loadingValue) {
        return (
            <div style={{ textAlign: "center", padding: 15 }}>{loadingBar}</div>
        );
    }

    return <div></div>;
};

export default Editor;
