import React, { useCallback, useEffect, useState } from "react";
import { useERC20Balances, useMoralis, useMoralisWeb3Api } from "react-moralis";
import { Unity, useUnityContext } from "react-unity-webgl";
import Web3 from "web3";
import { metadata } from "..";
import { InventoryAddress, SpaceOzTokenAddress } from "../_app";
import TokenABI from "../../build/contracts/SpaceOzToken.json";

const Playground = () => {
  const {
    unityProvider,
    isLoaded,
    unload,
    loadingProgression,
    addEventListener,
    removeEventListener,
    sendMessage,
  } = useUnityContext({
    loaderUrl: "build/Build.loader.js",
    dataUrl: "build/Build.data",
    frameworkUrl: "build/Build.framework.js",
    codeUrl: "build/Build.wasm",
    productName: "SpaceOz",
    companyName: "CodeDecoders",
  });

  const [coins, setCoins] = useState(0);

  const [ships, setShips] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isInitialized, account } = useMoralis();
  const Web3API = useMoralisWeb3Api();
  const { fetchERC20Balances } = useERC20Balances();

  useEffect(() => {
    if (isAuthenticated && isInitialized && account) {
      getData();
      window.account = account;
    }
  }, [isAuthenticated, isInitialized, account]);

  const getData = async () => {
    setLoading(true);
    var result = await Web3API.account.getNFTsForContract({
      chain: "0x19",
      token_address: InventoryAddress,
      address: account,
    });
    var ids = result.result.map((e) => parseInt(e.token_id));

    ids.forEach(async (id) => {
      if (metadata.find((e) => e.id === id).type === "Warship") {
        setShips((val) => [...val, id]);
      } else {
        setBullets((val) => [...val, id]);
      }
    });
    const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
    var response = await fetch(
      `https://api.covalenthq.com/v1/25/address/${account}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=true&key=${apiKey}`
    );
    var balances = (await response.json()).data.items;

    setCoins(
      parseInt(
        balances?.find((token) => token.contract_ticker_symbol === "SPT")
          ?.balance ?? "0"
      )
    );
    console.log(balances);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
    }
  }, [isAuthenticated, isInitialized]);

  const handleCoins = useCallback((val) => {
    console.log(val, window.account);
    if (window.account) {
      const web3 = new Web3(process.env.NEXT_PUBLIC_ROCKX_RPC_URL);
      const privateKey = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY;

      const admin = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
      web3.eth.accounts.wallet.add(admin);
      web3.eth.defaultAccount = admin.address;
      const contract = new web3.eth.Contract(TokenABI.abi, SpaceOzTokenAddress);

      contract.methods
        .mint(window.account, val)
        .send({
          from: admin.address,
          gasLimit: 71275,
          gasPrice: web3.utils.toWei("40", "gwei"),
        })
        .then(console.log)
        .catch(console.log);
    }
  }, []);

  const OnAppReady = useCallback(() => {
    sendMessage("Coins", "GetUserCoins", coins);
    sendMessage("Coins", "GetShips", ships.join(","));
    sendMessage("Coins", "GetBullets", bullets.join(","));
  }, [sendMessage]);

  useEffect(() => {
    addEventListener("MintTokens", handleCoins);
    addEventListener("OnAppReady", OnAppReady);
    return () => {
      unload();
      removeEventListener("MintTokens", handleCoins);
      removeEventListener("OnAppReady", OnAppReady);
    };
  }, [addEventListener, removeEventListener, handleCoins, OnAppReady, unload]);

  // We'll round the loading progression to a whole number to represent the
  // percentage of the Unity Application that has loaded.
  const loadingPercentage = Math.round(loadingProgression * 100);

  return (
    <div>
      {isLoaded === false && (
        // We'll conditionally render the loading overlay if the Unity
        // Application is not loaded.
        <div className="loading-overlay">
          <p>Loading... ({loadingPercentage}%)</p>
        </div>
      )}
      {!loading && (
        <Unity
          className="unity"
          unityProvider={unityProvider}
          style={{
            width: "calc(100% - 5rem)",
            aspectRatio: "16/9",
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
};

export default Playground;
