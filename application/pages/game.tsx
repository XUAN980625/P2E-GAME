import {
    ConnectWallet,
    useAddress,
    useContract,
    useMetamask,
  } from "@thirdweb-dev/react";
  import React from "react";
  import CurrentGear from "../components/CurrentGear";
  import Loading from "../components/Loading";
  import OwnedGear from "../components/OwnedGear";
  import Rewards from "../components/Rewards";
  import Shop from "../components/Shop";
  import {
    CHARACTER_ADDRESS,
    WENDY_STAR_ADDRESS,
    MINING_CONTRACT_ADDRESS,
    TOOLS_ADDRESS,
  } from "../const/contractAddress";
  import styles from "../styles/Gameplay.module.css";
  
  
  export default function Play() {
    
    const address = useAddress();
  
    const { contract: miningContract } = useContract(MINING_CONTRACT_ADDRESS);
    const { contract: characterContract } = useContract(
      CHARACTER_ADDRESS,
      "edition-drop"
    );
    const { contract: toolContract } = useContract(
        TOOLS_ADDRESS,
      "edition-drop"
    );
    const { contract: starContract } = useContract(
        WENDY_STAR_ADDRESS,
        "token"
    );
  
    if (!address) {
      return (
        <div className={styles.container}>
          <ConnectWallet />
        </div>
      );
    }
  
    return (
      <div className={styles.container}>
        {miningContract &&
        characterContract &&
        starContract &&
        toolContract ? (
          <div className={styles.mainSection}>
            <CurrentGear
              miningContract={miningContract}
              characterContract={characterContract}
              toolContract={toolContract}
            />
            <Rewards
              miningContract={miningContract}
              starContract={starContract}
            />
          </div>
        ) : (
          <Loading />
        )}
  
        <hr className={`${styles.divider} ${styles.bigSpacerTop}`} />
  
        {toolContract && miningContract ? (
          <>
            <h2 className={`${styles.noGapTop} ${styles.noGapBottom}`}>
              你擁有的裝備 : 
            </h2>
            <div
              style={{
                width: "100%",  minHeight: "10rem",
                display: "flex",flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OwnedGear
                toolContract={toolContract}
                miningContract={miningContract}
              />
            </div>
          </>
        ) : (
          <Loading />
        )}
  
        <hr className={`${styles.divider} ${styles.bigSpacerTop}`} />
  
        {toolContract && starContract ? (
          <>
            <h2 className={`${styles.noGapTop} ${styles.noGapBottom}`}>用星星購買更好的工具 : </h2>
            <div
              style={{
                width: "100%",  
                minHeight: "10rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 8,
                marginLeft: 20,
              }}
            >
              <Shop toolContract={toolContract} />
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    );
  }