import config from '../../../ethereum_config';

export const EthereumRPC = observable();
export const ContractAddress = observable();
export const uuid = observable();

@observer
export class EthereumConfig extends Component {

    constructor(props) {

        super(props);

        this.state = {
            toggle: (window.cookiesObj.toggle === 'true') || false,
            active: window.cookiesObj.active || config[0].name,
            uuid: window.cookiesObj.uuid || '',
            address: window.cookiesObj.address || config[0].ethereum_rpc,
            contract: window.cookiesObj.contract || config[0].contract_address,
        };


        const url = new URL(window.location.href);

        if (url.searchParams.get("uuid")) {
            this.state.uuid = url.searchParams.get("uuid");
        }

        if (url.searchParams.get("address")) {
            this.state.address = url.searchParams.get("address");
        }

        if (url.searchParams.get("contract")) {
            this.state.contract = url.searchParams.get("contract");
        }


        this.componentDidUpdate();

    }

    componentDidUpdate() {

        EthereumRPC.set(this.state.address);
        ContractAddress.set(this.state.contract);
        uuid.set(this.state.uuid);

        document.cookie = "toggle=" + this.state.toggle;
        document.cookie = "active=" + this.state.active;

        document.cookie = "uuid=" + this.state.uuid;
        document.cookie = "address=" + this.state.address;
        document.cookie = "contract=" + this.state.contract;

    }

    render() {

        return (

            <React.Fragment>
                <div style={{ marginTop: 10, textAlign: 'center' }}>

                    <BS.Button
                        outline={true}
                        color="secondary"
                        style={{ width: '100%' }}
                        onClick={() => this.setState({ toggle: !this.state.toggle })}>

                        Show Config
                </BS.Button>

                </div>


                { this.state.toggle &&

                    <React.Fragment>
                        <hr />

                        <BS.FormGroup row>
                            <BS.Label sm={3} for="uuid">UUID:</BS.Label>
                            <BS.Col sm={9}>
                                <BS.InputGroup>
                                    <BS.Input type="text" name="uuid" value={this.state.uuid} onChange={e => this.setState({ uuid: e.target.value })} placeholder='<pub key>' />
                                </BS.InputGroup>
                            </BS.Col>
                        </BS.FormGroup>

                        <BS.FormGroup row>
                            <BS.Label sm={3} for="address">Eth. RPC Address:</BS.Label>
                            <BS.Col sm={9}>
                                <BS.Input type="text" name="address" value={this.state.address} onChange={e => this.setState({ address: e.target.value })} />
                            </BS.Col>
                        </BS.FormGroup>

                        <BS.FormGroup row>
                            <BS.Label sm={3} for="port">Contract Address:</BS.Label>
                            <BS.Col sm={9}>
                                <BS.Input type="text" name="contract" value={this.state.contract} onChange={e => this.setState({ contract: e.target.value })} />
                            </BS.Col>
                        </BS.FormGroup>

                        <div style={{ marginTop: 10, textAlign: 'center' }}>

                            <BS.ButtonGroup style={{ width: '100%' }}>

                                {
                                    config.map(({
                                        name,
                                        color,
                                        ethereum_rpc,
                                        contract_address
                                    }) =>

                                        <BS.Button
                                            style={{ flex: 1 }}
                                            outline={true}
                                            color={color}
                                            key={name}
                                            onClick={() => {

                                                this.setState({ active: name, address: ethereum_rpc, contract: contract_address });

                                            }}>

                                            {name}
                                        </BS.Button>

                                    )
                                }

                            </BS.ButtonGroup>

                        </div>

                    </React.Fragment>
                }

            </React.Fragment>
        );

    }

}