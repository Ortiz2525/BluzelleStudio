import React from "react";

import RenderTree from "./Trees/RenderTree";
import { observe } from "mobx";

import { isObservable, toJS } from "mobx";
import { isPlainObject, mapValues, extend } from "lodash";

import { execute } from "../../services/CommandQueueService";
import useData from "components/DataContext/useData";

const activeObservableMap = observable();

export const mapRecursive = (obj) => {
    const omr = isPlainObject(obj)
        ? mapValues(obj, mapRecursive)
        : Array.isArray(obj)
        ? obj.map(mapRecursive)
        : obj;

    isObservable(omr) && observe(omr, () => onChange());

    return omr;
};

// We update the underyling object of activeValue to mirror the non-obsevable version of activeObservableMap;
// the observers on activeValue are not called.

const onChange = () => {
    const { activeValue, setActiveValue } = useData();

    for (let prop in activeValue) {
        delete activeValue[prop];
    }

    extend(activeValue, toJS(activeObservableMap.get()));
    setActiveValue(activeValue);
};

// observe(activeValue, ({ newValue }) => {
//     if (typeof newValue === "object" && !(newValue instanceof Uint8Array)) {
//         activeObservableMap.set(mapRecursive(newValue));
//     }
// });

const JSONEditor = () => {
    const [activeMap, setActiveMap] = useState(undefined);

    if (activeMap.get() === undefined) {
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
