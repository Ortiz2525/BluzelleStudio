import { bluzelle } from "bluzelle";
import useData from "components/DataContext/useData";

const url_params = window && new URLSearchParams(window.location.search);
let bz;

export const createClient = async (config) => {
    const { setConfig } = useData();
    setConfig(config);

    bz = await bluzelle({
        ...config,

        log: (...args) => {
            // Print log to console

            if (url_params.has("log")) {
                console.log(...args);
            }
        },
    });

    return bz;
};

export const hasClient = () => {
    return !!bz;
};

export const getClient = () => {
    if (!bz) {
        throw new Error("trying to get a client that wasn't created");
    }

    return bz;
};
