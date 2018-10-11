import CenterMiddle from './CenterMiddle'
import {Header} from '../Header/Header'

const uuidv4 = require('uuid/v4');


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
        this.address.focus();
    }


    render() {

        return (
            <CenterMiddle>
                <Header/>
                <div onKeyUp={this.checkEnterKey.bind(this)}>
                    <BS.Card style={{marginTop: 20}} header={<h3>Choose a Bluzelle node</h3>}>
                        <div style={{width: 400, padding: 20}}>
                            <div style={{float: 'right', width: '15%'}}>
                                <label style={{display: 'block'}}>Port:</label>
                                <input type="text" tabIndex="2" ref={r => this.port = r} style={{width: '100%'}} defaultValue="8100" />
                            </div>
                            <div style={{width: '80%'}}>
                                <label style={{display: 'block'}}>Address:</label>
                                <input type="text" tabIndex="1" ref={r => this.address = r} style={{width: '80%'}} placeholder="address" defaultValue="127.0.0.1"/>
                            </div>
                            <div style={{width: '100%'}}>
                                <label style={{display: 'block'}}>UUID:</label>
                                <input type="text" tabIndex="1" ref={r => this.uuid = r} style={{width: '100%'}} placeholder="uuid" defaultValue={uuidv4()}/>
                            </div>
                            <div style={{marginTop: 10}}>
                                    <BS.Button onClick={this.go.bind(this)} tabIndex="3">Go</BS.Button>
                            </div>
                        </div>
                    </BS.Card>
                </div>
            </CenterMiddle>
        );
    }
}


