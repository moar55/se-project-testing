/*
 Attribution to Rahil Shaikh:
 https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/#comment-1026
*/

var crypto = require('crypto');
var Admins = require('../models/Admin');



/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt) {
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
};

/*
   Use this function to hash a password for the admin so you can insert in the database
   The function below it is exported to be used in the Admin model for validating passwords on login.
*/

function saltHashPassword(userpassword) {
  var salt = genRandomString(16); /** Gives us salt of length 16 */
  var passwordData = sha512(userpassword, salt);
  console.log(passwordData.salt);
  console.log(passwordData.passwordHash);
  }

  saltHashPassword('superman')

module.exports.saltHashPassword = function(userpassword, salt) {
  return sha512(userpassword, salt).passwordHash;
}
