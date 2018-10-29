import {BluzelleClient} from 'bluzelle';
import {observable} from 'mobx';


const log = observable();

const url_params = window && new URLSearchParams(window.location.search);


let bz;

module.exports = {

    createClient: (a1, a2) => {

        bz = new BluzelleClient(a1, a2, (...args) => {

            if(url_params.has('log')) {
                console.log(...args);
            }

            log.set(args);

        });

        return bz;

    },

    getClient: () => {

        if(!bz) {
            throw new Error('trying to get a client that wasn\'t created');
        }

        return bz;

    },

    log

};