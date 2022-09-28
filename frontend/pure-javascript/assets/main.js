
const devconConfig = {
	"collectionID": "devcon",
	"onChain": false,
	"title": "Devcon Test Ticket",
	"image": "https://raw.githubusercontent.com/TokenScript/token-negotiator/main/mock-images/devcon.svg",
	"tokenOrigin": "https://stltesting.tk/token-outlet/",
	"attestationOrigin": "https://test.attestation.id/",
	"unEndPoint": "https://attestation-verify.tokenscript.org/un",
	"base64senderPublicKeys": {
		"6": "MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////////////////////////////////////v///C8wRAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBEEEeb5mfvncu6xVoGKVzocLBwKb/NstzijZWfKBWxb4F5hIOtp3JqPEZV2k+/wOEQio/Re0SKaFVBmcR9CP+xDUuAIhAP////////////////////66rtzmr0igO7/SXozQNkFBAgEBA0IABGMxHraqggr2keTXszIcchTjYjH5WXpDaBOYgXva82mKcGnKgGRORXSmcjWN2suUCMkLQj3UNlZCFWF10wIrrlw=",
		"55":"MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEAGJAHCiHbrCNAY9fAMdom4dGD6v/KkTIgRCkwLCjXFTkXWGrCEXHaZ8kWwdqlu0oYCrNQ2vdlqOl0s26/LzO8A=="
	},
	"base64attestorPubKey": "MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////////////////////////////////////v///C8wRAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBEEEeb5mfvncu6xVoGKVzocLBwKb/NstzijZWfKBWxb4F5hIOtp3JqPEZV2k+/wOEQio/Re0SKaFVBmcR9CP+xDUuAIhAP////////////////////66rtzmr0igO7/SXozQNkFBAgEBA0IABL+y43T1OJFScEep69/yTqpqnV/jzONz9Sp4TEHyAJ7IPN9+GHweCX1hT4OFxt152sBN3jJc1s0Ymzd8pNGZNoQ="
};

const negotiatorConfig = {
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

const negotiator = new window.negotiator.Client(negotiatorConfig);

var curTokens = {};

function renderTokens(){

	let tokensCtn = document.getElementById("ticketList");

	let html = "";

	for (let issuer in curTokens){

		for (let i=0; i < curTokens[issuer].tokens.length; i++){

			let token = curTokens[issuer].tokens[i];

			console.log(token);

			html += `
                <div class="ticketContainer">
                  <div class="ticketDetails">
                    <h5 class="ticketClass">
                      ${token.ticketClass}
                    </h5>
                    <p class="ticketId">
                      ${token.ticketIdNumber ?? token.ticketId ?? token.ticketIdNumber}
                    </p class="ticketId">
                    <p class="devconId">
                      Devcon ID: ${token.devconId}
                    </p>
                    <button class="authButton" onclick="authenticateToken(this);" data-issuer="${issuer}" data-index="${i}">Authenticate</button>
                  </div>
                  <img alt="ticket-logo" class="ticketImg" src="assets/ticket_example_image.svg"/>
                </div>
            `;
		}
	}

	tokensCtn.innerHTML = html;
}

negotiator.on("tokens-selected", (tokens) => {
	curTokens = tokens.selectedTokens;
	renderTokens();
});

negotiator.on("tokens", (tokens) => {
	curTokens = tokens;
	renderTokens();
});

negotiator.on("token-proof", async (authRes) => {

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

		const res = await fetch("http://localhost:8089/verify-attestation", {
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