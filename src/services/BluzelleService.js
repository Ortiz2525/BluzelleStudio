import { bluzelle } from "bluzelle";
import useData from "components/DataContext/useData";

const url_params = window && new URLSearchParams(window.location.search);

const useBluzelle = () => {
    const { setConfig, client, setClient } = useData();

    const createClient = async (config) => {
        setConfig(config);

        const bzClient = await bluzelle({
            ...config,

            log: (...args) => {
                // Print log to console

                if (url_params.has("log")) {
                    console.log(...args);
                }
            },
        });

        setClient(bzClient);

        return bzClient;
    };

    const hasClient = () => {
        return !!client;
    };

    const getClient = () => {
        if (!client) {
            throw new Error("trying to get a client that wasn't created");
        }

        return client;
    };

    return {
        createClient,
        hasClient,
        getClient,
    };
};

export default useBluzelle;
