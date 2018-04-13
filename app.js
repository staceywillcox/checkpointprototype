const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//View Engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.render('contact');

});

app.post('/send', (req, res) =>{
	const output = ` 
	<p>You have a new contact request</p>
	<h3> contact details</h3>
	<ul>
		<li>Name:${req.body.name}</li>
		<li>Company:${req.body.company}</li>
		<li>Email:${req.body.email}</li>
		<li>Phone:${req.body.phone}</li>

		</ul>
		<h3>Message</h3>
		<p>Message:${req.body.message}</p>
	`;


var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'checkpointapp@outlook.com',
        pass: 'vicdsdn352'
    }
});

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Checkpoint" <checkpointapp@outlook.com>', // sender address
        to: 'kiwimade.sw@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg:'Email has been sent'})
     });
});


app.listen(3000, () => console.log('Server Started...'));