import { useEffect, useState } from "react";
import config from "../../../ethereum_config";

const EthereumConfig = ({
    address,
    contract,
    uuid,
    setAddress,
    setContract,
    setUuid,
}) => {
    const [toggle, setToggle] = useState(
        window.cookiesObj.toggle === "true" || false
    );
    const [active, setActive] = useState(
        window.cookiesObj.active || config[0].name
    );

    useEffect(() => {
        document.cookie = "toggle=" + toggle;
        document.cookie = "active=" + active;
    }, [toggle, active]);

    return (
        <>
            <div style={{ marginTop: 10, textAlign: "center" }}>
                <BS.Button
                    outline={true}
                    color="secondary"
                    style={{ width: "100%" }}
                    onClick={() => setToggle(!toggle)}
                >
                    Show Config
                </BS.Button>
            </div>

            {toggle && (
                <>
                    <hr />

                    <BS.FormGroup row>
                        <BS.Label sm={3} for="uuid">
                            UUID:
                        </BS.Label>
                        <BS.Col sm={9}>
                            <BS.InputGroup>
                                <BS.Input
                                    type="text"
                                    name="uuid"
                                    value={uuid}
                                    onChange={(e) => setUuid(e.target.value)}
                                    placeholder="<pub key>"
                                />
                            </BS.InputGroup>
                        </BS.Col>
                    </BS.FormGroup>

                    <BS.FormGroup row>
                        <BS.Label sm={3} for="address">
                            Eth. RPC Address:
                        </BS.Label>
                        <BS.Col sm={9}>
                            <BS.Input
                                type="text"
                                name="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </BS.Col>
                    </BS.FormGroup>

                    <BS.FormGroup row>
                        <BS.Label sm={3} for="port">
                            Contract Address:
                        </BS.Label>
                        <BS.Col sm={9}>
                            <BS.Input
                                type="text"
                                name="contract"
                                value={contract}
                                onChange={(e) => setContract(e.target.value)}
                            />
                        </BS.Col>
                    </BS.FormGroup>

                    <div style={{ marginTop: 10, textAlign: "center" }}>
                        <BS.ButtonGroup style={{ width: "100%" }}>
                            {config.map(
                                ({
                                    name,
                                    color,
                                    ethereum_rpc,
                                    contract_address,
                                }) => (
                                    <BS.Button
                                        style={{ flex: 1 }}
                                        outline={true}
                                        color={color}
                                        key={name}
                                        onClick={() => {
                                            setActive(name);
                                            setAddress(ethereum_rpc);
                                            setContract(contract_address);
                                        }}
                                    >
                                        {name}
                                    </BS.Button>
                                )
                            )}
                        </BS.ButtonGroup>
                    </div>
                </>
            )}
        </>
    );
};

export default EthereumConfig;
