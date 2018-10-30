var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
let wls = require("wlsjs");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');


let isRunning = false;

let notifications = [];


// Load environment variables from .env file
require('dotenv').load();

let thresh = 0;

/*
Thoughts on representing chain data with variables.
1. It should always be made obvious what chain we are working on.
2. Vars should default to WLS.
3. No more comments. I like this idea.
*/
// wls.api.setOptions({ url: 'ws://188.166.99.136:8090' });
// wls.config.set('address_prefix', 'WLS');
// wls.config.set('chain_id', 'de999ada2ff7ed3d3d580381f229b40b5a0261aec48eb830e540080817b72866');


/*
Post Req/Resp for Main Process.
*/
router.post('/run', function(req, res){

	return res.redirect('/test/running')
});

/*
Get Req/Resp for Main Process.
*/
router.get('/running', function(req, res){
	console.log("Witness Protection Engaged ---- ".yellow.bold+"@".blue.bold + process.env.witnessUsername.blue.bold);

/*
Check if Process is already running. If so - Break.
*/

/*
		@var:		witness_name  					> Contains the name of the witness we are watching.
		@var:		receiver 								> Contains Email adress of the account at which you wish to receive notifications.
		@var:		active_key 							>
		@var:		backup_key																																							/////////////////////// change this variable.
		@var:		mainBrain_key						> Contains Public Brain Key, 'pub-key' of the main node you run your witness on.
		@var:		witness_link						> Contains the link that you wish to post during your witness update.
		@var:		account_creation_fee    > Contains the current Account Creation Fee, which can be found at,  						FIX THIS VAR AS WELL
		@var:		maximum_block_size			> Contains the current maximum block size, which can be found at, 							FIX THIS VAR AS WELL
		@var:		check_rate							> Contains an integer used for maintaining our check speed - How often to check on the witness.
		@var:		email										> Contains the GMAIL adress of the account at which one would like to send notifications from. Can be the same as 'receiver'
		@var:		password								> Contains the password, for the preceding GMAIL account.
		@var:		props										> Contains the 'account_creation_fee', as well as the 'maximum_block_size', for use in a later function.

*/

	let witness_name = process.env.witnessUsername;
	let receiver = process.env.receiving_email;
	let active_key = process.env.account_ActiveKey;
	let backup_key = process.env.NodeA_BrainKey;
	let mainBrain_key = process.env.NodeB_BrainKey;
	let witness_link = process.env.WitnessLink;
	let account_creation_fee = process.env.accountCreationFee;
	let maximum_block_size = parseInt(process.env.MaximumBlockSize);
	let check_rate = parseInt(process.env.checkRate);
	let email = process.env.NotificationGmail_Email;
	let password = process.env.NotificationGmail_Login;
	let props = {
		account_creation_fee,
		maximum_block_size
	};
	let node_chain_id = process.env.node_chain_id;
	let node_address_prefix = process.env.node_address_prefix;
	let node_URL = process.env.node_URL;
	console.log("Currently running on Chain: ".gray.bold ,node_address_prefix.green.bold);

	checkRunning();
	// console.log(password);


	wls.api.setOptions({ url: node_URL });
	wls.config.set('address_prefix', node_address_prefix);
	wls.config.set('chain_id', node_chain_id);




/*
Set the threshold to one plus the current missed blocks.
*/
	getThresh(witness_name);


	let switches = 0;
	var car =

	/*
	Render home page without second button.
	*/
		res.render('home', {notifications: notifications});
		/*
		Set CheckWitness on interval of ten seconds.
		*/
		setInterval(function() {

			 let threshold = parseInt(process.env.threshold);
			 checkWitness(witness_name, active_key, backup_key, mainBrain_key, witness_link, account_creation_fee, maximum_block_size, threshold, check_rate, email, password, props, receiver, switches);
			 // console.log("logging 1st time: ", password);

		}, 10 * 1000);


});

