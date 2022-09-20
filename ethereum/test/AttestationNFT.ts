import {time, loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, Event} from "ethers";

describe("Lock", function () {

	const ticketAttestation = '0x308203603081a3305d0c04c385c3b8020f692a445689ca93d992fd24098b3dc60201000441042162047396b943e288498a9c2dc4a5621c62c792c33781fe34393b8955df9b230f8fd1ff3347f406d8545396018a22da0d23f7845e2ef299b075e1c07226032303420037ea340c4066047ecacfd21e323d5c2c2a710ff0e19a10c55bd49bebb0dad38255b7dde70487292202995a8d67ae57ef240d80fe280ce9d78596d450139828541b3082024c308201f9a003020112020101300906072a8648ce3d0402300e310c300a06035504030c03414c58302e180f32303232303430383036313932305a0204624fd3e8180f32303332303430353036313933355a0204751bd6f7300b3109300706035504030c00308201333081ec06072a8648ce3d02013081e0020101302c06072a8648ce3d0101022100fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f3044042000000000000000000000000000000000000000000000000000000000000000000420000000000000000000000000000000000000000000000000000000000000000704410479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8022100fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd036414102010103420004950c7c0bed23c3cac5cc31bbb9aad9bb5532387882670ac2b1cdf0799ab0ebc764c267f704e8fdda0796ab8397a4d2101024d24c4efff695b3a417f2ed0e48cd300702012a02020539a35730553053060b2b060104018b3a737901280101ff04410415fd25179e47ea9fe36d52332ddcf03f3b5a578d662458d633e90549219c0d4d196698e2e33afe85a8a707cb08fab2ded1514a8639ab87ef6c1c0efc6ebd62b4300906072a8648ce3d04020342009d70ccb81a7747e38aeacc92f99e336bd93f98f246705c0bc668b45152c5aa6c39ba533ea730af3958b5026cfb7afc764ba3aa7aeac5b5b4f9509a80661e029f1b3068042007c1b13004ca0167ec16e390e8b8f1bde3582c2158430063172cf7651ee9345d044104243b4c5d5a18e2b5734953b98051bd8008d424ec043d55cbffea4b1681acfdab25d4027eb1571cd18d77cc468599c4564550643fdc3ef67231e530c2b2702d71040142';

	// We define a fixture to reuse the same setup in every test.
	// We use loadFixture to run this setup once, snapshot that state,
	// and reset Hardhat Network to that snapshot in every test.
	async function attestationNFTFixture() {

		// Contracts are deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();

		const attestorKeyAddress = '0x5f7bFe752Ac1a45F67497d9dCDD9BbDA50A83955';
		const issuerKeyAddress = '0xbf9Ae773d7D724b9632564fbE2c782Cc2Ed8817c';

		const AttestationNFT = await ethers.getContractFactory("AttestationNFT");
		const attestationNFT = await AttestationNFT.deploy(attestorKeyAddress, issuerKeyAddress);

		const nftContract = await attestationNFT.deployed();

		return {nftContract, owner, otherAccount};
	}

	describe("Mint with attestation", function () {

		it("Should succeed", async function () {
			const {nftContract, owner, otherAccount} = await loadFixture(attestationNFTFixture);

			let txReceipt = await nftContract.mintUsingAttestation(ticketAttestation);

			console.log("TX: " + txReceipt.hash);

			const minted = await txReceipt.wait(1);

			let transferEvent = minted.events?.filter((x: Event) => {return x.event == "Transfer"});

			let args = transferEvent[0].args;
			var tokenIdBN : BigNumber;
			if (args){
				tokenIdBN = BigNumber.from(args.tokenId);
			}
			else {
				tokenIdBN = BigNumber.from(0);
			}

			console.log("TokenID: " + tokenIdBN);
		});

	});

});
