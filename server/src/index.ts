import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {Authenticator} from "@tokenscript/attestation/dist/Authenticator";
import devconConfig from "../../tokenConfig.json";

globalThis.window = {};

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 8089;

app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");

	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);

	next();
});

app.post('/validate-attestation', (req: Request, res: Response) => {

	const body = req.body;

	if (
		!body ||
		!body.useTicket ||
		//!body.attestor ||
		//!body.issuers ||
		!body.address
	) {
		res.status(400).json({
			success: false,
			message: "Missing parameters",
		});
		return;
	}

	try {
		const attestedObject = Authenticator.validateUseTicket(
			body.useTicket,
			devconConfig.base64attestorPubKey,
			devconConfig.base64senderPublicKeys,
			body.address
		);

		// Do something with the ticket details
		//console.log(attestedObject);

		console.log("Ethereum address: " + attestedObject.getAtt().getUnsignedAttestation().getAddress());

		console.log("Ticket details: ");
		console.log("Ticket ID: " + attestedObject.getAttestableObject().ticketId);
		console.log("Class: " + attestedObject.getAttestableObject().ticketClass);
		console.log("Decon ID: " + attestedObject.getAttestableObject().devconId);

		res.json({
			success: true,
			message: "Attestation object is valid",
		});
	} catch (e) {
		console.log("validateUseTicket error", e.message);
		//console.error(e);
		res.status(400).json({
			success: false,
			message: e.message,
		});
	}
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});