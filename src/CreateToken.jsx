import { createMint } from '@solana/spl-token';
import { Keypair, Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

export default function CreateToken() {
  const wallet = Keypair.generate();
  const payer = wallet;
  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();
  const connection = new Connection("http://localhost:8899", 'confirmed');

  const create = async () => {
    console.log(payer.publicKey.toBase58())
    const mint = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      9
    )

    console.log(mint.toBase58());
  }

  create()
}


