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

    const setIsWriter = (isWriter) => {
        setState((state) => ({ ...state, isWriter }))
    }

    const setWriters = (writers) => {
        setState((state) => ({ ...state, writers }))
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

            reloadTTL(selectedKey)
        }
    }

    const refreshKeys = () => {
        return new Promise((resolve) => {
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
            refreshKeys().then((k) => {
                reloadKey(k)

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

    const setMetaStatus = (metaStatus) => {
        setState((state) => ({ ...state, metaStatus }))
    }

    const setMetaSize = (metaSize) => {
        setState((state) => ({ ...state, metaSize }))
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

    const setValue = (key, value) => {
        setState((state) => ({ ...state, [key]: value }))
    }

    return {
        setClient,
        setMnemonic,
        setConfig,
        setSelectedKey,
        setIsWriter,
        setWriters,
        setActiveValue,
        setActiveMap,
        setLoadingValue,
        setActiveTTL,
        setLoadingTTL,
        reloadTTL,
        setKeys,
        setTempKeys,
        setLog,
        setMetaStatus,
        setMetaSize,
        setCommandQueue,
        setCurrentPosition,
        setGasPrice,
        setValue,

        refreshKeys,
        reloadKey,
        reload,

        client: state.client,
        mnemonic: state.mnemonic,
        config: state.config,
        selectedKey: state.selectedKey,
        isWriter: state.isWriter,
        writers: state.writers,
        activeValue: state.activeValue,
        activeMap: state.activeMap,
        loadingValue: state.loadingValue,
        activeTTL: state.activeTTL,
        loadingTTL: state.loadingTTL,
        keys: state.keys,
        tempKeys: state.tempKeys,
        log: state.log,
        metaStatus: state.metaStatus,
        metaSize: state.metaSize,
        commandQueue: state.commandQueue,
        currentPosition: state.currentPosition,
        gasPrice: state.gas_price,
    }
}

export default useData
