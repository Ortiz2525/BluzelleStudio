import React, { useState } from "react";
import PropTypes from "prop-types";

const DataContext = React.createContext([{}, () => {}]);

const DataProvider = (props) => {
    const [state, setState] = useState({
        mnemonic: undefined,
        selectedKey: undefined,
        isWriter: false,
        writers: {},
        activeValue: undefined,
        loadingValue: false,
        activeTTL: undefined,
        loadingTTL: false,
        keys: [],
        tempKeys: [],
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
