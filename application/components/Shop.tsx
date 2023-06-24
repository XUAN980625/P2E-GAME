import { useNFTs } from "@thirdweb-dev/react";
import { EditionDrop } from "@thirdweb-dev/sdk";
import React from "react";
import styles from "../styles/Home.module.css";
import ShopItem from "./ShopItem";

type Props = {
  toolContract: EditionDrop;
};

/**
 * This component shows the:
 * - All of the available pickaxes from the edition drop and their price.
 */
export default function Shop({ toolContract }: Props) {
  const { data: availableTools } = useNFTs(toolContract);

  return (
    <>
      <div className={styles.nftBoxGrid}>
        {availableTools?.map((p) => (
          <ShopItem
            toolContract={toolContract}
            item={p}
            key={p.metadata.id.toString()}
          />
        ))}
      </div>
    </>
  );
}