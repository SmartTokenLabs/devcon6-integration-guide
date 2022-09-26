
# Technology Overview

## Ticket & Identifier attestations

Devcon6 permissionless perks builds on top of several key technologies developed by Smart Token Labs. 
At it’s core, it utilizes ticket attestations. These are cryptographically signed tickets issued by Devcon. 
A ticket attestation is issued towards a specific personal identifier like an email address or twitter handle, 
and is usually delivered to the user through a magic link. In the case of Devcon, clicking the magic link will take 
you to the DevCon6 magic link site, where your ticket is saved in local storage and can be used to access 
NFT minting & a list of permissionless perks.

You can think of a ticket attestation as an off-chain token that is bound to your identity and contains metadata 
about the token.

Each ticket is uniquely identifiable via a ticket & conference ID, but third parties cannot learn the personal 
identifier used in the ticket. Instead, our identifier attestation service [Attestation.id](https://attestation.id) 
and some cryptographic magic is used by the user to prove:

1. They have a valid ticket
2. They own the email address (or other identifier) that was issued the ticket


## Verifying Ownership

During the verification process, if an identifier attestation isn’t generated yet, the user will be redirected to 
Attestation.id to confirm their email address & create one. Once the attestation is issued, it is used together with 
the ticket to produce a ZK proof that the ticket & identifier attestations are issued towards the same identifier. 
In simpler terms, it verifies that the user is the valid ticket holder. The result can be verified by a third party (you) 
through the use of a smart contract or server. Like the ticket, the identifier attestation is stored in local storage 
and expires after a week. Users will only need to perform this step once a week unless they move to a new browser or 
device. 


# Integration Guide

Integration with permissionless perks is a two step process. On the front-end, tickets are discovered from Devcon and the attestation is generated through the process explained above. On the back-end or in a smart contract, the following are checked to validate the ticket:

1. Ticket issuer public key is used to validate the ticket.
2. [Attestation.id](http://Attestation.id) public key is used to validate the identifier attestation.
3. The ZK proof is verified to ensure the user is the valid ticket holder.

Okay so now that your familiar with the process let’s get started with the integration.


## Front-end Integration

Token negotiator is part of STL’s Brand Connector product suite and can be used to discover & verify both on and off 
chain tokens. On the front end we will be using token-negotiator to discover tickets and orchestrate the verification 
process.

To get you up and running fast, we have provided 2 examples of Token Negotiator integration in this repo:

1. npm integration into a TypeScript project.
2. Javascript UMD bundle integration in pure HTML & Javascript.

### Running the examples

To run the TypeScript example:
```shell
$ cd frontend/npm-typescript
npm-typescript$ npm i
npm-typescript$ npm run start
```

To run the UMD example, serve the files inside the frontend/pure-javascript folder from your 
preferred webserver and open it in your browser. If you don't have a preferred webserver you 
can run it using the http-server NPM package

```shell
$ npx http-server frontend/pure-javascript -p 8085
```

### Integrating using NPM

If you are already using NPM, you can install the token-negotiator module directly with NPM:
```shell
$ npm i @tokenscript/token-negotiator
```

Token negotiator has some dependencies that require node.js polyfills for webpack.
Install the polyfill plugin:
```shell
$ npm i node-polyfill-webpack-plugin
```
And add the plugin to your webpack config:

```js
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
...
module.exports = {
  plugins: 
    ...
    new NodePolyfillPlugin()  
  ]
  ...
}
```

Once you have installed TN, you can use the code at src/index.ts for invoking authentication. 
Copy the code into your own application & modify it as required.

Note: If you are using rollup or create-react-app, we have some examples of how to include polyfills 
over at the [Token Negotiator Examples](https://github.com/TokenScript/token-negotiator-examples) repo.

### Integrating using Javascript bundle

To integrate using the Javascript bundle, simply copy  
frontend/pure-javascript/assets/negotiator into your own project and include the JS & CSS in 
the HTML page or template of your choosing.

```html
<script src="assets/negotiator/negotiator.js"></script>
<link rel="stylesheet" href="assets/negotiator/theme/style.css">
```

TN will now be accessible via window.negotiator. Copy the code at assets/main.js and modify it 
as necessary for your application.

## Server verification

The attestation can be verified in two ways:

1. Use our attestation verification API service by sending a HTTP post request with the attestation:

[TODO: Example of using our crypto verify service]

2. Implement your own verification using our NPM or Java attestation libraries

### Integrate via your own node.js service

You can install our JS attestation library to an existing project via NPM:

```shell
$ npm i @tokenscript/attestation
```

Once you have installed the library, see server/src/index.ts for an example of verification

#### Running the server example

To run the server example, use the following commands:

```shell
$ cd server
npm-typescript$ npm i
npm-typescript$ npm run start
```

The server will run on port 8089, but this can be overridden using the PORT environment variable. 

### Integrate via your own Java service

[TODO: Instructions to install attestation.jar & code snippet for verifying attestation]

## Solidity Verification

The ethereum folder in this Repo has an example of validation in Solidity. The example allows minting an NFT using a ticket attestation.
Token ID can be based on the ID of the ticket attestation (to limit minting to 1 per ticket) or a tokenId that you generate.

```shell
$ npm i
$ npm run test
```

To use ticket validation in your own contract, copy the VerifyAttestation.sol library to your project.

# Configure for production

You may have noticed that the tokenConfig.json file is used to configure an off-chain token you can test these examples with. 
Closer to the Devcon date, we will provide a production config that you can use to recognize Devcon6 tickets.