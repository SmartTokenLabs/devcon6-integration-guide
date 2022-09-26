import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
	networks: {
	  hardhat: {
		  allowUnlimitedContractSize: true,
		  forking: {
			  url: "https://eth-goerli.alchemyapi.io/v2/9jRnyHMPq41aZ-TXD4jIXEkZFBUa4J0r"
		  }
	  }
	}
};

export default config;
