import React, { useEffect, useState } from "react"

import Editor from "./Editor"
import KeyList from "./KeyList"
import Metadata from "./Metadata"
import Permissioning from "./Permissioning"
import Header from "./Header/Header"

import CollapsibleCard from "./CollapsibleCard"
import useData from "./DataContext/useData"

const Main = () => {
    const { config, accountInfo } = useData()
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        if (accountInfo && accountInfo.coins && accountInfo.coins.length) {
            const ubntBalance = accountInfo.coins.find(
                (coin) => coin.denom === "ubnt"
            )
            if (ubntBalance) setBalance(ubntBalance.amount / 1000000)
        }
    }, [accountInfo])

    return (
        <div
            style={{
                display: "flex",
                height: "100%",
                width: "100%",
                flexDirection: "column",
            }}>
            <div>
                <Header />

                <BS.Table style={{ marginBottom: 0, textAlign: "center" }}>
                    <tbody style={{ display: "inline-table" }}>
                        <tr style={{ display: "inline-table" }}>
                            <th scope='row' style={{ border: 0 }}>
                                Uuid
                            </th>
                            <td style={{ border: 0 }}>
                                <code>{config.uuid}</code>
                            </td>
                        </tr>

                        <tr style={{ display: "inline-table" }}>
                            <th scope='row' style={{ border: 0 }}>
                                Balance
                            </th>
                            <td style={{ border: 0 }}>
                                <code>{balance.toLocaleString()} BLZ</code>
                            </td>
                        </tr>
                    </tbody>
                </BS.Table>
                <hr style={{ marginTop: 0 }} />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    flex: 1,
                }}>
                <div style={{ flex: 0.3 }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: 10,
                        }}>
                        {/* Disabling these for now. Too many variables to have a reliable undo/redo.

                            <CommandControls/>

                            <hr style={{border: 'none'}}/>*/}

                        <CollapsibleCard
                            title='Database Fields'
                            style={{
                                height: "calc(100vh - 160px",
                                overflowY: "auto",
                            }}>
                            <KeyList />
                        </CollapsibleCard>
                    </div>
                </div>

                <div style={{ flex: 0.4, padding: 10 }}>
                    <Editor />
                </div>

                <div
                    style={{
                        flex: 0.3,
                        padding: 10,
                    }}>
                    {/* <div style={{ height: 20 }}></div>

                            <CollapsibleCard title='Permissioning'>
                                <Permissioning />
                            </CollapsibleCard> */}

                    {/* <div style={{ height: 20 }}></div> */}

                    <CollapsibleCard
                        title='Metadata'
                        style={{
                            height: "calc(100vh - 160px",
                            overflowY: "auto",
                        }}>
                        <Metadata />
                    </CollapsibleCard>

                    {/*<div style={{height: 20}}></div>
    
                    <CollapsibleCard collapsed={true} title="Log">
                        <Log/>
                    </CollapsibleCard>*/}

                    {/* <div style={{ height: 20 }}></div> */}
                </div>
            </div>
        </div>
    )
}

export default Main
