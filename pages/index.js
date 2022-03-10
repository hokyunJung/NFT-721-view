import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import {Form} from 'react-bootstrap'
import Mint from '../src/mint'
import Mynft from '../src/mynft'
import { xcubeTokenAbi, saleNftTokenAbi, xcubeTokenAddress, saleNftTokenAddress } from '../src/ethereum-env'

let Web3 = require('web3')

export default function Home() {
  const [menu, setMenu] = useState('')
  const [wallet, setWallet] = useState('');
  const [web3, setWeb3] = useState(null)
  const [xcubeTokenContract, setXcubeTokenContract] = useState(null)
  const [saleNftTokenContract, setSaleNftTokenContract] = useState(null)

  const getWallet = async () => {
    try {
      if (window.ethereum) {
        const wallets = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setWallet(wallets[0]);

        let w3 = new Web3(window.ethereum)
        setWeb3(w3)

        let x = new w3.eth.Contract(xcubeTokenAbi, xcubeTokenAddress)
        setXcubeTokenContract(x)

        let response = await x.methods
        .saleNftToken()
        .call();

        if (w3.utils.isAddress(response) === true && response === '0x0000000000000000000000000000000000000000') {
          alert('you must set saleNftToken')
          const result = await x.methods.setSaleNftToken(saleNftTokenAddress).send({from : wallets[0]});
          console.log(result)
        }
        

        let s = new w3.eth.Contract(saleNftTokenAbi, saleNftTokenAddress)
        setSaleNftTokenContract(s)

      } else {
        alert('you must install metamask')
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWallet();
    console.log(wallet)
  }, [wallet]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Form.Select aria-label="Default select example" onChange={e => setMenu(e.target.value)}>
          <option>Open this select menu</option>
          <option value="mint">mint</option>
          <option value="mynft">mynft</option>
          <option value="3">Three</option>
        </Form.Select>
        {menu === 'mint' ? <Mint wallet={wallet} xcubeTokenContract={xcubeTokenContract} /> : null}
        {menu === 'mynft' ? <Mynft wallet={wallet} xcubeTokenContract={xcubeTokenContract} xcubeTokenAddress={xcubeTokenAddress}/> : null}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
