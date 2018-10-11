import CenterMiddle from './CenterMiddle'
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import {Header} from '../Header/Header'
//new module addition
import fetch from 'isomorphic-fetch'

@observer
export default class DaemonSelector extends Component {

    go() {

        const ws_url = 'ws://' + this.address.value + ':' + this.port.value;
        const uuid = this.uuid.value;

        this.props.go(ws_url, uuid);
    }

    checkEnterKey(ev) {
        ev.keyCode === 13 && this.go();
    }

    componentDidMount() {

        const appName = decodeURIComponent(window.location.search
            .replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("app")
            .replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
        
        const requestObject = {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.heroku+json; version=3',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 440fc53d-e177-4e3c-962a-570be65ab3f2'
            }
        }

        fetch('https://api.heroku.com/apps/' + appName + '/config-vars', requestObject)
        .then(function(response){
            return response.json();
        })
        .then(function(responseJson){
            console.log(responseJson);
            this.port.value = responseJson.BLUZELLE_PORT || '8100';
            this.address.value = responseJson.BLUZELLE_ADDRESS || '127.0.0.1';
            this.uuid.value = responseJson.BLUZELLE_UUID || uuidv4();
            return responseJson;
        });

        this.address.focus();
    }


    render() {
        return (
            <CenterMiddle>
                <Header/>
                <div onKeyUp={this.checkEnterKey.bind(this)}>
                    <Panel style={{marginTop: 20}} header={<h3>Choose a Bluzelle node</h3>}>
                        <div style={{width: 400, padding: 20}}>
                            <div style={{float: 'right', width: '15%'}}>
                                <label style={{display: 'block'}}>Port:</label>
                                <input type="text" tabIndex="2" ref={r => this.port = r} style={{width: '100%'}} defaultValue={r => this.port = r} />
                            </div>
                            <div style={{width: '80%'}}>
                                <label style={{display: 'block'}}>Address:</label>
                                <input type="text" tabIndex="1" ref={r => this.address = r} style={{width: '80%'}} placeholder="address" defaultValue={r => this.address = r}/>
                            </div>
                            <div style={{width: '100%'}}>
                                <label style={{display: 'block'}}>UUID:</label>
                                <input type="text" tabIndex="1" ref={r => this.uuid = r} style={{width: '100%'}} placeholder="uuid" defaultValue={r => this.uuid = r}/>
                            </div>
                            <div style={{marginTop: 10}}>
                                    <Button onClick={this.go.bind(this)} tabIndex="3">Go</Button>
                            </div>
                        </div>
                    </Panel>
                </div>
            </CenterMiddle>
        );
    }
}


