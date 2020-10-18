import React, { useState } from "react";
import PropTypes from "prop-types";

const DataContext = React.createContext([{}, () => {}]);

const DataProvider = (props) => {
    const [state, setState] = useState({
        mnemonic: undefined,
        config: {},
        selectedKey: undefined,
        isWriter: false,
        writers: {},
        activeValue: undefined,
        activeValueMap: undefined,
        loadingValue: false,
        activeTTL: undefined,
        loadingTTL: false,
        keys: [],
        tempKeys: [],
        log: undefined,
        metaStatus: undefined,
        metaSize: undefined,
    });

    return (
        <DataContext.Provider value={[state, setState]}>
            {props.children}
        </DataContext.Provider>
    );
};

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { DataContext, DataProvider };
