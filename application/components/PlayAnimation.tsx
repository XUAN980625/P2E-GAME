import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import styles from "../styles/Gameplay.module.css";

import Image from 'next/image';

const WendyStar = (
    <div className={styles.slide}>
      <Image src="/WendyCoin.png" height="48" width="48" alt="WendyCoin" />
    </div>
  );
  
  type Props = {
    tool: NFT | undefined;
  };
  
  export default function PlayAnimation({ tool }: Props) {
    if (!tool) {
      return <div style={{ marginLeft: 8 }}>I need a tool!</div>;
    }
  
    return (
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
          {WendyStar}
        </div>
      </div>
    );
  }