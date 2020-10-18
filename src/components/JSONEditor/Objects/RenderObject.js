import React, { useState } from "react";

import Collapsible from "../Collapsible";
import { Plus, Edit, Delete } from "../Buttons";
import Hoverable from "../Hoverable.js";
import { RenderTreeWithEditableKey } from "./RenderTreeWithEditableKey";
import NewField from "./NewField";
import { observableMapRecursive as omr } from "../JSONEditor";
import { execute } from "../../../services/CommandQueueService";

const RenderObject = (props) => {
    const [showNewField, setShowNewField] = useState(false);

    const { val, set, del, preamble, hovering, onEdit } = props;

    const buttons = hovering && (
        <React.Fragment>
            <Plus onClick={() => setShowNewField(true)} />
            {del && <Delete onClick={del} />}
            <Edit onClick={onEdit} />
        </React.Fragment>
    );

    const newField = showNewField && (
        <Hoverable>
            <NewField
                onChange={(key, v) => {
                    setShowNewField(false);

                    if (val.has(key)) {
                        alert("Key already exists in object.");
                        return;
                    }

                    const v2 = omr(v);

                    execute({
                        doIt: () => Promise.resolve(val.set(key, v2)),
                        undoIt: () => Promise.resolve(val.delete(key)),
                        message: (
                            <span>
                                New field <code key={1}>{key}</code>:{" "}
                                <code key={2}>{JSON.stringify(v)}</code>.
                            </span>
                        ),
                    });
                }}
                onError={() => setShowNewField(false)}
            />
        </Hoverable>
    );

    const fieldList = val
        .keys()
        .sort()
        .map((subkey) => (
            <RenderTreeWithEditableKey
                key={subkey}
                preamble={subkey}
                val={val.get(subkey)}
                set={(v) => {
                    const v2 = omr(v);
                    const old = val.get(subkey);

                    execute({
                        doIt: () => Promise.resolve(val.set(subkey, v2)),
                        undoIt: () => Promise.resolve(val.set(subkey, old)),
                        message: (
                            <span>
                                Set <code key={1}>{subkey}</code> to{" "}
                                <code key={2}>{JSON.stringify(v)}</code>.
                            </span>
                        ),
                    });
                }}
                del={() => {
                    const old = val.get(subkey);

                    execute({
                        doIt: () => Promise.resolve(val.delete(subkey)),
                        undoIt: () => Promise.resolve(val.set(subkey, old)),
                        message: (
                            <span>
                                Deleted <code key={1}>{subkey}</code>.
                            </span>
                        ),
                    });
                }}
            />
        ));

    return (
        <Collapsible
            label={`{} (${val.keys().length} entries)`}
            buttons={buttons}
            preamble={preamble}>
            {newField}
            {fieldList}
        </Collapsible>
    );
};

export default RenderObject;
