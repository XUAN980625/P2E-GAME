// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

// Import thirdweb contracts
import "../node_modules/@thirdweb-dev/contracts/drop/DropERC1155.sol"; // For TOOLs
import "../node_modules/@thirdweb-dev/contracts/token/TokenERC20.sol"; // For WENDY STARs
import "../node_modules/@thirdweb-dev/contracts/openzeppelin-presets/utils/ERC1155/ERC1155Holder.sol";
import "../node_modules/@thirdweb-dev/contracts/openzeppelin-presets/security/ReentrancyGuard.sol";

contract Mining is ReentrancyGuard, ERC1155Holder {
    // 儲存先前佈署的合約 (工具Edition Drop 和 WENDY STAR 的Token)
    DropERC1155 public immutable toolNftCollection;
    TokenERC20 public immutable rewardsToken;

    // 設定遊戲獎勵的 WENDY STAR token 和 TOOL NFT合約地址
    constructor( DropERC1155 toolContractAddress, TokenERC20 gemsContractAddress) {
        toolNftCollection = toolContractAddress;
        rewardsToken = gemsContractAddress;
    }

    struct MapValue {
        bool isData;
        uint256 value;
    }

    // Mapping of player addresses to their current tool
    // By default, player has no tool. They will not be in the mapping.
    // Mapping of address to tool is not set until they stake a one.
    // In this example, the tokenId of the tool is the multiplier for the reward.
    mapping(address => MapValue) public playertool;

    // Mapping of player address until last time they staked/withdrew/claimed their rewards
    // By default, player has no last time. They will not be in the mapping.
    mapping(address => MapValue) public playerLastUpdate;

    function stake(uint256 _tokenId) external nonReentrant {
        // Ensure the player has at least 1 of the token they are trying to stake
        require(
            toolNftCollection.balanceOf(msg.sender, _tokenId) >= 1,
            "You must have at least 1 of the tool you are trying to stake"
        );

        // If they have a tool already, send it back to them.
        if (playertool[msg.sender].isData) {
            // Transfer using safeTransfer
            toolNftCollection.safeTransferFrom(address(this),msg.sender,playertool[msg.sender].value,1,"Returning your old tool");
        }

        // Calculate the rewards they are owed, and pay them out.
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // Transfer the tool to the contract
        toolNftCollection.safeTransferFrom(msg.sender,address(this),_tokenId,1,"Staking your tool");

        // Update the playertool mapping
        playertool[msg.sender].value = _tokenId;
        playertool[msg.sender].isData = true;

        // Update the playerLastUpdate mapping
        playerLastUpdate[msg.sender].isData = true;
        playerLastUpdate[msg.sender].value = block.timestamp;

    }

    function withdraw() external nonReentrant {
        // Ensure the player has a tool
        require(playertool[msg.sender].isData, "You do not have a tool to withdraw.");

        // Calculate the rewards they are owed, and pay them out.
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // Send the tool back to the player
        toolNftCollection.safeTransferFrom(address(this), msg.sender,playertool[msg.sender].value, 1,"Returning your old tool");

        // Update the playertool mapping
        playertool[msg.sender].isData = false;

        // Update the playerLastUpdate mapping
        playerLastUpdate[msg.sender].isData = true;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }

    //支付玩家獎勵
    function claim() external nonReentrant {
        // Calculate the rewards they are owed, and pay them out.
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // Update the playerLastUpdate mapping
        playerLastUpdate[msg.sender].isData = true;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }

    // ===== Internal ===== \\

    // 計算玩家的獎勵
    // Calculate the rewards the player is owed since last time they were paid out
    // Rewards rate is 20,000,000 per block.
    // This is calculated using block.timestamp and the playerLastUpdate.
    // If playerLastUpdate or playertool is not set, then the player has no rewards.
    function calculateRewards(address _player)
        public
        view
        returns (uint256 _rewards)
    {
        // If playerLastUpdate or playertool is not set, then the player has no rewards.
        if (!playerLastUpdate[_player].isData || !playertool[_player].isData) {
            return 0;
        }

        
        // Calculate the time difference between now and the last time they staked/withdrew/claimed their rewards
        uint256 timeDifference = block.timestamp - playerLastUpdate[_player].value;

        // Calculate the rewards they are owed
        uint256 rewards = timeDifference * 10_000_000_000_000 * (playertool[_player].value + 1);

        // Return the rewards
        return rewards;
    }

}