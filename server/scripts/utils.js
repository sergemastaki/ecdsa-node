const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey) {
    const restOfBytes = publicKey.slice(1);
    const hash = keccak256(restOfBytes);
    return hash.slice(-20);
}

module.exports = getAddress;