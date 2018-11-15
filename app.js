// Library imports
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = 3000
var path = require('path');

// Creating the express server
const app = express();

// Starting the express server
app.listen(PORT, function()
{
	console.log("Listening on " + PORT)
});

// Creating the MySQL connection
var db = mysql.createPool({
	connectionLimit: 10,
	host     : 'cop4710db.cl3pgb8hw8fv.us-east-1.rds.amazonaws.com',
  	user     : 'cop4710user',
  	password : 'cop4710pass',
  	database : 'akean_project'

});

// Body-parser initialization
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret: '7i5mnQZjPSqL924rQvxG',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: true,
		maxAge: 86400000
	}
}));

// Sets directory for files to serve (files not in this directory will not be served)
app.use(express.static(path.join(__dirname, 'HTML')));

// 6 pages total
// Pulling the login page
app.get('/home',function(req,res){
    res.sendFile(__dirname + '/html/dashboard.html');
});

app.get('/login',function(req,res){
    res.sendFile(__dirname + '/html/signin.html');
});

//////////////////////////////////////////////////////////////////////


//Routes

//Create user
app.post('/addUser', function(req, res){
    // Create connection to database
	db.getConnection(function(err, tempCont){
			
		// Error if connection is not established
		if(err) {
			res.status(400).send('Connetion Fail');				
		} 
				
		else {
			var password = calcMD5(req.body.password);
			if (checkInput(password,"password") && checkInput(req.body.email,"email") && checkInput(req.body.universityID,"username") && checkInput(req.body.securityAns,"answer")){
				// Add user to database
				const sqlAddUser = "INSERT INTO STD_USER (pass, email, universityID, securityAns) VALUES ('";
				tempCont.query(sqlAddUser + password + "', '" + req.body.email + "', " + req.body.universityID + ", '" + req.body.securityAns + "')", function(err, result) {

				// Check if query works
				if(err) {
					res.status(400).send('Query Fail');
				}
				else {
					res.status(200).send('Query Success');	
				}
									
				// End connection
				tempCont.release();
				});
			}

			else{
				res.status(400).send('Invalid Input');
			}
								
		}
		
    });
});

//User login
app.post('/userLogin', function(req,res){
    // Create connection to database
	db.getConnection(function(err, tempCont){
			
		// Error if connection is not established
		if(err) {
			res.status(400).send('Connection fail');				
		} 
		
		else { 			
			var password = calcMD5(req.body.password);
			if (checkInput(req.body.userID, "username") && checkInput(password, "password")){
				const sql = 'SELECT userID, email, universityID FROM STD_USER WHERE email = ? AND pass = ?';
				tempCont.query(sql, [req.body.email, password], function(err, result) {
					
				// Check if query works
				if (err) {
					res.status(400).send('Query Fail');
				}
				 
                else {
					if (result.length == 0){
						res.status(400).send('No match')
					}
					else{
						res.status(200).send(result);	
					}
							
				}
					
				// End connection
				tempCont.release();
			
				});
			}
				
		}

	});
});




// Search for events.
app.post('/searchEvents', function(req,res){
    // Create connection to database
	db.getConnection(function(err, tempCont){
			
		// Error if connection is not established
		if(err) {
			res.status(400).send('Connection fail');
				
		} else { 
			
			
			if(req.body.flag == 0){
				const sqlSearchEvent = 'SELECT * FROM ALL_EVENTS WHERE name = ? AND cat = ?';
				tempCont.query(sqlSearchEvent,[req.body.name, req.body.cat], function(err, result) {
					
				// Check if query works
				if (err) {
					res.status(400).send('Query Fail');
                } 
                else {
					res.status(200).send(result);		
				}
					
				// End connection
				tempCont.release();
			
				});
			}
			else{
				const sqlSearchEvent = 'SELECT * FROM ALL_EVENTS WHERE cat = ?';
				tempCont.query(sqlSearchEvent,[req.body.cat], function(err, result) {
					
				// Check if query works
				if (err) {
					res.status(400).send('Query Fail');
                } 
                else {
					res.status(200).send(result);		
				}
					
				// End connection
				tempCont.release();
			
				});
			}
				
		}

	});
});


