const config = [
    {
        name: "Mainnet",
        color: "primary", // primary, secondary, success, info, danger, warning, light, dark

        endpoint: "https://client.sentry.bluzellenet.bluzelle.com:1319/",
        chainid: "Bluzelle-Soft-Mainnet",
    },
    {
        name: "Test Public",
        color: "danger",

        endpoint: "https://client.sentry.testnet.public.bluzelle.com:1319/",
        chainid: "Bluzelle-Test-Public",
    },
    {
        name: "Test Private",
        color: "secondary",

        endpoint: "https://client.sentry.testnet.private.bluzelle.com:1319/",
        chainid: "Bluzelle-Test-Private",
    },
];

export default config;
