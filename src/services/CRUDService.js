import useData from "components/DataContext/useData";

import useBluzelle from "./BluzelleService";

const useCRUDService = () => {
    const {
        selectedKey,
        setSelectedKey,
        activeValue,
        keys,
        setKeys,
        tempKeys,
        setTempKeys,
    } = useData();
    const { getClient } = useBluzelle();

    const save = () => {
        getClient()
            .update(selectedKey, activeValue)
            .catch(() =>
                alert("Failed to save due to bluzelle network error.")
            );
    };

    const remove = () => {
        return new Promise((resolve) => {
            const sk = selectedKey;
            setSelectedKey(undefined);

            const newTempKeys = [...tempKeys];
            newTempKeys.push(sk);
            setTempKeys(newTempKeys);

            return getClient()
                .delete(sk)
                .then(() => {
                    reload().then(resolve);
                })
                .catch(() => {
                    newTempKeys.splice(newTempKeys.indexOf(sk), 1);
                    setTempKeys(newTempKeys);
                    setSelectedKey(sk);
                    alert("Failed to remove due to bluzelle network error.");
                });
        });
    };

    const create = (key, value) => {
        const newKeys = [...keys],
            newTempKeys = [...tempKeys];
        newKeys.push(key);
        newTempKeys.push(key);

        setKeys(newKeys);
        setTempKeys(newTempKeys);

        getClient()
            .create(key, value)
            .then(() => {
                while (newTempKeys.includes(key)) {
                    newTempKeys.splice(newTempKeys.indexOf(key), 1);
                }
                setTempKeys(newTempKeys);
            })
            .catch((e) => {
                while (newTempKeys.includes(key)) {
                    newTempKeys.splice(newTempKeys.indexOf(key), 1);
                }
                setTempKeys(newTempKeys);

                newKeys.splice(newKeys.indexOf(key), 1);
                setKeys(newKeys);

                alert("Failed to create key due to bluzelle network error.");
            });
    };

    const rename = async (oldKey, newKey) => {
        const newTempKeys = [...tempKeys];
        newTempKeys.push(oldKey);
        setTempKeys(newTempKeys);

        try {
            const v = await getClient().read(oldKey);

            await getClient().delete(oldKey);

            if (await getClient().has(newKey)) {
                await getClient().update(newKey, v);
            } else {
                await getClient().create(newKey, v);
            }

            if (selectedKey === oldKey) {
                setSelectedKey(newKey);
            }
        } catch (e) {
            console.error(e);
            alert("Bluzelle network error.");
        }

        newTempKeys.splice(newTempKeys.indexOf(oldKey), 1);
        setTempKeys(newTempKeys);

        await reload();
    };

    const reload = () =>
        new Promise((resolve) => {
            refreshKeys().then(() => {
                reloadKey();

                resolve();
            });
        });

    const reloadKey = () => {
        const sk = selectedKey;
        setSelectedKey(undefined);

        if (keys.includes(sk)) {
            setSelectedKey(sk);
        }
    };

    const refreshKeys = () => {
        return new Promise((resolve) => {
            getClient()
                .keys()
                .then((k) => {
                    setKeys(k);

                    resolve();
                })
                .catch(() => {
                    alert(
                        "Failed to fetch keys due to bluzelle network error."
                    );

                    resolve();
                });
        });
    };

    return {
        save,
        remove,
        create,
        rename,
        reload,
        reloadKey,
        refreshKeys,
    };
};

export default useCRUDService;
