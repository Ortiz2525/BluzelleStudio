import React, { useState } from "react";
import PropTypes from "prop-types";

const DataContext = React.createContext([{}, () => {}]);

const DataProvider = (props) => {
    const [state, setState] = useState({
        mnemonic: null,
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
