import React, { useState } from "react";

import RenderArray from "../Arrays/RenderArray";
import RenderObject from "../Objects/RenderObject";
import RenderField from "./RenderField";
import Hoverable from "../Hoverable";

const RenderTree = (props) => {
    const [editing, setEditing] = useState(false);

    const { val } = props;
    let r;

    // If array
    if (!editing && Array.isArray(val)) {
        r = <RenderArray {...props} onEdit={() => setEditing(true)} />;

        // If object
    } else if (!editing && typeof val === "object") {
        r = <RenderObject {...props} onEdit={() => setEditing(true)} />;

        // Standard datatypes
    } else {
        r = (
            <RenderField
                {...props}
                editing={editing}
                onChange={() => setEditing(false)}
            />
        );
    }

    return (
        <span style={{ fontFamily: "monospace" }}>
            <Hoverable>{r}</Hoverable>
        </span>
    );
};

export default RenderTree;
