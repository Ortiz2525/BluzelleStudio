const config = require('../../../ethereum_config');

const uuidv4 = require('uuid/v4');


export const EthereumRPC = observable(config[0].ethereum_rpc);
export const ContractAddress = observable(config[0].contract_address);
export const uuid = observable(undefined);



@observer
export class EthereumConfig extends Component {

    constructor(props) {

        super(props);

        this.state = {
            toggle: false,
            active: config[0].name
        };

    }

    componentDidMount() {



    }

    render() {

        return (

            <React.Fragment>
            <div style={{marginTop: 10, textAlign: 'center'}}>
                        
                <BS.Button 
                    outline={true}
                    color="secondary"
                    style={{width: '100%'}}
                    onClick={() => this.setState({toggle: !this.state.toggle})}>

                    Show Config
                </BS.Button>
                  
            </div>


            { this.state.toggle &&

            <React.Fragment>
            <hr/>

            <BS.FormGroup row>
                <BS.Label sm={3} for="uuid">UUID:</BS.Label>
                <BS.Col sm={9}>
                 <BS.InputGroup>
                    <BS.Input type="text" name="uuid" onChange={e => uuid.set(e.target.value)} placeholder='<pub key>'/>
                  </BS.InputGroup>
                </BS.Col>
            </BS.FormGroup>

            <BS.FormGroup row>
                <BS.Label sm={3} for="address">Eth. RPC Address:</BS.Label>
                <BS.Col sm={9}>
                    <BS.Input type="text" name="address" onChange={e => EthereumRPC.set(e.target.value)} placeholder={EthereumRPC.get()} ref={e => {this.address = e;}}/>
                </BS.Col>
            </BS.FormGroup>

            <BS.FormGroup row>
                <BS.Label sm={3} for="port">Contract Address:</BS.Label>
                <BS.Col sm={9}>
                    <BS.Input type="text" name="contract" onChange={e => ContractAddress.set(e.target.value)} placeholder={ContractAddress.get()} ref={e => {this.contract = e;}}/>
                </BS.Col>
            </BS.FormGroup>

            <div style={{marginTop: 10, textAlign: 'center'}}>

                <BS.ButtonGroup style={{width: '100%'}}>

                    {
                        config.map(({
                            name,
                            color,
                            ethereum_rpc,
                            contract_address
                        }) => 
                            
                            <BS.Button
                                style={{flex:1}}
                                outline={true}
                                active={this.state.active === name}
                                color={color}
                                key={name}
                                onClick={() => {

                                    this.setState({active: name});

                                    EthereumRPC.set(ethereum_rpc);
                                    ContractAddress.set(contract_address);

                                    this.address && (this.address.value = '');
                                    this.contract && (this.contract.value = '');

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