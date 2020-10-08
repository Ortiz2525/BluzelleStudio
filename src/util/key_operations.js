import { ec as EC } from "elliptic";

const import_private_key_from_base64 = (priv_key_base64) => {
    const key_bin = Buffer.from(priv_key_base64, "base64");

    const key_hex = key_bin.toString("hex");

    // Like the header above. This one encodes:

    // - INTEGER 1
    // - OCTET STRING (32 byte) - PRIVATE KEY
    // - OBJECT IDENTIFIER 1.3.132.0.10 secp256k1 (SECG (Certicom) named elliptic curve)
    // - PUBLIC KEY

    // specified here: https://tools.ietf.org/html/rfc5915

    const header1 = key_hex.substring(0, 14);

    // assert.equal(header1, "30740201010420",
    //    "ECDSA Private Key Import: private key header is malformed. This is the private key you're trying to decode: \"" + priv_key_base64 + '"');

    const header2 = key_hex.substring(78, 78 + 26);

    //assert.equal(header2, "a00706052b8104000aa1440342",
    //    "ECDSA Private Key Import: private key header is malformed. This is the private key you're trying to decode: \"" + priv_key_base64 + '"');

    const body = key_hex.substring(14, 14 + 64);

    const ec = new EC("secp256k1");

    // Decodes the body into x and y.

    return ec.keyFromPrivate(body, "hex");
};

export const pub_from_priv = (priv_key_base64) => {
    const ec_key = import_private_key_from_base64(priv_key_base64);

    // This is the only way we get the long-form encoding found in PEM's.

    // It returns a buffer and not base64 for God-knows why.

    const pub = ec_key.getPublic(false, "base64");

    // Strip the first byte since those are present
    // in the base64 header we've provided.

    const pub_hex = Buffer.from(pub).toString("hex");

    return (
        "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE" +
        Buffer.from(pub_hex.substring(2), "hex").toString("base64")
    );
};
