// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import "hardhat-dependency-compiler"; // <- Add this
// import * as dotenv from "dotenv";
// import { resolve } from "path";

// dotenv.config({ path: resolve(__dirname, ".env") });

// const config: HardhatUserConfig = {
//   solidity: "0.8.28",
//   networks: {
//     sepolia: {
//       url: process.env.SEPOLIA_RPC_URL,
//       accounts: [`0x${process.env.PRIVATE_KEY}`],
//     },
//   },
//   dependencyCompiler: {
//     paths: [
//       "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol",
//       "@openzeppelin/contracts/access/Ownable.sol",
//       "@openzeppelin/contracts/utils/Counters.sol", // <-- add this
//     ],
//   },
// };

// export default config;


import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler"; // <- Add this
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, ".env") });

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  dependencyCompiler: {
    paths: [
      "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol",
      "@openzeppelin/contracts/access/Ownable.sol",
      "@openzeppelin/contracts/utils/Counters.sol", // <-- add this
    ],
  },
};

export default config;

