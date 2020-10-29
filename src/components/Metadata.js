import React, { Fragment, useState, useEffect } from "react"

import useData from "./DataContext/useData"
import useBluzelle from "services/BluzelleService"

const Metadata = () => {
    const {
        mnemonic,
        config,
        nodeInfo,
        accountInfo,
        gasPrice,
        setGasPrice,
        maxGas,
        setMaxGas,
    } = useData()

    const [version, setVersion] = useState(0)
    const [showMnemonic, setShowMnemonic] = useState(false)
    const [gasP, setGasP] = useState(0)
    const [maxG, setMaxG] = useState(0)
    const { getClient } = useBluzelle()

    useEffect(() => {
        getClient()
            .version()
            .then((v) => setVersion(v))
    }, [])

    useEffect(() => {
        if (gasPrice && maxGas) {
            setGasP(gasPrice)
            setMaxG(maxGas)
        }
    }, [gasPrice, maxGas])

    const formatKey = (key) => {
        key = key.split("_").join(" ").split("-").join(" ")
        return key.charAt(0).toUpperCase() + key.slice(1)
    }

    return (
        <Fragment>
            <BS.Table>
                <thead>
                    <tr>
                        <th colSpan={2}>Application Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope='row' style={{ verticalAlign: "middle" }}>
                            Mnemonic
                        </th>
                        <td>
                            <BS.Button
                                outline={showMnemonic}
                                color='secondary'
                                type='button'
                                onClick={() => setShowMnemonic(!showMnemonic)}>
                                <i className='far fa-eye'></i>
                            </BS.Button>
                            <div>{showMnemonic && <code>{mnemonic}</code>}</div>
                        </td>
                    </tr>
                    <tr>
                        <th scope='row'>Blzjs version</th>
                        <td>
                            <code>{version}</code>
                        </td>
                    </tr>
                    <tr>
                        <th scope='row'>Uuid</th>
                        <td>
                            <code>{config.uuid}</code>
                        </td>
                    </tr>
                    <tr>
                        <th scope='row' style={{ verticalAlign: "middle" }}>
                            Gas Price (UBLZ)
                        </th>
                        <td>
                            <BS.InputGroup
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                <BS.Input
                                    type='number'
                                    name='gas_price'
                                    value={gasP}
                                    onChange={(e) => setGasP(e.target.value)}
                                    placeholder='Gas Price'
                                />
                                <BS.InputGroupAddon addonType='append'>
                                    <BS.Button
                                        color='primary'
                                        type='button'
                                        disabled={gasPrice == gasP}
                                        onClick={() =>
                                            setGasPrice(parseFloat(gasP))
                                        }>
                                        <i className='fa fa-check'></i>
                                    </BS.Button>
                                </BS.InputGroupAddon>
                            </BS.InputGroup>
                        </td>
                    </tr>
                    <tr>
                        <th scope='row' style={{ verticalAlign: "middle" }}>
                            Max Gas
                        </th>
                        <td>
                            <BS.InputGroup
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                <BS.Input
                                    type='number'
                                    name='max_gas'
                                    value={maxG}
                                    onChange={(e) => setMaxG(e.target.value)}
                                    placeholder='Max Gas'
                                />
                                <BS.InputGroupAddon addonType='append'>
                                    <BS.Button
                                        color='primary'
                                        type='button'
                                        disabled={maxGas == maxG}
                                        onClick={() =>
                                            setMaxGas(parseFloat(maxG))
                                        }>
                                        <i className='fa fa-check'></i>
                                    </BS.Button>
                                </BS.InputGroupAddon>
                            </BS.InputGroup>
                        </td>
                    </tr>

                    <tr>
                        <th colSpan={2} scope='row'></th>
                    </tr>

                    <tr>
                        <th colSpan={2} scope='row'>
                            Account Information
                        </th>
                    </tr>

                    {accountInfo &&
                        Object.entries(accountInfo).map(([key, value]) => {
                            if (key === "coins") return null
                            return (
                                <tr key={key}>
                                    <th scope='row'>{formatKey(key)}</th>
                                    <td>
                                        <code
                                            style={{ whiteSpace: "pre-wrap" }}>
                                            {key === "public_key" && value
                                                ? value.value
                                                : value.toString()}
                                        </code>
                                    </td>
                                </tr>
                            )
                        })}

                    <tr>
                        <th colSpan={2} scope='row'></th>
                    </tr>

                    <tr>
                        <th colSpan={2} scope='row'>
                            Node Information
                        </th>
                    </tr>

                    {nodeInfo &&
                        Object.entries(nodeInfo).map(([key, value]) => {
                            if (key === "other") return null
                            return (
                                <tr key={key}>
                                    <th scope='row'>{formatKey(key)}</th>
                                    <td>
                                        <code
                                            style={{ whiteSpace: "pre-wrap" }}>
                                            {
                                                // Add a special JSON styling to moduleStatusJson
                                                key === "protocol_version"
                                                    ? JSON.stringify(
                                                          value,
                                                          null,
                                                          4
                                                      )
                                                    : value.toString()
                                            }
                                        </code>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </BS.Table>
        </Fragment>
    )
}

export default Metadata
