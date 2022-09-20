import {ethers} from "hardhat";

async function main() {

	const attestorKeyAddress = '0x5f7bFe752Ac1a45F67497d9dCDD9BbDA50A83955';
	const issuerKeyAddress = '0xbf9Ae773d7D724b9632564fbE2c782Cc2Ed8817c';

	const AttestationNFT = await ethers.getContractFactory("AttestationNFT");
	const attestationNFT = await AttestationNFT.deploy(attestorKeyAddress, issuerKeyAddress);

	await attestationNFT.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
