import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      // Local network settings
    },
  },
  dependencyCompiler: {
    paths: [
      "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol",
      "@openzeppelin/contracts/access/Ownable.sol",
      "@openzeppelin/contracts/utils/Counters.sol",
    ],
  },
};

export default config;

