import React from "react";

import RenderTree from "./Trees/RenderTree";
import { isPlainObject, mapValues, extend } from "lodash";

import useCommandQueueService from "../../services/CommandQueueService";
import useData from "components/DataContext/useData";

export const mapRecursive = (obj) => {
    const omr = isPlainObject(obj)
        ? mapValues(obj, mapRecursive)
        : Array.isArray(obj)
        ? obj.map(mapRecursive)
        : obj;

    return omr;
};

const JSONEditor = () => {
    const { activeValue, setActiveValue, activeMap, setActiveMap } = useData();
    const { execute } = useCommandQueueService();

    useEffect(() => {
        for (let prop in activeValue) {
            delete activeValue[prop];
        }

        extend(activeValue, activeMap);
        setActiveValue(activeValue);
    }, [activeMap]);

    useEffect(() => {
        if (
            typeof activeValue === "object" &&
            !(activeValue instanceof Uint8Array)
        ) {
            setActiveMap(mapRecursive(activeValue));
        }
    }, [activeValue]);

    if (activeMap === undefined) {
        return null;
    }

    return (
        <RenderTree
            val={activeMap}
            set={(v) => {
                if (typeof v !== "object") {
                    alert("Must be object type.");
                    return;
                }

                const v2 = mapRecursive(v);
                const old = activeMap;

                execute({
                    doIt: () => Promise.resolve(setActiveMap(v2)),
                    undoIt: () => Promise.resolve(setActiveMap(old)),
                    message: (
                        <span>
                            Set root to <code key={1}>{JSON.stringify(v)}</code>
                            .
                        </span>
                    ),
                });
            }}
        />
    );
};

export default JSONEditor;
