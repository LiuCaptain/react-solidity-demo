"use client"
import { useRef, useState } from "react"
import cn from "classnames"
import { BrowserProvider, Contract } from "ethers"
import type { Signer, AbstractProvider } from "ethers"
import toast from "@/uilts/toast"
import styles from "./index.module.scss"
import ownerAbi from "@/abi/owner.js"

export default function ContractInteraction() {
  const contractAddress = "0x003CEb1E0eD23881f46b9a9EA19a54Ad82F7625B"
  const signer = useRef<Signer | null>(null)
  const provider = useRef<AbstractProvider | BrowserProvider | null>(null)
  const [loading, setLoading] = useState(false)

  const runWithLoading = async (action: () => Promise<void>) => {
    setLoading(true)

    try {
      await action()
    } finally {
      setLoading(false)
    }
  }

  // 连接钱包
  const handleConnect = async () => {
    await runWithLoading(async () => {
      console.log("连接钱包")
      if (window.ethereum == null) {
        alert("MetaMask 钱包未安装")
      } else {
        provider.current = new BrowserProvider(window.ethereum)
        signer.current = await (provider.current as BrowserProvider).getSigner()
        const address = await signer.current.getAddress()
        console.log("address", address)
      }
    })
  }

  // 读取状态
  const handleRead = async () => {
    await runWithLoading(async () => {
      try {
        const network = await (provider.current as BrowserProvider).getNetwork()
        // const code = await (provider.current as BrowserProvider).getCode(contractAddress)
        console.log("network", network)

        const contract = new Contract(contractAddress, ownerAbi, provider.current)
        const owner = await contract.getOwner()
        console.log("owner", owner)
      } catch (err) {
        console.log(err)
      }
    })
  }

  // 更新状态
  const handleUpdate = async () => {
    await runWithLoading(async () => {
      try {
        const otherOwner = "0x2ad99498D90c835EAd930427042bd0953B036F6a"
        const contract = new Contract(contractAddress, ownerAbi, signer.current)
        const tx = await contract.changeOwner(otherOwner)
        await tx.wait()
      } catch (err: any) {
        toast.error(err.reason)
      }
    })
  }

  return (
    <section className={styles.panel}>
      {loading ? (
        <div className={styles.overlay} aria-live="polite" aria-busy="true">
          <div className={styles.spinner} aria-hidden="true" />
        </div>
      ) : null}
      <h1 className={styles.title}>合约交互</h1>
      <p className={styles.subtitle}>在此接入钱包与合约逻辑</p>
      <div className={styles.actions}>
        <button
          type="button"
          className={cn(styles.btn, styles.btnConnect)}
          onClick={handleConnect}
          disabled={loading}
        >
          连接钱包
        </button>
        <button
          type="button"
          className={cn(styles.btn, styles.btnRead)}
          onClick={handleRead}
          disabled={loading}
        >
          读取状态
        </button>
        <button
          type="button"
          className={cn(styles.btn, styles.btnWrite)}
          onClick={handleUpdate}
          disabled={loading}
        >
          修改状态
        </button>
        <button type="button" className={cn(styles.btn, styles.btnSign)} disabled={loading}>
          签名
        </button>
      </div>
    </section>
  )
}
