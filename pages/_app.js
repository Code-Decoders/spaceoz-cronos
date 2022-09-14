import Main from "../components/Layout";
import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const InventoryAddress = "0x280730941320aB22C4864eddde14EA8859354bA6";
export const SpaceOzTokenAddress = "0x63fF82f0e62aDBbfb3bB946aAf13802F41A83769";

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
