import { useContext } from "react";
import { DataContext } from "./DataContext";

import { getClient } from "../../services/BluzelleService";

const useData = () => {
    const [state, setState] = useContext(DataContext);

    const setMnemonic = (mnemonic) => {
        setState((state) => ({ ...state, mnemonic }));
    };

    const setIsLoading = (isLoading) => {
        setState((state) => ({ ...state, isLoading }));
    };

    const setKeys = (keys) => {
        setState((state) => ({ ...state, keys }));
    };

    const setSelectedKey = (selectedKey) => {
        setState((state) => ({ ...state, selectedKey }));
    };

    const setValue = (key, value) => {
        setState((state) => ({ ...state, key: value }));
    };

    const refreshKeys = () =>
        new Promise((resolve) => {
            setIsLoading(true);

            getClient()
                .keys()
                .then((k) => {
                    setKeys(k);
                    setIsLoading(false);

                    resolve();
                })
                .catch(() => {
                    setIsLoading(false);
                    alert(
                        "Failed to fetch keys due to bluzelle network error."
                    );

                    resolve();
                });
        });

    return {
        setMnemonic,
        setIsLoading,
        setKeys,
        setSelectedKey,
        setValue,

        refreshKeys,

        mnemonic: state.mnemonic,
        isLoading: state.isLoading,
        keys: state.keys,
        selectedKey: state.selectedKey,
    };
};

export default useData;
