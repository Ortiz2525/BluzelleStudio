import { useContext } from "react";
import { DataContext } from "./DataContext";

import { getClient } from "../../services/BluzelleService";

// For updating activeTTL
let time, countdown, value;
let update_time = true;

const useData = () => {
    const [state, setState] = useContext(DataContext);

    const setMnemonic = (mnemonic) => {
        setState((state) => ({ ...state, mnemonic }));
    };

    const setIsWriter = (isWriter) => {
        setState((state) => ({ ...state, isWriter }));
    };

    const setWriters = (writers) => {
        setState((state) => ({ ...state, writers }));
    };

    const setActiveValue = (activeValue) => {
        setState((state) => ({ ...state, activeValue }));
    };

    const setLoadingValue = (loadingValue) => {
        setState((state) => ({ ...state, loadingValue }));
    };

    const setActiveTTL = (activeTTL) => {
        setState((state) => ({ ...state, activeTTL }));

        if (update_time) {
            time = new Date().getTime();
            value = activeTTL;
        }

        update_time = true;

        clearTimeout(countdown);

        const countdown_f = () => {
            const v = value - Math.round((new Date().getTime() - time) / 1000);

            if (v - 1 <= 0) {
                setTimeout(() => reload(), 1500);
            }

            update_time = false;

            setActiveTTL(v);
        };

        if (activeTTL > 0) {
            countdown = setTimeout(countdown_f, 1000);
        }
    };

    const setLoadingTTL = (loadingTTL) => {
        setState((state) => ({ ...state, loadingTTL }));
    };

    const reloadTTL = () => {
        setLoadingTTL(true);

        getClient()
            .ttl(state.selectedKey)
            .then((value) => {
                setActiveTTL(value);
                setLoadingTTL(false);
            })
            .catch((e) => {
                if (e.message === "TTL_RECORD_NOT_FOUND") {
                    setActiveTTL(0);
                    setLoadingTTL(false);
                } else {
                    alert(
                        "Failed to read time-to-live due to bluzelle network error."
                    );
                    setLoadingTTL(false);
                    console.error(e);
                }
            });
    };

    const setSelectedKey = (selectedKey = undefined) => {
        setState((state) => ({ ...state, selectedKey }));

        setActiveValue(undefined);

        if (selectedKey !== undefined) {
            // We can say that if the value is an object,
            // wrap in an OMR. See: JSONEditor.js.

            setLoadingValue(true);

            getClient()
                .quickread(selectedKey)
                .then((value) => {
                    setActiveValue(value);
                    setLoadingValue(false);
                })
                .catch((e) => {
                    if (e.message.includes("DELETE_PENDING")) {
                        reload();
                    } else {
                        alert(
                            "Failed to quickread value due to bluzelle network error."
                        );
                    }

                    setLoadingValue(false);
                    console.error(e);
                });

            getClient()
                .read(selectedKey)
                .then((value) => {
                    setActiveValue(value);
                    setLoadingValue(false);
                })
                .catch((e) => {
                    if (e.message.includes("DELETE_PENDING")) {
                        reload();
                    } else {
                        alert(
                            "Failed to read value due to bluzelle network error."
                        );
                    }

                    setLoadingValue(false);
                    console.error(e);
                });

            reloadTTL();
        }
    };

    const setKeys = (keys) => {
        setState((state) => ({ ...state, keys: [...keys] }));
    };

    const setTempKeys = (tempKeys) => {
        setState((state) => ({ ...state, tempKeys: [...tempKeys] }));
    };

    const setValue = (key, value) => {
        setState((state) => ({ ...state, [key]: value }));
    };

    return {
        setMnemonic,
        setSelectedKey,
        setIsWriter,
        setWriters,
        setActiveValue,
        setLoadingValue,
        setActiveTTL,
        setLoadingTTL,
        reloadTTL,
        setKeys,
        setTempKeys,
        setValue,

        mnemonic: state.mnemonic,
        selectedKey: state.selectedKey,
        isWriter: state.isWriter,
        writers: state.writers,
        activeValue: state.activeValue,
        loadingValue: state.loadingValue,
        activeTTL: state.activeTTL,
        loadingTTL: state.loadingTTL,
        keys: state.keys,
        tempKeys: state.tempKeys,
    };
};

export default useData;