/*
getThresh: Function.
Step 1: Get witness data for total_missed.
Step 2: Set threshold to 1 above total_missed.
*/
function getThresh(witnessName){
	wls.api.getWitnessByAccount(witnessName, function (err, res) {
		thresh = res.total_missed;
		// console.log("Thresh and total missed = "+thresh);

		thresh++;
		// REMOVE THIS LINE FOR TESTING.

		process.env.threshold = thresh;
		console.log("Initializing Thresh to: ".yellow.bold+ process.env.threshold.green.bold);

});
}

function encrypt(string){
	bcrypt.hash(string, 10, function(err, hash) {
  // Store hash in database
});

}

function decrypt(string){
	bcrypt.compare('somePassword', hash, function(err, res) {
  if(res) {
   // Passwords match
  } else {
   // Passwords don't match
  }
});

}



/*
checkWitness: Function.
Step 1: Check witness.
Step 2: Log Missed Blocks.
Step 3: Launch updateWitness function, on reaching threshold.
*/
function checkWitness(witnessName, activeKey, backupKey, mainBrainKey, witnessLink, CreationFee, MaxBlockSize, Threshold, checkRate, email, password, props, receiver, switches) {

	wls.api.getWitnessByAccount(witnessName, function (err, res) {
		if (err) {
			throw new Error(err);
		} else {
			process.stdout.write('Total Missed = '.yellow.bold + res.total_missed.toString().yellow.bold);
			setTimeout(function() {

				process.stdout.write("	Checked @: ".green.bold + new Date().toString().green.bold);
				process.stdout.cursorTo(0);

	}, 5000);

		if (res.total_missed >= thresh) {
			console.log("updating Witness to Next Node.");

			thresh++;
			console.log("Thresh set to: "+thresh);
			// console.log("logging 2nd time: ", password);

			updateWitness(witnessName, activeKey, backupKey, mainBrainKey, witnessLink, password, email, props, Threshold, receiver, switches);

		}
	}
})
}


/*
updateWitness: Function.
Step 1: Send Email Notification
Step 2: Get witness and check for null key.
Step 3: Update witness node to next node.
*/
	function updateWitness(witnessName, activeKey, backupKey, mainBrainKey, witnessLink, password, email, props, Threshold, receiver, switches) {


	process.stdout.clearLine();


	process.stdout.write("\n");

	console.log("Missed Block, Changing Servers");

	nodemailer.createTestAccount((err, account) => {
	let transporter = nodemailer.createTransport(smtpTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
		auth: {
			user: email,
			pass: password
		}
	}));
	let mailOptions = {
		from: `"${email}"`,
		to: `"${receiver}"`,
		subject: 'You missed a block, switching servers',
		text: `You missed a block at ${new Date(Date.now()).toString()}`
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			throw new Error(error);
		}
	});
	});

	wls.api.getWitnessByAccount(witnessName, function (err, res) {

	if (err) throw new Error(err);


	if (res.signing_key === 'WLS1111111111111111111111111111111114T1Anm'){process.exit();}
	if (backupKey === res.signing_key){
		wls.broadcast.witnessUpdate(activeKey, witnessName, witnessLink, mainBrainKey, props, "0.000 WLS", function (err, res) {
		if (err) {
			throw new Error(err);
		}

//MAYBE CODE FOR SWITCH FAIL SHOULD GO HERE.

	});
	switches++;
	console.log("Switches set to: ".red.bold + switches.toString().green.bold);
	console.log("Working on Server backup".red.bold);
	console.log("Switching to main".red.bold);
	console.log("\n");
	if (switches === 1){
		// process.exit();
	}
}


else if (mainBrainKey === res.signing_key){
wls.broadcast.witnessUpdate(activeKey, witnessName, witnessLink, backupKey, props, "0.000 WLS", function (err, res) {
	if (err) {
		throw new Error(err);
	}

});

switches++;
console.log("Switches set to: ".red.bold + switches.toString().green.bold);
console.log("Working on Server Main".red.bold);
console.log("Switching to Backup".red.bold);
console.log("\n");
if (switches === 1){
	// process.exit();
}
}
});
}






