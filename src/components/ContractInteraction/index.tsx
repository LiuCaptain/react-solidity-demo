"use client"
import { useRef, useState } from "react"
import cn from "classnames"
import { BrowserProvider, Contract, verifyMessage } from "ethers"
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
        const contract = new Contract(contractAddress, ownerAbi, signer.current)
        const otherOwnerOne = "0x3b11ed78c98D249648b9262d806E74AFCAf9b7cD" // account 1
        const tx = await contract.changeOwner(otherOwnerOne)
        // const otherOwnerTwo = "0x2ad99498D90c835EAd930427042bd0953B036F6a" // account 2
        // const tx = await contract.changeOwner(otherOwnerTwo)

        await tx.wait()
        toast.success("合约更新成功！")
      } catch (err: any) {
        toast.error(err.reason)
      }
    })
  }

  const handleSign = async () => {
    await runWithLoading(async () => {
      const message = "Hello, World!"
      const signature = await signer.current?.signMessage(message)
      console.log("signature", signature)

      const recoveredAddress = await verifyMessage(message, signature!)
      console.log("recoveredAddress", recoveredAddress)

      toast.success(`签名成功！签名地址：${recoveredAddress}`)
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
        <button
          type="button"
          className={cn(styles.btn, styles.btnSign)}
          disabled={loading}
          onClick={handleSign}
        >
          签名
        </button>
      </div>
    </section>
  )
}
