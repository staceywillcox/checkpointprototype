// const express = require('express');
// const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');
// const path = require('path');
// const nodemailer = require('nodemailer');
// const app = express();


// //View Engine setup
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

// //Static folder
// app.use('/public', express.static(path.join(__dirname, 'public')));

// //Body Parser Middleware
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());


// app.get('/', (req, res) => {
// 	res.render('contact');

// });

// app.post('/send', (req, res) =>{
// 	const output = ` 
// 	<p>This is an automated alert message from Checkpoint. ${req.body.name} is currently on the ${req.body.track}. Their estimated time of arrival was ${req.body.end}, it is now ${req.body.messagetime} later and they have not checked in on our app. If possible, please make contact with ${req.body.name}, otherwise alert the emergency services.</p>
// 	`;


// var transporter = nodemailer.createTransport({
//     service: 'outlook',
//     auth: {
//         user: 'checkpointapp@outlook.com',
//         pass: 'vicdsdn352'
//     }
// });

//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"Checkpoint" <checkpointapp@outlook.com>', // sender address
//         to: 'kiwimade.sw@gmail.com', // list of receivers
//         subject: 'Checkpoint App Alert', // Subject line
//         text: '', // plain text body
//         html: output // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         res.render('contact', {msg:'Email has been sent'})
//      });
// });


// app.listen(3000, () => console.log('Server Started...'));

// console.log('hi') 



