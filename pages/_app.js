import Main from "../components/Layout";
import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const InventoryAddress = "0x6Cd4999E1e755398CE2fA814CFb87a39E8187701";
export const SpaceOzTokenAddress = "0xA01241872c9a06766C08a3D7b414Bdf0E097D857";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_DAPP_URL}
    >
      <Main>
        <Component {...pageProps} />
      </Main>
      <ToastContainer />
    </MoralisProvider>
  );
}

export default MyApp;
