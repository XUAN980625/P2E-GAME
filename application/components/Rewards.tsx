import React from "react";
import {
  ThirdwebNftMedia,
  useAddress,
//   useContract,
  useContractRead,
  useMetadata,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { SmartContract, Token } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

import styles from "../styles/Home.module.css";
import ApproxRewards from "./ApproxReward";
import { MINING_CONTRACT_ADDRESS } from "../const/contractAddress";

type Props = {
  miningContract: SmartContract<any>;
  starContract: Token;
};

/**
 * This component shows the:
 * - Metadata of the token itself (mainly care about image)
 * - The amount this wallet holds of this wallet
 * - The amount this user can claim from the mining contract
 */
export default function Rewards({ miningContract, starContract }: Props) {
  const address = useAddress();

  const { data: starMetadata } = useMetadata(starContract) as any;
  const { data: currentBalance } = useTokenBalance(starContract, address);
  
  const { data: unclaimedAmount } = useContractRead(
    miningContract,
    "calculateRewards",
    [address]
  );
//   const { mutate : claim } = useContractRead (miningContract,"claim");

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <p>
        目前持有的 <b>Wendy Stars</b>
      </p>

      {starMetadata && (<ThirdwebNftMedia metadata={starMetadata} height={"48"} /> )} 
      
      <p className={styles.noGapBottom}>
        餘額: <b>{currentBalance?.displayValue}</b>
      </p>
      
      <p>
        還在天上的星星:{" "}
        <b>{unclaimedAmount && ethers.utils.formatUnits(unclaimedAmount)}</b>
      </p>

      <ApproxRewards miningContract={miningContract} />

      <div className={styles.smallMargin}>
        
        <Web3Button
          contractAddress={MINING_CONTRACT_ADDRESS}
          action={(contract) => contract.call("claim")}
        >
          搜集星星
        </Web3Button>

      </div>
    </div>
  );
}