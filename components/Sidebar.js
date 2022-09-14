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
  const { fetchERC20Balances: getBalances } = useERC20Balances();

  async function getBalance() {
    console.log("getBalance");
    console.log(account);
    var balances = await getBalances({
      chain: "0x152",
    });

    setSptBalance(
      balances?.find((token) => token.token_address === SpaceOzTokenAddress)
        ?.balance ?? "0"
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    var token = await Moralis.Web3API.account.getNativeBalance({
      address: account,
      chain: "0x152",
    });
    setBalance((token.balance / 10 ** 18).toFixed(2));
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
        <div>{balance} TCRO</div>
        <div>{sptBalance} SPT</div>
      </div>
    </div>
  );
};

export default Sidebar;
