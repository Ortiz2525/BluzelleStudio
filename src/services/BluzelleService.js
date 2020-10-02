import {
    bluzelle
} from 'bluzelle';
import {
    observable
} from 'mobx';


export const log = observable();

const url_params = window && new URLSearchParams(window.location.search);

const configObservable = observable();

let bz;

export const config = configObservable;
export const createClient = async config => {

    configObservable.set(config);

    bz = await bluzelle({
        ...config,

        log: (...args) => {

            // Print log to console

            if (url_params.has('log')) {
                console.log(...args);
            }

        }
    });

    return bz;

};

export const hasClient = () => {
    return !!bz;
};

export const getClient = () => {

    if (!bz) {
        throw new Error('trying to get a client that wasn\'t created');
    }

    return bz;

};