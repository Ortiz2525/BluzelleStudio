const config = [{
        name: 'Ropsten Testnet',
        color: 'primary', // primary, secondary, success, info, danger, warning, light, dark 

        ethereum_rpc: 'https://ropsten.infura.io:443',
        contract_address: '0xf039E760a4E97b1E50689ea6572DD74a46359aD9',
    },
    {
        name: 'Tata Testnet',
        color: 'danger',

        ethereum_rpc: 'https://ropsten.infura.io:443',
        contract_address: '0xf36af9818a39b05efd53b4866a63a65a0f70d3a0',
    },
    {
        name: 'Private',
        color: 'secondary',

        ethereum_rpc: 'http://127.0.0.1:8545',
        contract_address: 'fill me',
    },
];

export default config;