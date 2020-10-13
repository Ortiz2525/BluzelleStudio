import { useContext } from "react";
import { DataContext } from "./DataContext";

import { getClient } from "../../services/BluzelleService";

const useData = () => {
    const [state, setState] = useContext(DataContext);

    const setMnemonic = (mnemonic) => {
        setState((state) => ({ ...state, mnemonic }));
    };

    const setSelectedKey = (selectedKey) => {
        setState((state) => ({ ...state, selectedKey }));
    };

    const setIsWriter = (isWriter) => {
        setState((state) => ({ ...state, isWriter }));
    };

    const setWriters = (writers) => {
        setState((state) => ({ ...state, writers }));
    };

    const setValue = (key, value) => {
        setState((state) => ({ ...state, key: value }));
    };

    return {
        setMnemonic,
        setSelectedKey,
        setIsWriter,
        setWriters,
        setValue,

        mnemonic: state.mnemonic,
        selectedKey: state.selectedKey,
        isWriter: state.isWriter,
        writers: state.writers,
    };
};

export default useData;
