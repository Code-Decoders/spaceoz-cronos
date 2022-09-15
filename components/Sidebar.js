import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useERC20Balances,
  useMoralis,
  useNativeBalance,
  useTokenPrice,
} from "react-moralis";
import styles from "../styles/Sidebar.module.css";
import BigNumber from "big-number/big-number";
import { SpaceOzTokenAddress } from "../pages/_app";

const Sidebar = () => {
  const [active, setActive] = useState(0);
  const { pathname } = useRouter();
  const [balance, setBalance] = useState("0");
  const [sptBalance, setSptBalance] = useState("0");

  useEffect(() => {
    switch (pathname) {
      case "/":
        setActive(0);
        break;
      case "/portfolio":
        setActive(1);
        break;
      case "/playground":
        setActive(2);
    }
  }, [pathname]);

  const { Moralis, isInitialized, isAuthenticated, web3, enableWeb3, account } =
    useMoralis();

  async function getBalance() {
    const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
    var response = await fetch(
      `https://api.covalenthq.com/v1/25/address/${account}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=true&key=${apiKey}`
    );
    console.log("getBalance");
    console.log(account);
    var balances = (await response.json()).data.items;

    setSptBalance(
      balances?.find((token) => token.contract_ticker_symbol === "SPT")
        ?.balance ?? "0"
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setBalance(
      (
        parseInt(
          balances?.find((token) => token.contract_ticker_symbol === "CRO")
            ?.balance ?? "0"
        ) /
        10 ** 18
      ).toFixed(2)
    );
  }

  useEffect(() => {
    if (isInitialized && isAuthenticated && account) {
      getBalance();
      setInterval(async () => {
        getBalance();
      }, 5000);
    }
  }, [isInitialized, isAuthenticated, account]);

  return (
    <div style={{ flex: 0.18 }} className={styles["sidebar-container"]}>
      <div className={styles["logo-text"]}>SpaceOz</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          flex: 1,
          alignItems: "flex-end",
          gap: "1.5rem 0",
        }}
      >
        <Link href={"/"}>
          <div
            className={
              styles["sidebar-button"] +
              (active == 0 ? ` ${styles["active"]}` : "")
            }
          >
            <img src="/icons/Menu.svg" width={20} />
            <div style={{ flex: 1 }}>Inventory</div>
            <div className={styles["sidebar-block"]} />
          </div>
        </Link>
        {/* <Link href={'portfolio'}>
          <div className={styles['sidebar-button'] + (active == 1 ? ` ${styles['active']}` : "")}>
            <img src="/icons/Star.svg" width={20} />
            <div style={{ flex: 1 }}>Portfolio</div>
            <div className={styles['sidebar-block']} />
          </div>
        </Link> */}
        <Link href={"playground"}>
          <div
            className={
              styles["sidebar-button"] +
              (active == 2 ? ` ${styles["active"]}` : "")
            }
          >
            <img src="/icons/Game.svg" width={20} />
            <div style={{ flex: 1 }}>Playground</div>
            <div className={styles["sidebar-block"]} />
          </div>
        </Link>
      </div>
      <div className={styles["sidebar-balance-container"]}>
        <div style={{ fontSize: "20px" }}>Balance</div>
        <div>{balance} CRO</div>
        <div>{sptBalance} SPT</div>
      </div>
    </div>
  );
};

export default Sidebar;
