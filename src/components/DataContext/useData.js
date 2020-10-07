import { useContext } from "react";
import { DataContext } from "./DataContext";

const useData = () => {
    const [state, setState] = useContext(DataContext);

    const setMnemonic = (mnemonic) => {
        setState((state) => ({ ...state, mnemonic }));
    };

    return {
        setMnemonic,

        mnemonic: state.mnemonic,
    };
};

export default useData;
