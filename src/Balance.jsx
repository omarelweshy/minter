
import { useState } from 'react';
import { Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

function Balance() {
  const connection = new Connection("http://localhost:8899");
  const wallet = useWallet();
  const [balance, setBalance] = useState(null)

  const getBalanceOut = async () => {
    const result = await connection.getBalance(wallet.publicKey, 'confirmed')
    setBalance(result)
    return result;
  }

  getBalanceOut()
  console.log(balance);
};

// export default Balance;