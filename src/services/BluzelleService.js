import {bluzelle} from 'bluzelle';
import {observable} from 'mobx';


const log = observable();

const url_params = window && new URLSearchParams(window.location.search);

const configObservable = observable();


let bz;

module.exports = {

    config: configObservable,

    createClient: config => {

        configObservable.set(config);

        bz = bluzelle({
            ...config,

            log: (...args) => {

                // Print log to console

                if(url_params.has('log')) {
                    console.log(...args);
                }

                
                // Used by the logging component
                // Broken in latest update
                
                // log.set(args);

            }
        });

        return bz;

    },


    hasClient: () => {
        return !!bz;
    },

    getClient: () => {

        if(!bz) {
            throw new Error('trying to get a client that wasn\'t created');
        }

        return bz;

    },

    log

};