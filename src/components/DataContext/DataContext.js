import React, { useState } from "react"
import PropTypes from "prop-types"

const DataContext = React.createContext([{}, () => {}])

const DataProvider = (props) => {
    const [state, setState] = useState({
        client: undefined,
        mnemonic: undefined,
        config: {},
        selectedKey: undefined,
        isOwner: false,
        activeValue: undefined,
        activeMap: undefined,
        loadingValue: false,
        activeTTL: undefined,
        loadingTTL: false,
        keys: [],
        keyPrefix: undefined,
        tempKeys: [],
        log: undefined,
        nodeInfo: undefined,
        accountInfo: undefined,
        commandQueue: undefined,
        currentPosition: 0,
        gas_price: 0.002,
        max_gas: 10000000,
        isBusy: false,
    })

    return (
        <DataContext.Provider value={[state, setState]}>
            {props.children}
        </DataContext.Provider>
    )
}

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { DataContext, DataProvider }
