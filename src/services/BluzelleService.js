<<<<<<< HEAD
import {BluzelleClient} from 'bluzelle';
=======
import {bluzelle} from 'bluzelle';
>>>>>>> c6a2d9c7e7846b4f142c97e1c2b31e48cef9b826
import {observable} from 'mobx';


const log = observable();

const url_params = window && new URLSearchParams(window.location.search);


let bz;

module.exports = {


    createClient: config => {

        bz = bluzelle({
            ...config,

            log: (...args) => {

                // Print log to console

                if(url_params.has('log')) {
                    console.log(...args);
                }

                
                // Used by the logging component

                log.set(args);

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