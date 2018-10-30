var express = require('express');
var router = express.Router();
var colors = require('colors');



let wls = require("wlsjs");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

var app = express();
const test = require('../routes/test');
let notifications = [];






// Get Homepage
router.get('/', function(req, res){


		res.render('index', {notifications: notifications});
		console.log("\nHello @".gray.bold + process.env.witnessUsername.blue.bold + " Welcome to Witness Protection".gray.bold);
});


function readFileWithoutUpdate(){

	mainNotifications = [];
	let fs = require('fs');

let objectData = {Notification:"Missed Block - Switching to Next Node",
									Time:"TEST TIME SLOT",
									Date:"TEST DATE SLOT"};
try {
let rawdata = fs.readFileSync('students.json');
let student = JSON.parse(rawdata);
console.log("Reading object 'Student' now.");
console.log(student);		//[0]
notifications.push(student);
console.log("Pushing to main Notifications");
console.log(notifications);
}
catch(error) {
  // console.error(error);
  // expected output: SyntaxError: unterminated string literal
  // Note - error messages will vary depending on browser
}

console.log("refreshing file data now.");

// writeFile(notifications)


}


function sleep(milliseconds) {
  let start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
		// console.log(new Date().getTime() - start);
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
module.exports = router;