router.get('/update-env', function(req, res){
		res.render('credentials');

});

/*
 Post Req/Resp for Updating Env File.
*/
router.post('/updateENV', function(req, res){


	/*
			@var:		witnessUsername  						  > Contains the name of the witness we are watching.
			@var:		receiving_email 							> Contains Email adress of the account at which you wish to receive notifications.
			@var:		account_ActiveKey 						> Contains the PRIVATE Active key of the witness account.
			@var:		account_ActiveKey1						>	Contains the PRIVATE Active key of the witness account	---- FOR VERIFICATION PURPOSES.
			@var:		NodeA_BrainKey								> Contains Public Brain Key, 'pub-key' of the MAIN node you run your witness on.
			@var:		NodeA_BrainKey1								> Contains Public Brain Key, 'pub-key' of the MAIN node you run your witness on. ---- FOR VERIFICATION PURPOSES.
			@var:		NodeB_BrainKey								> Contains Public Brain Key, 'pub-key' of the BACKUP node you run your witness on.
			@var:		NodeB_BrainKey2       	 		  > Contains Public Brain Key, 'pub-key' of the BACKUP node you run your witness on.---- FOR VERIFICATION PURPOSES.
			@var:		WitnessLink										> Contains the link that you wish to post during your witness update.
			@var:		accountCreationFee						>
			@var:		MaximumBlockSize							>
			@var:		threshold											>
			@var:		checkRate											> Contains an integer used for maintaining our check speed - How often to check on the witness.
			@var:		NotificationGmail_Email				> Contains the GMAIL adress of the account at which one would like to send notifications from. Can be the same as 'receiver'
			@var:		NotificationGmail_Login				>  Contains the password, for the preceding GMAIL account.
	*/


	let witnessUsername = req.body.witnessUsername;
	let receiving_email = req.body.receiving_email;
	let account_ActiveKey = req.body.account_ActiveKey;
	let account_ActiveKey1 = req.body.account_ActiveKey1;
	let NodeA_BrainKey = req.body.NodeA_BrainKey;
	let NodeA_BrainKey1 = req.body.NodeA_BrainKey1;
	let NodeB_BrainKey = req.body.NodeB_BrainKey;
	let NodeB_BrainKey2 = req.body.NodeB_BrainKey2;
	let WitnessLink = req.body.WitnessLink;
	let accountCreationFee = req.body.accountCreationFee;
	let MaximumBlockSize = parseInt(req.body.MaximumBlockSize);
	let  threshold= " ";
	let checkRate = req.body.checkRate;
	let NotificationGmail_Email = req.body.NotificationGmail_Email;
	let NotificationGmail_Login = req.body.NotificationGmail_Password;

	let node_chain_id = process.env.node_chain_id;
	let node_address_prefix = process.env.node_address_prefix;
	let node_URL = process.env.node_URL;





	writeENV(witnessUsername, receiving_email,account_ActiveKey, NodeA_BrainKey, NodeB_BrainKey, WitnessLink,
		 accountCreationFee, threshold, checkRate, NotificationGmail_Login, NotificationGmail_Email, MaximumBlockSize, node_chain_id, node_address_prefix, node_URL);
		 res.redirect('/');
});


/*
writeENV: A function used to overwrite the existing set of environment variables.
*/

