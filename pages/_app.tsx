import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Ethereum, Goerli } from "@thirdweb-dev/chains";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={Goerli}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
