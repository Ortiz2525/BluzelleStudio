import React, { useState } from "react";

import RenderTree from "../Trees/RenderTree";
import Collapsible from "../Collapsible";
import { Plus, Edit, Delete } from "../Buttons";
import Hoverable from "../Hoverable";
import NewField from "./NewField";

import { mapRecursive } from "../JSONEditor";

import useCommandQueueService from "../../../services/CommandQueueService";

const RenderArray = (props) => {
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
                preamble={val.length}
                onChange={(newObj) => {
                    setShowNewField(false);

                    const v2 = mapRecursive(newObj);

                    execute({
                        doIt: () => Promise.resolve(val.push(v2)),
                        undoIt: () => Promise.resolve(val.pop()),
                        message: (
                            <span>
                                Pushed{" "}
                                <code key={1}>{JSON.stringify(newObj)}</code>.
                            </span>
                        ),
                    });
                }}
                onError={() => setShowNewField(false)}
            />
        </Hoverable>
    );

    const fieldList = val.map((value, index) => (
        <RenderTree
            key={index}
            val={value}
            set={(v) => {
                execute({
                    doIt: () => Promise.resolve((val[index] = v)),
                    undoIt: () => Promise.resolve((val[index] = value)),
                    message: (
                        <span>
                            Set index <code key={1}>{index}</code> to{" "}
                            <code key={2}>{JSON.stringify(v)}</code>.
                        </span>
                    ),
                });
            }}
            del={() => {
                execute({
                    doIt: () => Promise.resolve(val.splice(index, 1)),
                    undoIt: () => Promise.resolve(val.splice(index, 0, value)),
                    message: (
                        <span>
                            Deleted index <code key={1}>{index}</code>.
                        </span>
                    ),
                });
            }}
            preamble={<span>{index}</span>}
        />
    ));

    return (
        <Collapsible
            label={`[] (${val.length} entries)`}
            buttons={buttons}
            preamble={preamble}>
            {fieldList}
            {newField}
        </Collapsible>
    );
};

export default RenderArray;
