import {
    ThirdwebNftMedia,
    useActiveClaimCondition,
    // useAddress,
    // useClaimNFT,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { EditionDrop, NFT } from "@thirdweb-dev/sdk";
  import { 
	// BigNumber, 
	ethers 
	} from "ethers";
  import React from "react";
  import { TOOLS_ADDRESS } from "../const/contractAddress";
  import styles from "../styles/Home.module.css";
  
  type Props = {
    toolContract: EditionDrop;
    item: NFT;
  };
  
  export default function ShopItem({ item, toolContract }: Props) {
    const { data: claimCondition } = useActiveClaimCondition(
      toolContract,
      item.metadata.id
    );

    // const {mutate : claimNFT } = useClaimNFT(toolContract);
    // const address = useAddress();
    // async function buy (id:String) {
    //     if(!address)return ;

    //     try{
    //         useClaimNFT({
    //             to :address,
    //             token: id,
    //             quantity : 1,
    //         });
    //     }catch(e){
    //         console.error(e);
    //         alert("你是不是沒錢?")
    //     }
    // }
  
    return (
      <div className={styles.nftBox} key={item.metadata.id.toString()}>
        <ThirdwebNftMedia
          metadata={item.metadata}
          className={`${styles.nftMedia} ${styles.spacerTop}`}
          height={"150px"}
        />
        <h3>{item.metadata.name}</h3>
        <p>
          售價:{" "}
          <b>
            {claimCondition && ethers.utils.formatUnits(claimCondition?.price)}{" "}
            STAR
          </b>
        </p>
  
        <div className={styles.smallMargin}>
          <Web3Button
            // colorMode="dark"
            contractAddress={TOOLS_ADDRESS}
            action={(contract) => contract.erc1155.claim(item.metadata.id, 1)}
            onSuccess={() => alert("Purchased!")}
            onError={(error) => alert(error)}
          >
            買一個
          </Web3Button>
        </div>
      </div>
    );
  }