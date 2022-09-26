/* Attestation decode and validation */
/* AlphaWallet 2021 - 2022 */
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./library/VerifyAttestation.sol";

contract AttestationNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, AccessControl, VerifyAttestation {

	using Counters for Counters.Counter;

	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
	Counters.Counter private _tokenIdCounter;

	string _contractURI;

	address _attestorKey;
	address _issuerKey;

	constructor(address attestorKey, address issuerKey) ERC721("Attestation BAYC", "ATTBAYC") {
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_contractURI = "https://gateway.pinata.cloud/ipfs/QmY78Nw83Y3TTmKqzhmREgzMNuRuwMyawYMxKUdo7R7xXJ/bayc.json";
		_attestorKey = attestorKey;
		_issuerKey = issuerKey;
		_tokenIdCounter._value = 1;
	}

	function contractURI() public view returns (string memory) {
		return _contractURI;
	}

	function setContractURI(string memory uri) public onlyRole(DEFAULT_ADMIN_ROLE) {
		_contractURI = uri;
	}

	function updateAttestationKeys(address newattestorKey, address newIssuerKey) public onlyRole(DEFAULT_ADMIN_ROLE) {
		_attestorKey = newattestorKey;
		_issuerKey = newIssuerKey;
	}

	function mint(string memory uri) public onlyRole(MINTER_ROLE) {
		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(msg.sender, tokenId);
		_setTokenURI(tokenId, uri);
	}

	function mintUsingAttestation(bytes memory attestation) public returns (uint256 tokenId) {

		address subject;
		bytes memory tokenBytes;
		bytes memory conferenceBytes;
		bool timeStampValid;

		(subject, tokenBytes, conferenceBytes, timeStampValid) = verifyTicketAttestation(attestation, _attestorKey, _issuerKey);
		tokenId = bytesToUint(tokenBytes);

		//Use the following line if conferenceId is in use
		//require(subject != address(0) && tokenId != 0 && timeStampValid && compareStrings(conferenceBytes, _conference_id), "Attestation not valid");
		require(subject != address(0) && tokenId != 0 && timeStampValid, "Attestation not valid");
		require(tokenBytes.length < 33, "TokenID overflow");

		// Token ID can be based on the ID of the ticket attestation or a tokenId that you generate.
		//tokenId = _tokenIdCounter.current();
		//_tokenIdCounter.increment();

		_safeMint(msg.sender, tokenId);
		_setTokenURI(tokenId, "https://gateway.pinata.cloud/ipfs/QmXdnWNa2CaRCUa4jMTirmkVJkygr2LtnccSuDY3yXrvVm/bayc_1013.json");
	}

	function _beforeTokenTransfer(address from, address to, uint256 tokenId)
	internal
	override(ERC721, ERC721Enumerable)
	{
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}

	function tokenURI(uint256 tokenId) public view

	override(ERC721, ERC721URIStorage)
	returns (string memory)
	{
		return super.tokenURI(tokenId);
	}

	function supportsInterface(bytes4 interfaceId) public view

	override(ERC721, ERC721Enumerable, AccessControl)
	returns (bool)
	{
	return super.supportsInterface(interfaceId);
	}
}