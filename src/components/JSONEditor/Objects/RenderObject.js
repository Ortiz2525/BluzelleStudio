import React, { useState } from "react";

import Collapsible from "../Collapsible";
import { Plus, Edit, Delete } from "../Buttons";
import Hoverable from "../Hoverable.js";
import RenderTreeWithEditableKey from "./RenderTreeWithEditableKey";
import NewField from "./NewField";
import { mapRecursive } from "../JSONEditor";
import useCommandQueueService from "../../../services/CommandQueueService";

const RenderObject = (props) => {
    const [showNewField, setShowNewField] = useState(false);
    const { execute } = useCommandQueueService();

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

                    if (val[key]) {
                        alert("Key already exists in object.");
                        return;
                    }

                    const v2 = mapRecursive(v);

                    execute({
                        doIt: () => Promise.resolve((val[key] = v2)),
                        undoIt: () => Promise.resolve(delete val[key]),
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
                val={val[subkey]}
                set={(v) => {
                    const v2 = omr(v);
                    const old = val[subkey];

                    execute({
                        doIt: () => Promise.resolve((val[subkey] = v2)),
                        undoIt: () => Promise.resolve((val[subkey] = old)),
                        message: (
                            <span>
                                Set <code key={1}>{subkey}</code> to{" "}
                                <code key={2}>{JSON.stringify(v)}</code>.
                            </span>
                        ),
                    });
                }}
                del={() => {
                    const old = val[subkey];

                    execute({
                        doIt: () => Promise.resolve(delete val[subkey]),
                        undoIt: () => Promise.resolve((val[subkey] = old)),
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
            label={`{} (${Object.keys(val).length} entries)`}
            buttons={buttons}
            preamble={preamble}>
            {newField}
            {fieldList}
        </Collapsible>
    );
};

export default RenderObject;
