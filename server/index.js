const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const getAddress = require("./scripts/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x122a2d6ea5f0790880c6074b9e23be5bc78cff84": 100,
  "0x8f5d4d21bd45ef66f3f9bba65bba78a27c98d46c": 50,
  "0x1b18f8eff11c178c3851d1cf390c4642d4bfc09b": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async(req, res) => {
  const { recipient, amount } = req.body;
  let sender = "";
  try {
    sender = await recoverSender(req.body);
  } catch (ex) {
    res.status(500).send({ message: "Invalid signature!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

async function recoverSender({ signature, amount, recipient, nonce }){
  const message = JSON.stringify({
    amount,
    recipient,
    nonce
  });
  const msgHash = await secp.utils.sha256(message);
  const publicKey = secp.recoverPublicKey(msgHash,signature,0);
  const address = getAddress(publicKey);
  return `0x${toHex(address)}`;
}
