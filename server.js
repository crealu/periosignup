const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { google } = require('googleapis');

require('dotenv').config({ path: '.env' }); 

const app = express();
const port = process.env.PORT;

const credentials = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
};

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const sheetId = process.env.GOOGLE_SHEET_ID

app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: './'});
});

app.post('/new-member', async (req, res) => {
	const { email } = req.body;

	try {
		const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [[email]] },
    });

  	const output = `
			<h3>New Membership Request</h3>
			<p>Email: ${email}<br/></p>
		`;

		let transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: process.env.THE_EMAIL,
				pass: process.env.THE_KEY
			}
		});

		let mailOptions = {
	    from: 'Niheigo Support <niheigodev@site.com>',
	    to: 'niheigodev@gmail.com',
			subject: 'Membership Request',
			text: 'text',
			html: output
		};

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) { return console.log(err) }
			console.log(info);
		});
    res.status(200).send({msg: 'Your submission was successful. Thank you!'});
	} catch (err) {
		console.error(err);
		res.status(200).send({msg: "We apologize. Your request could not be processed"});
	}
});

app.listen(port, () => console.log('listening on 4400'));