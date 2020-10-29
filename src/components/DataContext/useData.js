import { useContext, useEffect } from "react"
import { DataContext } from "./DataContext"

// For updating activeTTL
let time, countdown, value
let update_time = true

const useData = () => {
    const [state, setState] = useContext(DataContext)

    const setClient = (client) => {
        setState((state) => ({ ...state, client }))
    }

    const setMnemonic = (mnemonic) => {
        setState((state) => ({ ...state, mnemonic }))
    }

    const setConfig = (config) => {
        setState((state) => ({ ...state, config }))
    }

    const setIsOwner = (isOwner) => {
        setState((state) => ({ ...state, isOwner }))
    }

    const setActiveValue = (activeValue) => {
        setState((state) => ({ ...state, activeValue }))
    }

    const setActiveMap = (activeMap) => {
        setState((state) => ({ ...state, activeMap }))
    }

    const setLoadingValue = (loadingValue) => {
        setState((state) => ({ ...state, loadingValue }))
    }

    const setActiveTTL = (activeTTL) => {
        setState((state) => ({ ...state, activeTTL }))

        if (update_time) {
            time = new Date().getTime()
            value = activeTTL
        }

        update_time = true

        clearTimeout(countdown)

        const countdown_f = () => {
            const v = value - Math.round((new Date().getTime() - time) / 1000)

            if (v - 1 <= 0) {
                setTimeout(() => reload(), 1500)
            }

            update_time = false

            setActiveTTL(v)
        }

        if (activeTTL > 0) {
            countdown = setTimeout(countdown_f, 1000)
        }
    }

    const setLoadingTTL = (loadingTTL) => {
        setState((state) => ({ ...state, loadingTTL }))
    }

    const reloadTTL = (selectedKey = null) => {
        setLoadingTTL(true)

        state.client
            .getLease(selectedKey ? selectedKey : state.selectedKey)
            .then((value) => {
                setActiveTTL(value)
                setLoadingTTL(false)
            })
            .catch((e) => {
                if (e.message === "TTL_RECORD_NOT_FOUND") {
                    setActiveTTL(0)
                    setLoadingTTL(false)
                } else {
                    alert(
                        "Failed to read time-to-live due to bluzelle network error."
                    )
                    setLoadingTTL(false)
                    console.error(e)
                }
            })
    }

    const setSelectedKey = (selectedKey = undefined) => {
        setState((state) => ({ ...state, selectedKey }))

        setActiveValue(undefined)

        if (selectedKey !== undefined) {
            // We can say that if the value is an object,
            // wrap in an OMR. See: JSONEditor.js.

            setLoadingValue(true)

            state.client
                .read(selectedKey)
                .then((value) => {
                    setActiveValue(value)
                    setLoadingValue(false)
                })
                .catch((e) => {
                    if (e.message.includes("DELETE_PENDING")) {
                        reload()
                    } else {
                        alert(
                            "Failed to read value due to bluzelle network error."
                        )
                    }

                    setLoadingValue(false)
                    console.error(e)
                })

            setIsOwner(false)

            state.client
                .owner(selectedKey)
                .then((owner) => {
                    if (owner == state.accountInfo.address) {
                        setIsOwner(true)
                    }
                })
                .catch((e) => {
                    console.error(e)
                })

            reloadTTL(selectedKey)
        }
    }

    const refreshKeys = (prefix = null) => {
        return new Promise((resolve) => {
            if (
                (prefix && prefix !== "") ||
                (prefix === null && state.keyPrefix && state.keyPrefix !== "")
            ) {
                state.client
                    .search(prefix && prefix !== "" ? prefix : state.keyPrefix)
                    .then((k) => {
                        setKeys(k.map((item) => item.key))

                        resolve(k)
                    })
                    .catch((ex) => {
                        // alert("Failed to fetch keys due to bluzelle network error.")

                        resolve()
                    })
            } else {
                state.client
                    .keys()
                    .then((k) => {
                        setKeys(k)

                        resolve(k)
                    })
                    .catch((ex) => {
                        // alert("Failed to fetch keys due to bluzelle network error.")

                        resolve()
                    })
            }
        })
    }

    const reloadKey = (keys = null) => {
        const sk = state.selectedKey
        setSelectedKey(undefined)

        if (keys == null) keys = state.keys

        if (keys.includes(sk)) {
            setSelectedKey(sk)
        }
    }

    const reload = () =>
        new Promise((resolve) => {
            setIsBusy(true)

            refreshKeys().then(async (k) => {
                reloadKey(k)

                const accountInfo = await state.client.account()
                if (accountInfo.address != "" && accountInfo.public_key != "") {
                    setAccountInfo(accountInfo)
                }

                setIsBusy(false)
                resolve()
            })
        })

    const setKeys = (keys) => {
        setState((state) => ({ ...state, keys: [...keys] }))
    }

    const setTempKeys = (tempKeys) => {
        setState((state) => ({ ...state, tempKeys: [...tempKeys] }))
    }

    const setLog = (log) => {
        setState((state) => ({ ...state, log }))
    }

    const setNodeInfo = (nodeInfo) => {
        setState((state) => ({ ...state, nodeInfo }))
    }

    const setAccountInfo = (accountInfo) => {
        setState((state) => ({ ...state, accountInfo }))
    }

    const setTxInfo = (txInfo) => {
        setState((state) => ({ ...state, txInfo }))
    }

    const setCommandQueue = (commandQueue) => {
        setState((state) => ({ ...state, commandQueue }))
    }

    const setCurrentPosition = (currentPosition) => {
        setState((state) => ({ ...state, currentPosition }))
    }

    const setGasPrice = (gas_price) => {
        setState((state) => ({ ...state, gas_price }))
    }

    const setMaxGas = (max_gas) => {
        setState((state) => ({ ...state, max_gas }))
    }

    const setKeyPrefix = (keyPrefix) => {
        setState((state) => ({ ...state, keyPrefix }))

        refreshKeys(keyPrefix)
    }

    const setIsBusy = (isBusy) => {
        setState((state) => ({ ...state, isBusy }))
    }

    const setValue = (key, value) => {
        setState((state) => ({ ...state, [key]: value }))
    }

    return {
        setClient,
        setMnemonic,
        setConfig,
        setSelectedKey,
        setIsOwner,
        setActiveValue,
        setActiveMap,
        setLoadingValue,
        setActiveTTL,
        setLoadingTTL,
        reloadTTL,
        setKeys,
        setTempKeys,
        setLog,
        setNodeInfo,
        setAccountInfo,
        setTxInfo,
        setCommandQueue,
        setCurrentPosition,
        setGasPrice,
        setMaxGas,
        setKeyPrefix,
        setIsBusy,
        setValue,

        refreshKeys,
        reloadKey,
        reload,

        client: state.client,
        mnemonic: state.mnemonic,
        config: state.config,
        selectedKey: state.selectedKey,
        isOwner: state.isOwner,
        activeValue: state.activeValue,
        activeMap: state.activeMap,
        loadingValue: state.loadingValue,
        activeTTL: state.activeTTL,
        loadingTTL: state.loadingTTL,
        keys: state.keys,
        tempKeys: state.tempKeys,
        log: state.log,
        nodeInfo: state.nodeInfo,
        accountInfo: state.accountInfo,
        txInfo: state.txInfo,
        commandQueue: state.commandQueue,
        currentPosition: state.currentPosition,
        gasPrice: state.gas_price,
        maxGas: state.max_gas,
        keyPrefix: state.keyPrefix,
        isBusy: state.isBusy,
    }
}

export default useData
