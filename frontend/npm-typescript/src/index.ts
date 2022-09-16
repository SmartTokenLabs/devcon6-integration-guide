import {NegotiationInterface, OffChainTokenConfig} from "@tokenscript/token-negotiator/dist/client/interface";
import { Client } from '@tokenscript/token-negotiator';
import "@tokenscript/token-negotiator/dist/theme/style.css";

import config from './../../../tokenConfig.json';

const devconConfig = config as OffChainTokenConfig;

declare global {
    interface Window {
		authenticateToken?: (elem: HTMLButtonElement) => void
    }
}

const negotiatorConfig: NegotiationInterface = {
	type: 'active',
	issuers: [
		devconConfig
	],
	uiOptions: {
		openingHeading: "Open a new world of perks available with your Devcon Ticket",
		issuerHeading: "Your Tickets",
		repeatAction: "try again",
		theme: "light",
		position: "bottom-right"
	},
	safeConnectOptions: {
		url: "https://safeconnect.tokenscript.org",
		initialProof: false
	}
}

// Uncomment for passive negotiation (no popup UI)
// negotiatorConfig.type = "passive";

const negotiator = new Client(negotiatorConfig);

var curTokens: {[key: string]: {tokens: any[]}} = {};

function renderTokens(){

	let tokensCtn = document.getElementById("ticketList");

	let html = "";

	for (let issuer in curTokens){

		for (let i=0; i < curTokens[issuer].tokens.length; i++){

			let token = curTokens[issuer].tokens[i];

			html += `
                <div class="ticketContainer">
                  <div class="ticketDetails">
                    <h5 class="ticketClass">
                      ${token.ticketClass}
                    </h5>
                    <p class="ticketId">
                      ${token.ticketId}
                    </p class="ticketId">
                    <p class="devconId">
                      Devcon ID: ${token.devconId}
                    </p>
                    <button class="authButton" onclick="authenticateToken(this);" data-issuer="${issuer}" data-index="${i}">Authenticate</button>
                  </div>
                  <img alt="ticket-logo" class="ticketImg" src="ticket_example_image.svg"/>
                </div>
            `;
		}
	}

	tokensCtn.innerHTML = html;
}

// TODO: Replace any with actual type
negotiator.on("tokens-selected", (tokens:any) => {
	curTokens = tokens.selectedTokens;
	renderTokens();
});

// TODO: Replace any with actual type
negotiator.on("tokens", (tokens:any) => {
	curTokens = tokens;
	renderTokens();
});

// TODO: Replace any with actual type
negotiator.on("token-proof", async (authRes: any) => {

	console.log(authRes);

	if (authRes.error){
		alert("Attestation validation failed: " + authRes.error);
		return;
	}

	try {

		const data = {
			useTicket: authRes.data.proof,
			address: authRes.data?.useEthKey?.address ?? ""
		};

		console.log(data);

		const res = await fetch("http://localhost:8089/validate-attestation", {
			method: "POST",
			headers: [
				["Content-Type", "application/json"]
			],
			body: JSON.stringify(data)
		})

		if (res.status !== 200) {
			let data = await res.json();
			alert("Attestation server validation failed: " + data.message);
			return;
		}

		alert("Attestation server validation successful");

	} catch (e){
		alert("Attestation server validation failed: " + e.message);
	}

});

window.authenticateToken = (elem) => {

	let issuer = elem.dataset.issuer;
	let index = parseInt(elem.dataset.index);

	// authenticate ownership of token
	negotiator.authenticate({
		issuer: issuer,
		unsignedToken: curTokens[issuer].tokens[index]
	});
};

// Invoke token discovery
negotiator.negotiate();
