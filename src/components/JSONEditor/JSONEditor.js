import RenderTree from "./Trees/RenderTree";
import { observe } from "mobx";
import { activeValue } from "../../services/CRUDService";

import { isObservable, toJS } from "mobx";
import { isPlainObject, mapValues, extend } from "lodash";

import { execute } from "../../services/CommandQueueService";
import useData from "components/DataContext/useData";

const activeObservableMap = observable();

export const observableMapRecursive = (obj) => {
    const omr = isPlainObject(obj)
        ? observable.map(mapValues(obj, observableMapRecursive))
        : Array.isArray(obj)
        ? observable.array(obj.map(observableMapRecursive))
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

observe(activeValue, ({ newValue }) => {
    if (typeof newValue === "object" && !(newValue instanceof Uint8Array)) {
        activeObservableMap.set(observableMapRecursive(newValue));
    }
});

const JSONEditor = () => {
    if (activeObservableMap.get() === undefined) {
        return null;
    }

    return (
        <RenderTree
            val={activeObservableMap.get()}
            set={(v) => {
                if (typeof v !== "object") {
                    alert("Must be object type.");
                    return;
                }

                const v2 = observableMapRecursive(v);
                const old = activeObservableMap.get();

                execute({
                    doIt: () => Promise.resolve(activeObservableMap.set(v2)),
                    undoIt: () => Promise.resolve(activeObservableMap.set(old)),
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
