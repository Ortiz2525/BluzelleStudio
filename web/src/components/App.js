import 'babel-polyfill';

import {HashRouter, Route} from 'react-router-dom'
import {Main} from 'components/Main'
import {execute} from "../services/CommandQueueService";
import DaemonSelector from './DaemonSelector'

import DevTools from 'mobx-react-devtools';

// Debugging
import {configureDevtool} from 'mobx-react-devtools';

const url_params = window && new URLSearchParams(window.location.search);

configureDevtool({logEnabled: url_params.has('log')});


import {createClient} from '../services/BluzelleService'


@observer
export class App extends Component {

    componentWillMount() {

        this.setState({
            connected: false
        });

    }


    go(ws_url, uuid) {

        const client = createClient(ws_url, uuid);

        
        client.connect()
        .then(() => client.keys())
        .then(keys => {

            this.setState({
                connected: true
            });

        }).catch(e => {

            alert('Could not connect to provided websocket.');

            throw e;

        });

    }


    render() {

        return (
            <div style={{height: '100%'}}>
                {/dev-tools/.test(window.location.href) && <DevTools/>}

                {
                    this.state.connected ?
                        <Main/> :
                        <DaemonSelector go={this.go.bind(this)}/>
                }
            </div>
        );
    }
};