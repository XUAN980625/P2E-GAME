import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { CHARACTER_ADDRESS } from "../const/contractAddress";
import MintContainer from "../components/MintContainer";
import { useRouter } from "next/router";

const Home: NextPage = () => {

  const { contract: editionDrop } = useContract( CHARACTER_ADDRESS, "edition-drop" );
  const address = useAddress();
  const router = useRouter();

  const {
    data : ownedNfts,isLoading,isError,
  } = useOwnedNFTs(editionDrop,address);

  // 0. Wallet Connect - required to check if they own an NFT
  if (!address) {
    return (
      <div className={styles.container}>
        <ConnectWallet 
        // colorMode="dark"
        />
      </div>
    );
  }

  // 1. Loading
  if (isLoading) {
    return <div>等一下下喔...</div>;
  }

  // Something went wrong
  if (!ownedNfts || isError) {
    return <div>Error</div>;
  }

  // 2. No NFTs - mint page
  if (ownedNfts.length === 0) {
    return (
      <div className={styles.container}>
        <MintContainer />
      </div>
    );
  }

  // 3. Has NFT already - show button to take to game
  return (
    <div className={styles.container}>
      <button
        className={`${styles.mainButton} ${styles.spacerBottom}`}
        onClick={() => router.push(`/game`)}
      >
        --開始遊戲--
      </button>
    </div>
  );


};

export default Home;
