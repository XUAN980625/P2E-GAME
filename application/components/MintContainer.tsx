import {
  useAddress,
  useClaimNFT,
  useContract,
  // useEditionDrop,
  Web3Button,
} from "@thirdweb-dev/react";
import React from "react";
import { CHARACTER_ADDRESS } from "../const/contractAddress";
import styles from "../styles/Home.module.css";

//import Image from 'next/image';

export default function MintContainer() {
  
  // const editionDrop = useContract(CHARACTER_ADDRESS);
  // const { mutate : claim } = useClaimNFT(editionDrop);

  // const address = useAddress();

  return (
    <div className={styles.collectionContainer}>
      <h1>放著搜集星星，然後買工具的遊戲。</h1>

      <p>先搜集這隻紫色的東西開始遊戲~</p>

      <div className={`${styles.nftBox} ${styles.spacerBottom}`}>
        <img src="/Wendy.gif" style={{ height: 200 }} alt={""}/>
      </div>

     <div className={styles.smallMargin}>

        <Web3Button
          // colorMode="dark"
          contractAddress={CHARACTER_ADDRESS}
          action={(contract) => contract.erc1155.claim(0, 1)}
          //accentColor = "#000"
        >
          搜集 NFT
        </Web3Button>

      </div>
    </div>
  );

  
}