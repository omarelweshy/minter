import React, {useState,useCallback} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createMint, getMint, getOrCreateAssociatedTokenAccount, getAccount, mintTo, transfer } from '@solana/spl-token';
import { Keypair, Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import {  SystemProgram, Transaction } from '@solana/web3.js';


export default function InputForm() {
  const [tokenName, settokenName] = React.useState("");
  const [symbol, setSymbol] = React.useState("");
  const [initSupply, setinitSupply] = React.useState("");
  const [decimals, setDecimals] = React.useState("");
  const wallet = Keypair.generate();
  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();
  const connection = new Connection("http://localhost:8899", 'confirmed');
  const { publicKey, sendTransaction } = useWallet();

  
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create(Number(decimals), Number(initSupply))
  }

  const mywallet = useWallet();
  const [tokenAccountValue, settokenAccountValue] = useState('')
  const [newMintTokenAddress, setnewMintTokenAddress] = useState('')
  const [tokenMintSupply, settokenMintSupply] = useState('')
  const [accountTokenAmount, setaccountTokenAmount] = useState('')

  const create = async (decimal: number, InitialSupply: number) => {

    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      1000000000,
    );
    
    await connection.confirmTransaction(airdropSignature);
    
    const mint = await createMint(
      connection,
      wallet,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      decimal,
    )
    const newMintTokenAddress = mint.toBase58()
    setnewMintTokenAddress(newMintTokenAddress)

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint,
      wallet.publicKey
    )    
    const tokenAccountValue = tokenAccount.address.toBase58()
    settokenAccountValue(tokenAccountValue)
    
    await mintTo(
      connection,
      wallet,
      mint,
      tokenAccount.address,
      mintAuthority,
      InitialSupply,
    )

    const mintInfo = await getMint(
      connection,
      mint
    )
    // @ts-ignore
    const tokenMintSupply = parseFloat(mintInfo.supply)
    // @ts-ignore
    settokenMintSupply(tokenMintSupply)

    const tokenAccountInfo = await getAccount(
      connection,
      tokenAccount.address
    )
    // @ts-ignore
    const accountTokenAmount = parseFloat(tokenAccountInfo.amount)
    // @ts-ignore
    setaccountTokenAmount(accountTokenAmount)

    // await transfer(
    //   connection,
    //   wallet,
    //   wallet.publicKey,
    //   wallet.publicKey,
    //   wallet,
    //   9000,
    // )

  }

  const onClick = useCallback(async () => {
    // if (!publi) throw new WalletNotConnectedError();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: publicKey,
            lamports: 100000,
        })
    );

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signature, 'processed');
}, [wallet.publicKey, publicKey, sendTransaction, connection]);


  return (
    <div style={{
      display: 'block',
      width: 700,
      padding: 30
    }}>

<button onClick={onClick} disabled={!publicKey}>
            Send 1 lamport to a random address!
        </button>
      <h4>Create Token</h4>
      <Form onSubmit={submitForm}>
        <Form.Group>
          <Form.Label>Token Name:</Form.Label>
          <Form.Control type="text" value={tokenName} onChange={e => settokenName(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Symbol:</Form.Label>
          <Form.Control type="text" value={symbol} onChange={e => setSymbol(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Initial Supply:</Form.Label>
          <Form.Control type="number" value={initSupply} onChange={e => setinitSupply(e.target.value)}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Decimals(1-18):</Form.Label>
          <Form.Control type="number" min="1" max="18" value={decimals} onChange={e => setDecimals(e.target.value)}/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
      <br />
      <br />
      <p>New mint created with token address: {newMintTokenAddress}</p>
      <p>The account is: {tokenAccountValue}</p>
      <p>Minting ....</p>
      <p>Current token mint info: {tokenMintSupply}</p>
      <p>Tokens amount of the account: {accountTokenAmount}</p>
      <p>Mint Authority: {mintAuthority.publicKey.toBase58()}</p>
      <p>Freeze Authority: {freezeAuthority.publicKey.toBase58()}</p>

    </div>
  );
}