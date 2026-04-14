import styles from "./page.module.scss";
import cn from "classnames";

export default function Home() {
  return (
    <div className={styles.page}>
      <section
        className={styles.panel}
        aria-labelledby="contract-actions-title"
      >
        <h1 id="contract-actions-title" className={styles.title}>
          合约交互
        </h1>
        <p className={styles.subtitle}>在此接入钱包与合约逻辑</p>
        <div className={styles.actions}>
          <button type="button" className={cn(styles.btn, styles.btnRead)}>
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
    </div>
  );
}
