import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from 'next/head';
import UiProvider from "../providers/UiProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Scroll Wallet Transfer</title>
        <meta name="description" content="Transfer ETH using your Scroll Wallet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UiProvider>
        <Component {...pageProps} />
      </UiProvider>
    </>
  );
}
