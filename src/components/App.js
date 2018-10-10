import {HashRouter, Route} from 'react-router-dom'
import {Main} from 'components/Main'
import {execute} from "../services/CommandQueueService";
import DaemonSelector from './DaemonSelector'

import DevTools from 'mobx-react-devtools';

// Debugging
// import {configureDevtool} from 'mobx-react-devtools';
// configureDevtool({logEnabled: true});


import {connect, keys} from 'bluzelle';


@observer
export class App extends Component {

    componentWillMount() {

        this.setState({
            connected: false
        });

    }


    go(ws_url, uuid) {
        
        connect(ws_url, uuid);

        keys().then(() => {

            this.setState({
                connected: true
            });

        }, () => {

            alert('Could not connect to provided websocket.');

        });

    }


    getToken(){
        var appName = this.props.location.query.app;
        return fetch('https://api.heroku.com/apps/' + appName + '/config-vars', {
            method: 'GET',
            accept: 'application/vnd.heroku+json; version=3',
            authorization: 'Bearer 440fc53d-e177-4e3c-962a-570be65ab3f2'
        }).then(
            response => response.json(),
            error => console.log("this is an error: " + error)
        ).then(
            res => console.log(res)
        )
        
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