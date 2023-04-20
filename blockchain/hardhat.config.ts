require('dotenv').config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    bscTestnet: {
			url: "https://data-seed-prebsc-1-s3.binance.org:8545/",
			accounts: [process.env.DEPLOY_ACCOUNT!],
			chainId: 97,
		},
    polygonMumbai: {
			url: "https://matic-mumbai.chainstacklabs.com",
			accounts: [process.env.DEPLOY_ACCOUNT!],
			chainId: 80001,
		},
    goerli: {
      url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: [process.env.DEPLOY_ACCOUNT!],
      chainId: 5
    }
  },
  etherscan: {
    apiKey: {
			polygonMumbai: process.env.POLYGON_API_KEY!,
			bscTestnet: process.env.BINANCE_API_KEY!,
      goerli: process.env.GOERLI_API_KEY!
		},
  },
  paths: {
		sources: "./contracts",
		tests: "./test",
		cache: "./cache",
		artifacts: "./artifacts",
	},
};

export default config;