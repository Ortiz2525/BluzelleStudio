import "@babel/polyfill"
import React, { useState } from "react"

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
    const { setMnemonic, setWriters, setMetaStatus, setMetaSize } = useData()
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

        uuid = uuid || Date.now().toString()

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

        Promise.resolve().then(() => setConnected(true))
        // Promise.resolve()
        //     .then(() => client.status())
        //     .then((s) => {
        //         setMetaStatus(s);
        //         return client._getWriters();
        //     })
        //     .then((w) => {
        //         setWriters(w);
        //     })
        //     .then(() => client.size())
        //     .then((s) => {
        //         setMetaSize(s);
        //         setConnected(true);
        //     })
        //     .catch((e) => {
        //         alert("Error initializing database connection: " + e.message);
        //         throw e;
        //     });
    }

    return (
        <div style={{ height: "100%" }}>
            <ColorSelector />

            {connected ? <Main /> : <DaemonSelector go={go} />}
        </div>
    )
}

export default App
