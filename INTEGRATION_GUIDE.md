
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
In simpler terms, it verifies that the user is the valid ticket holder. The result can be verified by a third party 
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
2. Javascript UMD bundle integration in pure HTML & Javascript

[TODO: Instructions to run examples here]


## Server verification

The attestation can be verified in two ways:

1. Use our attestation verification API service by sending a HTTP post request with the attestation:

2. Implement your own verification using our NPM or Java attestation packages

[Instructions to run examples with local server here]


## Solidity Verification

[TODO: Add solidity examples]


# Configure for production

You may have noticed that the tokenConfig.json file is used to configure an off-chain token you can test these examples with. 
Closer to the Devcon date, we will provide a production config that you can use to recognize Devcon6 tickets.