function writeENV(witnessUsername, receiving_email,account_ActiveKey, NodeA_BrainKey, NodeB_BrainKey, WitnessLink,
	 accountCreationFee, threshold, checkRate, NotificationGmail_Login, NotificationGmail_Email, MaximumBlockSize, node_chain_id, node_address_prefix, node_URL){

		 /*
		 Logic to set default vars.
		 */

		 if (node_chain_id === '') {
			 node_chain_id = 'de999ada2ff7ed3d3d580381f229b40b5a0261aec48eb830e540080817b72866';
		 }
		 if (node_address_prefix === '') {
			 node_address_prefix = 'WLS';
		 }
		 if (node_URL === '') {
			 node_URL = 'ws://188.166.99.136:8090';
		 }

		 if (NotificationGmail_Email === '') {
			 NotificationGmail_Email = 'pi.wit.protect@gmail.com';
		 }
		 if (NotificationGmail_Login === '') {
			 NotificationGmail_Login = '8kGuTA7%kvnTHaE$QzA';
		 }

 let string = 'witnessUsername='+witnessUsername+"\n"+
 'receiving_email='+receiving_email+"\n"+
 'account_ActiveKey='+account_ActiveKey+"\n"+
 'NodeA_BrainKey='+NodeA_BrainKey+"\n"+
 'NodeB_BrainKey='+NodeB_BrainKey+"\n"+
 'WitnessLink='+WitnessLink+"\n"+
 'accountCreationFee='+accountCreationFee+"\n"+
 'threshold='+threshold+"\n"+
 'checkRate='+checkRate+"\n"+
 'NotificationGmail_Login='+NotificationGmail_Login+"\n"+
 'NotificationGmail_Email='+NotificationGmail_Email+"\n"+
 'MaximumBlockSize='+MaximumBlockSize+"\n"+
 'node_chain_id='+node_chain_id+"\n"+
 'node_address_prefix='+node_address_prefix+"\n"+
 'node_URL='+node_URL+"\n";

// Write to file.
fs.writeFile('.env', string, err => {
    if (err) throw err;
    console.log("[+] New Env Saved!".red.bold);

});



}

function readFile(){
	let fs = require('fs');


try {
let rawdata = fs.readFileSync('students.json');
let student = JSON.parse(rawdata);
console.log("Reading object 'Student' now.");
console.log(student);
notifications.push(objectData);
}
catch(error) {

}
console.log("refreshing file data now.");

writeFile(notifications)



}

router.post('/reload', function(req, res){

	res.render('index', {notifications: notifications});
});



/*
Case 1: Missed Block
Case 2: Both Servers Unavailable
*/
function setNotification(notification){
	let date = new Date();
	let dateOnly = date.toString().substring(0,16)
	let time = date.getHours().toString() + ':' + date.getMinutes().toString()
	+ ':' + date.getSeconds().toString();
	switch (notification) {
		case 1:
			objectData = {Notification:"Threshold Exceeded. Switch-over has occurred. Attention needed.",
												Time:time,
												Date:dateOnly};

			break;
		case 2:
		objectData = {Notification:"Both Servers Unavailable, Shutting Down.",
											Time:"TEST TIME SLOT",
											Date:date};

			break;
		default:

	}
}




function writeFile(fileContents){
	// let data = fileContents;
	let data = JSON.stringify(fileContents, null, 2);
fs.writeFileSync('students.json', data);

}


/*
Function:			setRunningOn()			> A function used to represent that the main process is running.

Function:			setRunningOff()			> A function used to represent that the main process is no longer running.

Function:			checkRunning()			> A function used to check whether the process is running. If true, process will break. Else, we carry on with the script.
*/

function setRunningOn(){
	isRunning = true;
}
function setRunningOff(){
	isRunning = false;
}
function checkRunning(){
	if (isRunning === true) {

		throw new Error("ERROR: ------------- SERVER IS ALREADY RUNNING. Restart Now");
		process.exit(1);


	}
	if (isRunning === false){
		setRunningOn();
	}
}



/*
Function: This function will be used to log notifications into a text file.

Step 1. Take in notification param.  Create boolean for 'first-write' logic/
Step 2. First Write Logic. Simple if loop.
Step 3. Write or Append to file.
*/
function writeLog(notification){


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

module.exports = router, notifications;
