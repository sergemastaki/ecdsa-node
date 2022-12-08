const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = process.argv[3];
const msg = process.argv[2];

(async () => {
    const msgHash = await secp.utils.sha256(msg);
    const signature = await secp.sign(msgHash,privateKey);
    console.log('Signature:', toHex(signature));
  })();
