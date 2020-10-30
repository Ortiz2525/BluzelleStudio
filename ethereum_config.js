const config = [
    {
        name: "Mainnet",
        color: "primary", // primary, secondary, success, info, danger, warning, light, dark

        endpoint: "https://client.sentry.bluzellenet.bluzelle.com:1319",
    },
    {
        name: "TestNet Public",
        color: "danger",

        endpoint: "https://client.sentry.testnet.public.bluzelle.com:1319",
        gas_price: 10,
    },
    {
        name: "TestNet Private",
        color: "secondary",

        endpoint: "https://client.sentry.testnet.private.bluzelle.com:1317",
        gas_price: 0.002,
    },
]

export default config
