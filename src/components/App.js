import 'babel-polyfill';

import {HashRouter, Route} from 'react-router-dom'
import {Main} from 'components/Main'
import {execute} from "../services/CommandQueueService";
import DaemonSelector from './DaemonSelector'
import {ColorSelector} from './ColorSelector';

import {status} from './Metadata';
import {writers} from './Permissioning';


import DevTools from 'mobx-react-devtools';

// Debugging
import {configureDevtool} from 'mobx-react-devtools';

const url_params = window && new URLSearchParams(window.location.search);

configureDevtool({logEnabled: url_params.has('log')});


import {createClient} from '../services/BluzelleService';

export const connected = observable(false);

export const public_pem_value = observable(false);

@observer
export class App extends Component {


    async go(address, contract, uuid, private_pem, public_pem) {

        public_pem_value.set(public_pem);

        let client; 


        // try to open a client normally

        try {
            client = await createClient({
                ethereum_rpc: address, 
                contract_address: contract,
                uuid,
                private_pem,
                public_pem
            });
        } catch(e) {


            // try to create the db

            try {

                const apis = await createClient({
                    ethereum_rpc: address, 
                    contract_address: contract,
                    uuid,
                    private_pem,
                    public_pem,
                    _connect_to_all: true
                });


                if(apis.length === 0) {
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
                    public_pem
                });


            } catch(e2) {

                if(e2.message.includes('ACCESS_DENIED')) {

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
        .then(() => {

            connected.set(true);

        })
        .catch(e => {

            alert('Error initializing database connection: ' + e.message);

            throw e;

        });

    }


    render() {

        return (
            <div style={{height: '100%'}}>

                <ColorSelector/>
                
                {/dev-tools/.test(window.location.href) && <DevTools/>}

                {
                    connected.get() ?
                        <Main/> :
                        <DaemonSelector go={this.go.bind(this)}/>
                }
            </div>
        );
    }
};