const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
// const { google } = require('googleapis');

require('dotenv').config({ path: '.env' }); 

const app = express();
const port = process.env.PORT;

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = '/';
// const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN';

// const auth = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );
// const sheets = google.sheets({ version: 'v4', auth });

app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: './'});
});

app.post('/new-member', (req, res) => {
	console.log(req.body);
	const output = `
		<h3>New Membership Request</h3>
		<p>Email: ${req.body.email}<br/></p>
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

	res.send({msg: 'success'});
});

// app.post('/new-member-row', async (req, res) => {
// 	try {
// 		const { email } = req.body;
// 		const response = await sheets.spreadsheets.values.append({
//       spreadsheetId: '1fbb04xkI0LN4t6ELU3LzR4A43UNj92ErmlXJ8oaAEkM',
//       range: 'Sheet1!A',
//       valueInputOption: 'RAW',
//       requestBody: {
//         values: [[email]],
//       },
//     });
// 	} catch (err) {
// 		console.log(err);
// 	}
// })



app.listen(port, () => console.log('listening on 4400'));