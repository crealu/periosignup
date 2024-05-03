const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env' });

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('');
});

app.post('/new-member', (req, res) => {
	console.log(req.body);
	const output = `
		<h3>New Membership Request</h3>
		<p>Email: ${req.body.email}<br/></p>
	`;
	
	let smtpConfig = {
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.THE_EMAIL,
			pass: process.env.THE_KEY
		}
	}

	let transporter = nodemailer.createTransport(smtpConfig);

	let mailOptions = {
		from: 'Email <email@site.com>',
		to: 'email@gmail.com',
		subject: 'Membership Request',
		text: 'text',
		html: output
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) { return console.log(err) }
		console.log(info);
	});

	res.send('success');
})

app.listen(port, () => console.log('listening on 4400'));