// Create Event.
app.post('/createEvent', function(req,res){

    // Create connection to database
	db.getConnection(function(err, tempCont){
			
		// Error if connection is not established
		if(err) {
			res.status(400).send('Connection fail');
				
		} else { 
			
			
			const sqlCreateEvent = 'INSERT INTO ALL_EVENTS (userID, cat, startTime, endTime, location, name, description) VALUES(';
			tempCont.query(sqlCreateEvent + req.body.userID + "," + req.body.cat + ", '" + req.body.startTime + "', '" + req.body.endTime + "'," + req.body.location + ", '" + req.body.name + "', '" + req.body.description + "')", function(err, result) {
					
				// Check if query works
				if (err) {
					res.status(400).send('Query Fail');
                } 
                else {
					res.status(200).send(result);		
				}
					
				// End connection
				tempCont.release();
			
			});
				
		}

	});
});


// Create RSO.
app.post('/createRSO', function(req,res){

    // Create connection to database
	db.getConnection(function(err, tempCont){
			
		// Error if connection is not established
		if(err) {
			res.status(400).send('Connection fail');
				
		} else { 
			
			
			const sqlCreateEvent = 'INSERT INTO RSO (universityID, userID, name) VALUES(';
			tempCont.query(sqlCreateEvent + req.body.universityID + "," + req.body.userID + ", '" + req.body.name + "')", function(err, result) {
					
				// Check if query works
				if (err) {
					res.status(400).send('Query Fail');
                } 
                else {
					res.status(200).send(result);		
				}
					
				// End connection
				tempCont.release();
			
			});
				
		}

	});
});

// Search for RSO.
app.post('/searchRSO', function(req,res){

    // Create connection to database
	db.getConnection(function(err, tempCont){
			
		// Error if connection is not established
		if(err) {
			res.status(400).send('Connection fail');
				
		} else { 
			
			
			const sqlSearchRSO = 'SELECT * FROM RSO WHERE name = ?';
			tempCont.query(sqlSearchRSO,[req.body.name], function(err, result) {
					
				// Check if query works
				if (err) {
					res.status(400).send('Query Fail');
                } 
                else {
					res.status(200).send(result);		
				}
					
				// End connection
				tempCont.release();
			
			});
				
		}

	});
});




//Check for valid inputs to stop SQL injections.
var checkInput = function(input, type, callback) {
	
	var returnVal = null;
	
	switch(type) {
		
		case "username":
			var re = /^[a-z|\d]{1,20}$/i; // Format 5-20 characters and digit
			returnVal = re.test(input);
			break;

		case "password":
			 var re= /[a-z\d]{32}$/;
			 returnVal= re.test(input);
			 break;
			
		case "email":
			var re = /^[a-z\d]{1,20}@[a-z]{1,10}(\.[a-z]{3}){1,2}$/i; // Format 1-20 character @ 1-10 characters . extension
			returnVal = re.test(input);
			break;

		case "answer":
			var re = /^[a-z|\d\s]{1,50}$/i;
			returnVal = re.test(input);
			break;
			
		case "name":
			var re = /^[a-z]{1,20}$/i; // Format 20 characters
			returnVal = re.test(input);
			break;
			
		case "phone":
			var re = /(1){0,1}\d{10}$/i; // Format 18004445555 | 4074445555
			var number = input.replace(/[^\d]/g, '');
			returnVal = re.test(number);
			break;

		case "phonesearch":
			var re = /\d{1,11}$/;
			returnVal = re.test(input);
			break;
		
		default:
			returnVal = null;
			break;
	}
	
	if(callback == undefined) {	
		return returnVal;
		
	} else {
		callback(returnVal);
	}
}


/*----------------------------------*/
/* JavaScript implementation of MD5 */
/*----------------------------------*/

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    
    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}
































