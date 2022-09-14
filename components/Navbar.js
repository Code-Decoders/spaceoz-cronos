import React, { useEffect } from "react";
import {
  useChain,
  useMoralis,
  useMoralisWeb3Api,
  useTokenPrice,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis";
import styles from "../styles/Navbar.module.css";
import InventoryABI from "../build/contracts/SpaceOzInventory.json";
import BigNumber from "bignumber.js";
import { metadata } from "../pages";
import { InventoryAddress, SpaceOzTokenAddress } from "../pages/_app";

const Navbar = () => {
  const {
    authenticate,
    isWeb3Enabled,
    account: user,
    isAuthenticated,
    isInitialized,
    logout,
    Moralis,
    authError,
    enableWeb3,
  } = useMoralis();
  const [account, setAccount] = React.useState(null);
  const { switchNetwork } = useChain();
  const mint_abi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "priceInSPT",
          type: "uint256",
        },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const { runContractFunction: mint } = useWeb3Contract();

  const mint_by_owner = async () => {
    console.log("mint by owner");
    for (let index = 0; index < metadata.length; index++) {
      var ship = metadata[index];
      if (ship.id == index + 1) {
        console.log("minting ship", ship.id);
        var transaction = await mint({
          params: {
            abi: mint_abi,
            contractAddress: InventoryAddress,
            functionName: "mint",
            params: {
              price: BigNumber(ship.price).toString(),
              priceInSPT: ship.priceSPZ,
            },
          },
          onError: (error) => {
            console.log(error);
          },
          onSuccess: (result) => {
            console.log(result);
          },
        });
        // await transaction.wait()
      }
    }
  };

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      enableWeb3().then((val) => {
        if (val) switchNetwork("0x19");
        // mint_by_owner();
      });
      if (user) setAccount(user);
    }
  }, [isInitialized, isAuthenticated, user]);

  return (
    <div className={styles["navbar-container"]}>
      <div
        className={styles["navbar-button"]}
        onClick={() => {
          console.log("authenticate");
          authenticate();
        }}
      >
        {isAuthenticated ? account?.slice(0, 10) + "..." : `Connect`}
      </div>
      {isAuthenticated && (
        <div
          className={styles["navbar-button"]}
          onClick={() => {
            console.log("logout");
            logout();
          }}
        >
          Logout
        </div>
      )}
    </div>
  );
};

export default Navbar;
