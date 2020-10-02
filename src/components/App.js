import '@babel/polyfill';

import { Main } from 'components/Main'
import DaemonSelector from './DaemonSelector'
import { ColorSelector } from './ColorSelector';

import { status, size } from './Metadata';
import { writers } from './Permissioning';


import DevTools from 'mobx-react-devtools';

// Debugging
import { configureDevtool } from 'mobx-react-devtools';

const url_params = window && new URLSearchParams(window.location.search);

configureDevtool({ logEnabled: url_params.has('log') });


import { createClient } from '../services/BluzelleService';
import { pub_from_priv } from './DaemonSelector/key_operations';


window.cookiesObj = document.cookie.split('; ').reduce((prev, current) => {

    const [name, value] = current.split('=');
    prev[name] = value;
    return prev;

}, {});


// refresh config cookies for one month

const expiryDate = new Date();
expiryDate.setMonth(expiryDate.getMonth() + 1);

document.cookie = 'expires=' + expiryDate.toGMTString();



export const connected = observable(false);

export const public_pem_value = observable(false);

@observer
export class App extends Component {


    async go(address, contract, uuid, private_pem) {


        const params = new URLSearchParams();
        params.set('address', address);
        params.set('contract', contract);
        params.set('uuid', uuid);
        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);


        const public_pem = pub_from_priv(private_pem);

        uuid = uuid || public_pem;

        public_pem_value.set(public_pem);

        let client;


        // try to open a client normally

        try {
            client = await createClient({
                ethereum_rpc: address,
                contract_address: contract,
                uuid,
                private_pem,
            });
        } catch (e) {


            // try to create the db

            try {

                const apis = await createClient({
                    ethereum_rpc: address,
                    contract_address: contract,
                    uuid,
                    private_pem,
                    _connect_to_all: true
                });


                if (apis.length === 0) {
                    throw new Error('Cannot connect to any swarm.');
                }


                // random swarm
                await apis[Math.floor(Math.random() * apis.length)]._createDB();

                apis.forEach(api => api.close());


                client = await createClient({
                    ethereum_rpc: address,
                    contract_address: contract,
                    uuid,
                    private_pem,
                });


            } catch (e2) {

                if (e2.message.includes('ACCESS_DENIED')) {

                    alert(e.message);

                    console.error(e);

                    throw e;

                } else {

                    alert(e2.message);


                    console.error(e2);

                    throw e2;

                }

            }

        }


        Promise.resolve()
            .then(() => client.status())
            .then(s => {

                status.set(s);

                return client._getWriters();

            })
            .then(w => {

                writers.set(w);

            })
            .then(() => client.size())
            .then(s => {

                size.set(s);
                connected.set(true);

            })
            .catch(e => {

                alert('Error initializing database connection: ' + e.message);

                throw e;

            });

    }


    render() {

        return (
            <div style={{ height: '100%' }}>

                <ColorSelector />

                {/dev-tools/.test(window.location.href) && <DevTools />}

                {
                    connected.get() ?
                        <Main /> :
                        <DaemonSelector go={this.go.bind(this)} />
                }
            </div>
        );
    }
};