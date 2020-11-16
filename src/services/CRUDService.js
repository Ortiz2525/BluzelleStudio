import useData from "components/DataContext/useData"

import useBluzelle from "./BluzelleService"

const useCRUDService = () => {
    const {
        selectedKey,
        setSelectedKey,
        activeValue,
        keys,
        setKeys,
        tempKeys,
        setTempKeys,
        reload,
        gasPrice,
        maxGas,
        setIsBusy,
        setTxInfo,
    } = useData()
    const { getClient } = useBluzelle()

    const gas_info = {
        gas_price: gasPrice,
        max_gas: maxGas,
    }

    const save = () => {
        return new Promise((resolve) => {
            setIsBusy(true)

            const newTempKeys = [...tempKeys]
            newTempKeys.push(selectedKey)
            setTempKeys(newTempKeys)

            getClient()
                .update(selectedKey, activeValue, gas_info)
                .then((result) => {
                    setTxInfo(result)

                    setTempKeys(newTempKeys.filter((key) => key != selectedKey))

                    reload().then(() => {
                        setIsBusy(false)
                        resolve()
                    })
                })
                .catch((ex) => {
                    alert(
                        ex.error
                            ? ex.error
                            : "Failed due to bluzelle network error."
                    )

                    setIsBusy(false)
                    resolve()
                })
        })
    }

    const remove = () => {
        return new Promise((resolve) => {
            setIsBusy(true)

            const sk = selectedKey
            setSelectedKey(undefined)

            const newTempKeys = [...tempKeys]
            newTempKeys.push(sk)
            setTempKeys(newTempKeys)

            return getClient()
                .delete(sk, gas_info)
                .then((result) => {
                    setTxInfo(result)

                    reload().then(() => {
                        setIsBusy(false)

                        resolve()
                    })
                })
                .catch((ex) => {
                    alert(
                        ex.error
                            ? ex.error
                            : "Failed due to bluzelle network error."
                    )

                    setTempKeys(newTempKeys.filter((key) => key != sk))
                    setSelectedKey(sk)

                    setIsBusy(false)
                })
        })
    }

    const create = (key, value) => {
        return new Promise((resolve) => {
            setIsBusy(true)

            const newKeys = [...keys],
                newTempKeys = [...tempKeys]
            newKeys.push({
                key,
                lease: 864000, // * 10 days in seconds
                updatedAt: new Date(),
            })
            newTempKeys.push(key)

            setKeys(newKeys)
            setTempKeys(newTempKeys)

            getClient()
                .create(key, value, gas_info)
                .then((result) => {
                    setTxInfo(result)

                    setTempKeys(newTempKeys.filter((item) => item != key))

                    reload().then(() => {
                        setIsBusy(false)

                        resolve()
                    })
                })
                .catch((ex) => {
                    alert(
                        ex.error
                            ? ex.error
                            : "Failed due to bluzelle network error."
                    )

                    setTempKeys(newTempKeys.filter((item) => item != key))
                    setKeys(newKeys.filter((item) => item.key != key))

                    setIsBusy(false)
                    resolve()
                })
        })
    }

    const rename = async (oldKey, newKey) => {
        return new Promise((resolve) => {
            setIsBusy(true)

            setSelectedKey(undefined)

            const newTempKeys = [...tempKeys]
            newTempKeys.push(oldKey)
            setTempKeys(newTempKeys)

            return getClient()
                .rename(oldKey, newKey, gas_info)
                .then((result) => {
                    setTxInfo(result)

                    reload().then(() => {
                        setIsBusy(false)

                        resolve()
                    })
                })
                .catch((ex) => {
                    alert(
                        ex.error
                            ? ex.error
                            : "Failed due to bluzelle network error."
                    )

                    setTempKeys(newTempKeys.filter((item) => item != sk))
                    setSelectedKey(sk)

                    setIsBusy(false)
                })
        })
    }

    const removeAll = () => {
        return new Promise((resolve) => {
            setIsBusy(true)

            const sk = selectedKey
            setSelectedKey(undefined)

            const newTempKeys = [...tempKeys]
            newTempKeys.push(sk)
            setTempKeys(newTempKeys)

            return getClient()
                .deleteAll(gas_info)
                .then((result) => {
                    setTxInfo(result)

                    reload().then(() => {
                        resolve()

                        setIsBusy(false)
                    })
                })
                .catch((ex) => {
                    alert(
                        ex.error
                            ? ex.error
                            : "Failed due to bluzelle network error."
                    )

                    setTempKeys(newTempKeys.filter((item) => item != sk))
                    setSelectedKey(sk)

                    setIsBusy(false)
                })
        })
    }

    return {
        save,
        remove,
        removeAll,
        create,
        rename,
    }
}

export default useCRUDService
