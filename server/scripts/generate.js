const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();

console.log('Private key:', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log('Public key:', toHex(publicKey));

function getAddress(publicKey) {
    const restOfBytes = publicKey.slice(1);
    const hash = keccak256(restOfBytes);
    return hash.slice(-20);
}

const address = getAddress(publicKey);

console.log('Address:', `0x${toHex(address)}`);