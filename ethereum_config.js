const config = [
    {
        name: "Mainnet",
        color: "primary", // primary, secondary, success, info, danger, warning, light, dark

        endpoint: "https://client.sentry.bluzellenet.bluzelle.com:1319",
        chainid: "Bluzelle-Soft-Mainnet",
    },
    {
        name: "Test Public",
        color: "danger",

        endpoint: "https://client.sentry.testnet.public.bluzelle.com:1319",
        chainid: "bluzelleTestNetPublic-6",
        gas_price: 10,
    },
    {
        name: "Test Private",
        color: "secondary",

        endpoint: "https://client.sentry.testnet.private.bluzelle.com:1317",
        chainid: "bluzelleTestNetPrivate-18",
        gas_price: 0.002,
    },
]

export default config
