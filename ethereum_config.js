const config = [
    {
        name: "Ropsten Testnet",
        color: "primary", // primary, secondary, success, info, danger, warning, light, dark

        ethereum_rpc: "https://ropsten.infura.io:443",
        chainid: "ropsten",
    },
    {
        name: "Tata Testnet",
        color: "danger",

        ethereum_rpc: "https://ropsten.infura.io:443",
        chainid: "tata",
    },
    {
        name: "Private",
        color: "secondary",

        ethereum_rpc: "http://127.0.0.1:8545",
        chainid: "Fill me",
    },
];

export default config;
