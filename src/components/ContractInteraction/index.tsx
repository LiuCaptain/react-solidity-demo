"use client"
import { useEffect, useRef } from "react"
import cn from "classnames"
import { BrowserProvider, getDefaultProvider, Contract } from "ethers"
import type { Signer, AbstractProvider } from "ethers"
import styles from "./index.module.scss"
import ownerAbi from "@/abi/owner.js"

export default function ContractInteraction() {
  const contractAddress = "0x003CEb1E0eD23881f46b9a9EA19a54Ad82F7625B"
  const signer = useRef<Signer | null>(null)
  const provider = useRef<AbstractProvider | BrowserProvider | null>(null)

  // 连接钱包
  const handleConnect = async () => {
    console.log("连接钱包")
    if (window.ethereum == null) {
      alert("MetaMask not installed")
      return false
    }
    try {
      signer.current = await (provider.current as BrowserProvider).getSigner()
      const address = await signer.current?.getAddress()
      console.log("address:", address)
    } catch (err) {
      console.log("err", err)
      alert("连接钱包失败，请稍后重试。")
    }
  }

  // 读取状态
  const handleRead = async () => {
    console.log("contractAddress", contractAddress)
    try {
      const contract = new Contract(contractAddress, ownerAbi, provider.current)
      const owner = await contract.getOwner()
      console.log("owner", owner)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (window.ethereum == null) {
      alert("MetaMask not installed; using read-only defaults")
      provider.current = getDefaultProvider()
    } else {
      provider.current = new BrowserProvider(window.ethereum)
    }
  }, [])

  return (
    <section className={styles.panel}>
      <h1 className={styles.title}>合约交互</h1>
      <p className={styles.subtitle}>在此接入钱包与合约逻辑</p>
      <div className={styles.actions}>
        <button type="button" className={cn(styles.btn, styles.btnConnect)} onClick={handleConnect}>
          连接钱包
        </button>
        <button type="button" className={cn(styles.btn, styles.btnRead)} onClick={handleRead}>
          读取状态
        </button>
        <button type="button" className={cn(styles.btn, styles.btnWrite)}>
          修改状态
        </button>
        <button type="button" className={cn(styles.btn, styles.btnSign)}>
          签名
        </button>
      </div>
    </section>
  )
}
