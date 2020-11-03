const config = [
    {
        name: "Mainnet",
        color: "primary", // primary, secondary, success, info, danger, warning, light, dark

        endpoint: "https://client.sentry.bluzellenet.bluzelle.com:1319",
        bigdipper: "http://bigdipper.bluzellenet.bluzelle.com",
    },
    {
        name: "TestNet Public",
        color: "danger",

        endpoint: "https://client.sentry.testnet.public.bluzelle.com:1319",
        gas_price: 10,
        bigdipper: "http://bigdipper.testnet.public.bluzelle.com",
    },
    {
        name: "TestNet Private",
        color: "secondary",

        endpoint: "https://client.sentry.testnet.private.bluzelle.com:1317",
        gas_price: 0.002,
        bigdipper: "http://bigdipper.testnet.private.bluzelle.com",
    },
]

export default config
