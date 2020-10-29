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
    } = useData()
    const { getClient } = useBluzelle()

    const gas_info = {
        gas_price: gasPrice,
        max_gas: maxGas,
    }

    const save = () => {
        setIsBusy(true)

        const newTempKeys = [...tempKeys]
        newTempKeys.push(selectedKey)
        setTempKeys(newTempKeys)

        getClient()
            .update(selectedKey, activeValue, gas_info)
            .then(() => {
                newTempKeys.splice(newTempKeys.indexOf(selectedKey), 1)
                setTempKeys(newTempKeys)

                reload().then(() => {
                    setIsBusy(false)
                })
            })
            .catch(() => {
                alert("Failed to save due to bluzelle network error.")

                setIsBusy(false)
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
                .then(() => {
                    reload().then(() => {
                        setIsBusy(false)

                        resolve()
                    })
                })
                .catch(() => {
                    newTempKeys.splice(newTempKeys.indexOf(sk), 1)
                    setTempKeys(newTempKeys)
                    setSelectedKey(sk)
                    alert("Failed to remove due to bluzelle network error.")

                    setIsBusy(false)
                })
        })
    }

    const create = (key, value) => {
        return new Promise((resolve) => {
            setIsBusy(true)

            const newKeys = [...keys],
                newTempKeys = [...tempKeys]
            newKeys.push(key)
            newTempKeys.push(key)

            setKeys(newKeys)
            setTempKeys(newTempKeys)

            getClient()
                .create(key, value, gas_info)
                .then(() => {
                    while (newTempKeys.includes(key)) {
                        newTempKeys.splice(newTempKeys.indexOf(key), 1)
                    }
                    setTempKeys(newTempKeys)

                    reload().then(() => {
                        setIsBusy(false)

                        resolve()
                    })
                })
                .catch((e) => {
                    while (newTempKeys.includes(key)) {
                        newTempKeys.splice(newTempKeys.indexOf(key), 1)
                    }
                    setTempKeys(newTempKeys)

                    newKeys.splice(newKeys.indexOf(key), 1)
                    setKeys(newKeys)

                    alert("Failed to create key due to bluzelle network error.")

                    setIsBusy(false)
                    resolve()
                })
        })
    }

    const rename = async (oldKey, newKey) => {
        setIsBusy(true)

        const newTempKeys = [...tempKeys]
        newTempKeys.push(oldKey)
        setTempKeys(newTempKeys)

        try {
            const v = await getClient().read(oldKey)

            await getClient().delete(oldKey, gas_info)

            if (await getClient().has(newKey)) {
                await getClient().update(newKey, v, gas_info)
            } else {
                await getClient().create(newKey, v, gas_info)
            }

            if (selectedKey === oldKey) {
                setSelectedKey(newKey)
            }
        } catch (e) {
            console.error(e)
            alert("Bluzelle network error.")
        }

        newTempKeys.splice(newTempKeys.indexOf(oldKey), 1)
        setTempKeys(newTempKeys)

        await reload()

        setIsBusy(false)
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
                .then(() => {
                    reload().then(() => {
                        resolve()

                        setIsBusy(false)
                    })
                })
                .catch(() => {
                    newTempKeys.splice(newTempKeys.indexOf(sk), 1)
                    setTempKeys(newTempKeys)
                    setSelectedKey(sk)
                    alert("Failed to remove due to bluzelle network error.")

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
