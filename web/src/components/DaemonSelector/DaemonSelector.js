import CenterMiddle from './CenterMiddle'
import {Header} from '../Header/Header'

const uuidv4 = require('uuid/v4');



const url_params = window && new URLSearchParams(window.location.search);

@observer
export default class DaemonSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {showConfigLoader: false};
    }

    go() {

        this.address.value = this.address.value || this.address.placeholder;
        this.port.value = this.port.value || this.port.placeholder;
        this.uuid.value = this.uuid.value || this.uuid.placeholder;


        url_params.set('address', this.address.value);
        url_params.set('port', this.port.value);
        url_params.set('uuid', this.uuid.value);

        const new_url_params = location.pathname + '?' + url_params.toString();

        window.history.pushState('', '', new_url_params);


        const ws_url = this.address.value + ':' + this.port.value;
        const uuid = this.uuid.value;

        this.props.go(ws_url, uuid);
    }

    checkEnterKey(ev) {
        ev.keyCode === 13 && this.go();
    }

    componentDidMount() {
        this.address.focus();


        if(url_params) {

            url_params.get('address') && (this.address.value = url_params.get('address'));
            url_params.get('port') && (this.port.value = url_params.get('port'));
            url_params.get('uuid') && (this.uuid.value = url_params.get('uuid'));


            if(url_params.get('address') && url_params.get('port') && url_params.get('uuid')) {

                this.go();
                return;

            }

        }

    }

    copy() {
        this.uuid.value = this.uuid.placeholder;
        this.uuid.select();
        document.execCommand("copy");
    }

    render() {

        return (
            <CenterMiddle>
                <Header/>
                <div onKeyUp={this.checkEnterKey.bind(this)}>
                    <BS.Card style={{marginTop: 20}} header={<h3>Choose a Bluzelle node</h3>}>
                        <div style={{width: 400, padding: 20}}>

                            { this.state.showConfigLoader &&
                                <BS.Alert color="primary">Loading config parameters from Heroku...</BS.Alert>
                            }

                            <BS.Form>

                                <BS.FormGroup row>
                                    <BS.Label sm={3} for="address">Address:</BS.Label>
                                    <BS.Col sm={9}>
                                        <BS.Input type="text" name="address" placeholder="ws://13.78.131.94" innerRef={e => {this.address = e;}}/>
                                    </BS.Col>
                                </BS.FormGroup>

                                <BS.FormGroup row>
                                    <BS.Label sm={3} for="port">Port:</BS.Label>
                                    <BS.Col sm={9}>
                                        <BS.Input type="text" name="port" placeholder="51010" innerRef={e => {this.port = e;}}/>
                                    </BS.Col>
                                </BS.FormGroup>

                                <BS.FormGroup row>
                                    <BS.Label sm={3} for="uuid">UUID:</BS.Label>
                                    <BS.Col sm={9}>
                                     <BS.InputGroup>
                                        <BS.Input type="text" name="uuid" placeholder={uuidv4()} innerRef={e => {this.uuid = e;}} />
                                        <BS.InputGroupAddon addonType="append"><BS.Button outline color="secondary" type="button" onClick={() => this.copy()}><i className="fas fa-copy"></i></BS.Button></BS.InputGroupAddon>
                                      </BS.InputGroup>
                                    </BS.Col>
                                </BS.FormGroup>

                                <hr/>

                                <div style={{marginTop: 10}}>
                                    <BS.Button 
                                        color="primary"
                                        style={{width: '100%'}}
                                        onClick={this.go.bind(this)}>Go</BS.Button>
                                </div>


                            </BS.Form>

                        </div>
                    </BS.Card>
                </div>
            </CenterMiddle>
        );
    }
}


