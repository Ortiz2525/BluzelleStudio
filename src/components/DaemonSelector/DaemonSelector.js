import CenterMiddle from './CenterMiddle'
import { Header } from '../Header/Header'
import { loadingBar } from '../loadingBar';
import { EthereumConfig, EthereumRPC, ContractAddress, uuid } from './EthereumConfig';

import fetch from 'isomorphic-fetch';


const connecting = observable(false);


const url_params = window && new URLSearchParams(window.location.search);

@observer
export default class DaemonSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfigLoader: false,
            modal: false,
            save: window.cookiesObj.save === 'true' || false,
            mnemonic: window.cookiesObj.mnemonic || '',
            fileName: window.cookiesObj.fileName || ''
        };
    }


    componentDidUpdate() {

        document.cookie = 'save=' + this.state.save;

        if (!this.state.save) {

            document.cookie = 'mnemonic=';
            document.cookie = 'fileName=';

        } else {

            document.cookie = 'mnemonic=' + this.state.mnemonic;
            document.cookie = 'fileName=' + this.state.fileName;

        }

    }

    go() {


        if (!this.state.mnemonic) {
            alert('Please upload Bluzelle key.');
            return;
        }


        const new_url_params = location.pathname + '?' + url_params.toString();

        window.history.pushState('', '', new_url_params);


        const address = EthereumRPC.get();
        const contract = ContractAddress.get();
        const uuid_ = uuid.get();


        connecting.set(true);

        this.props.go(address, contract, uuid_, this.state.mnemonic).catch(e => {
            console.error(e);
            connecting.set(false);
        });
    }

    checkEnterKey(ev) {
        ev.keyCode === 13 && this.go();
    }


    selectFile(callback, filename_callback) {

        const input = document.createElement('input');

        input.type = 'file';


        input.onchange = () => {

            if (input.files.length === 0) {
                return;
            }

            if (input.files.length > 1) {
                alert('Please select only one file.')
                return;
            }


            filename_callback(input.files[0].name);

            const URL = window.URL || window.webkitURL;

            const file = input.files[0],
                fileURL = URL.createObjectURL(file);

            fetch(fileURL)
                .then(res => res.arrayBuffer())
                .then(res => {

                    const text = Buffer.from(res).toString();


                    const base_64 = text.split(/\n|\r/).filter(s => !s.startsWith('-')).join('');

                    if (base_64.match(/^[A-Za-z0-9+/=]*$/)) {

                        this.forceUpdate();
                        callback(base_64);

                    } else {

                        alert('Error in parsing file.');

                    }

                })
                .catch(e => { alert('Error in file upload.'); throw e; });

        };


        input.click();
    }


    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {

        return (
            <CenterMiddle>
                <Header />
                <div onKeyUp={this.checkEnterKey.bind(this)}>
                    <BS.Card style={{ marginTop: 20 }}>

                        <div style={{ width: 700, padding: 20 }}>

                            {this.state.showConfigLoader &&
                                <BS.Alert color="primary">Loading config parameters from Heroku...</BS.Alert>
                            }

                            <BS.Form>

                                <BS.FormGroup row>

                                    <BS.Label sm={3} for="priv_file">Mnemonic:</BS.Label>
                                    <BS.Col sm={9}>

                                        <BS.InputGroup>
                                            <BS.InputGroupAddon addonType="prepend">
                                                <BS.Button outline color="primary" type="button" onClick={() => this.selectFile(base64 => this.setState({ mnemonic: base64 }), fname => this.setState({ fileName: fname }))}>
                                                    <i className="far fa-hdd"></i>
                                                </BS.Button>
                                            </BS.InputGroupAddon>

                                            <BS.Input disabled type="text" name="priv_file" value={this.state.fileName} />
                                            <BS.InputGroupAddon addonType="append">
                                                <BS.Button outline={!this.state.save} color="warning" type="button" id="saveButton" onClick={() => this.setState({ save: !this.state.save })}><i className="fas fa-thumbtack"></i></BS.Button>
                                                <BS.Button outline color="secondary" type="button" onClick={() => this.toggle()}><i className="far fa-question-circle"></i></BS.Button>
                                            </BS.InputGroupAddon>

                                            <BS.UncontrolledTooltip placement="top" target="saveButton">
                                                Save key
                                        </BS.UncontrolledTooltip>
                                        </BS.InputGroup>
                                    </BS.Col>
                                </BS.FormGroup>

                                <hr />

                                <EthereumConfig />

                                <hr />

                                <div style={{ marginTop: 10, textAlign: 'center' }}>

                                    {connecting.get() === false ?
                                        <BS.Button
                                            color="primary"
                                            style={{ width: '100%' }}
                                            onClick={this.go.bind(this)}>Go</BS.Button>
                                        :
                                        loadingBar
                                    }
                                </div>

                            </BS.Form>


                            <BS.Modal isOpen={this.state.modal} toggle={() => this.toggle()}>
                                <BS.ModalHeader toggle={() => this.toggle()}>ECDSA Keys</BS.ModalHeader>
                                <BS.ModalBody>
                                    <p>Cryptography secures the database content from bad actors. Your identity is a <em>private key</em>. BluzelleStudio uses your key pair to sign off database operations. The key is only used locally within this webpage; it is never uploaded anywhere.</p>

                                    <hr />

                                    <p>Bluzelle uses the elliptic curve digital signature algorithm (<strong>ECDSA</strong>) on the curve <strong>secp256k1</strong> with an <strong>SHA-256</strong> hash. To emulate different users, use different keys.</p>

                                    <hr />

                                    <p>With OpenSSL installed, run <code>openssl ecparam -name secp256k1 -genkey -noout -out my_private_key.pem</code>. This will write the private key to a file called <code>my_private_key.pem</code>. Upload that file to BluzelleStudio.</p>

                                    <p>Alternatively, navigate to <a href="https://keytool.online/">https://keytool.online/</a>, select "ECDSA" and "P-256k" as the key type. Copy the private key and save it into a file on your computer. Upload that file to BluzelleStudio.</p>

                                    <p>The file should looks like this:</p>

                                    <div style={{ overflow: 'scroll' }}>
                                        <code style={{ whiteSpace: 'pre' }}>{'-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIFNmJHEiGpgITlRwao/CDki4OS7BYeI7nyz+CM8NW3xToAcGBSuBBAAK\noUQDQgAEndHOcS6bE1P9xjS/U+SM2a1GbQpPuH9sWNWtNYxZr0JcF+sCS2zsD+xl\nCcbrRXDZtfeDmgD9tHdWhcZKIy8ejQ==\n-----END EC PRIVATE KEY-----'}</code>
                                    </div>
                                </BS.ModalBody>
                                <BS.ModalFooter>
                                </BS.ModalFooter>
                            </BS.Modal>

                        </div>
                    </BS.Card>
                </div>
            </CenterMiddle>
        );
    }
}
