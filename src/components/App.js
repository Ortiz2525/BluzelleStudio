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

@observer
export class App extends Component {


    go(ws_url, uuid, pem) {

        const client = createClient({
            entry: ws_url, 
            uuid,
            private_pem: pem,
        });

        
        client.useFastestConnection()
        .then(() => client.hasDB())
        .then(has => {

            if(!has) {
                return client.createDB();
            }

        })
        .then(() => client.status())
        .then(s => {

            status.set(s);

            return client.getWriters();

        })
        .then(w => {

            writers.set(w);

        })
        .then(() => {

            connected.set(true);

        })
        .catch(e => {

            alert('Could not connect to provided websocket.');

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