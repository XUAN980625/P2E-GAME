import { ThirdwebNftMedia, useAddress, useNFT } from "@thirdweb-dev/react";
import { EditionDrop, NFT, SmartContract } from "@thirdweb-dev/sdk";
import React, { useEffect, useState } from "react";
import ContractMappingR from "../types/contractMappingR";
import GameplayAnimation from "./PlayAnimation";
import styles from "../styles/Home.module.css";

import Image from 'next/image';

type Props = {
  miningContract: SmartContract<any>;
  characterContract: EditionDrop;
  toolContract: EditionDrop;
};

/**
 * This component shows the:
 * - Currently equipped miner character (right now there is just one (token ID 0))
 * - Currently equipped character's tool
 */
export default function CurrentGear({
  miningContract,
  characterContract,
  toolContract,
}: Props) {
  const address = useAddress();

  const { data: playerNft } = useNFT(characterContract, 0);
  const [tool, setTool] = useState<NFT>();
//   const [tool, setTool] = useState<editionDropMatadata>();

  useEffect(() => {
    (async () => {
      if (!address) return;

      const p = (await miningContract.call(
        "playertool",
        [address]
      )) as ContractMappingR;

      // Now we have the tokenId of the equipped tool, if there is one, fetch the metadata for it
      if (p.isData) {
        const toolMetadata = await toolContract.get(p.value);
        setTool(toolMetadata);
      }
    })();
  }, [address, miningContract, toolContract]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h2 className={`${styles.noGapTop} `}>目前裝備的工具</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* Currently equipped player */}
        <div style={{ outline: "1px solid grey", borderRadius: 16 }}>
          {playerNft && (
            <ThirdwebNftMedia metadata={playerNft?.metadata} height={"100px"} />
          )}
        </div>
        {/* Currently equipped tool */}
        <div
          style={{ outline: "1px solid grey", borderRadius: 16, marginLeft: 8 }}
        >
          {tool && (
            // @ts-ignore
            <ThirdwebNftMedia metadata={tool.metadata} height={"100px"} />
          )}
        </div>
      </div>

      {/* Gameplay Animation */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 24,
          marginLeft: "20%",
        }}
      >
        <Image src="/Wendy.gif" height={64} width={64} alt="character-mining" />
        <GameplayAnimation tool={tool} />
      </div>
    </div>
  );
}