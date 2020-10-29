import "@babel/polyfill"
import React, { useState } from "react"
import axios from "axios"

import Main from "components/Main"
import DaemonSelector from "./DaemonSelector"
import ColorSelector from "./ColorSelector"

import useBluzelle from "../services/BluzelleService"
import useData from "./DataContext/useData"

// const url_params = window && new URLSearchParams(window.location.search);

window.cookiesObj = document.cookie.split("; ").reduce((prev, current) => {
    const [name, value] = current.split("=")
    prev[name] = value
    return prev
}, {})

// refresh config cookies for one month
const expiryDate = new Date()
expiryDate.setMonth(expiryDate.getMonth() + 1)

document.cookie = "expires=" + expiryDate.toGMTString()

const App = () => {
    const { setMnemonic, setNodeInfo, setAccountInfo } = useData()
    const [connected, setConnected] = useState(false)
    const { createClient } = useBluzelle()

    const go = async (endpoint, uuid, chainid, mnemonic) => {
        setMnemonic(mnemonic)

        const params = new URLSearchParams()
        params.set("endpoint", endpoint)
        params.set("uuid", uuid)
        params.set("chainid", chainid)
        window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${params}`
        )

        if (!uuid) {
            const randomUuid = require("uuid")
            uuid = randomUuid.v4()
        }

        let client
        // try to open a client normally
        try {
            client = await createClient({
                mnemonic,
                endpoint: endpoint,
                chain_id: chainid,
                uuid,
            })
        } catch (e) {
            // try to create the db
            try {
                const apis = await createClient({
                    mnemonic,
                    endpoint: endpoint,
                    chain_id: chainid,
                    uuid,
                    _connect_to_all: true,
                })

                if (apis.length === 0) {
                    throw new Error("Cannot connect to any swarm.")
                }

                // random swarm
                await apis[Math.floor(Math.random() * apis.length)]._createDB()
                apis.forEach((api) => api.close())

                client = await createClient({
                    mnemonic,
                    endpoint: endpoint,
                    chain_id: chainid,
                    uuid,
                })
            } catch (e2) {
                if (e2.message.includes("ACCESS_DENIED")) {
                    alert(e.message)
                    console.error(e)
                    throw e
                } else {
                    alert(e2.message)
                    console.error(e2)
                    throw e2
                }
            }
        }

        const getNodeInfo = () => {
            return new Promise((resolve, reject) => {
                axios
                    .get(endpoint + "/node_info")
                    .then((response) => response.data)
                    .then((data) => resolve(data))
                    .catch((e) => reject(e))
            })
        }

        try {
            const accountInfo = await client.account()
            if (accountInfo.address == "" || accountInfo.public_key == "") {
                throw new Error("Invalid Mnemonic!")
            }

            setAccountInfo(accountInfo)

            const nodeInfo = await getNodeInfo()
            const node = {
                ...nodeInfo.node_info,
                ...nodeInfo.node_info.other,
                // ...nodeInfo.node_info.protocol_version,
            }
            setNodeInfo(node)

            setConnected(true)
        } catch (e) {
            setConnected(false)
            throw e
        }
    }

    return (
        <div style={{ height: "100%" }}>
            <ColorSelector />

            {connected && (
                <div
                    style={{
                        position: "absolute",
                        top: 15,
                        right: 60,
                        zIndex: 100,
                    }}>
                    <BS.Button
                        outline
                        color='primary'
                        onClick={() => setConnected(false)}>
                        <i className='fa fa-sign-out-alt'></i>
                    </BS.Button>
                </div>
            )}

            {connected ? <Main /> : <DaemonSelector go={go} />}
        </div>
    )
}

export default App
