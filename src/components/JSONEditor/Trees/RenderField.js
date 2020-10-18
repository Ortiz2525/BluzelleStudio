import React from "react";

import EditableField from "../../EditableField";
import { Delete } from "../Buttons";
import { mapRecursive } from "../JSONEditor";

const RenderField = ({
    val,
    set,
    del,
    preamble,
    editing,
    onChange,
    hovering,
}) => (
    <div>
        {preamble && <span style={{ marginRight: 5 }}>{preamble}:</span>}

        <EditableField
            active={editing}
            onChange={(v) => {
                onChange();

                set(mapRecursive(JSON.parse(v)));
            }}
            val={JSON.stringify(val)}
            validateJSON={true}
            renderVal={(v) => (
                <span style={{ color: colorFromType(v) }}>{v}</span>
            )}
        />

        {hovering && del && <Delete onClick={() => del()} />}
    </div>
);

const colorTypeMap = {
    string: "blue",
    number: "red",
    boolean: "purple",
};

const colorFromType = (obj) => colorTypeMap[typeof JSON.parse(obj)] || "pink";

export default RenderField;
