
const devconConfig = {
	"collectionID": "devcon-test",
	"onChain": false,
	"title": "Devcon Test Ticket",
	"image": "https://raw.githubusercontent.com/TokenScript/token-negotiator/main/mock-images/devcon.svg",
	"tokenOrigin": "https://tokenscript.github.io/token-negotiator-examples/token-outlet-website/",
	"attestationOrigin": "https://attestation.id/",
	"base64senderPublicKeys": {
		"6": "MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////////////////////////////////////v///C8wRAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBEEEeb5mfvncu6xVoGKVzocLBwKb/NstzijZWfKBWxb4F5hIOtp3JqPEZV2k+/wOEQio/Re0SKaFVBmcR9CP+xDUuAIhAP////////////////////66rtzmr0igO7/SXozQNkFBAgEBA0IABGMxHraqggr2keTXszIcchTjYjH5WXpDaBOYgXva82mKcGnKgGRORXSmcjWN2suUCMkLQj3UNlZCFWF10wIrrlw="
	},
	"base64attestorPubKey": "MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////////////////////////////////////v///C8wRAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBEEEeb5mfvncu6xVoGKVzocLBwKb/NstzijZWfKBWxb4F5hIOtp3JqPEZV2k+/wOEQio/Re0SKaFVBmcR9CP+xDUuAIhAP////////////////////66rtzmr0igO7/SXozQNkFBAgEBA0IABL+y43T1OJFScEep69/yTqpqnV/jzONz9Sp4TEHyAJ7IPN9+GHweCX1hT4OFxt152sBN3jJc1s0Ymzd8pNGZNoQ="
};

const negotiatorConfig = {
	type: 'active',
	issuers: [
		devconConfig
	],
	uiOptions: {
		openingHeading: "Open a new world of perks available with your Devcon",
		issuerHeading: "Get discount with Ticket",
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
                      ${token.ticketIdNumber ?? token.ticketIdString}
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

negotiator.on("token-proof", (data) => {
	console.log(data);
	// TODO: Post to verification service
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