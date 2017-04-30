# SE-Project

## Quick Notes
* You should create a students_photos folder and a service_providers_photos folder in the root folder.
* Please use node v6.10 or above to be able to use nodemailer.
* In api/config/nodemailer.js you should put your email and password and the SMTP provider you are using. If you are using gmail choose the enable less secure apps in your gmail settings; this might occur with other providers as well. 

## How to create an admin (for now atleast)
* Go to pass-hashing.js under api/libs
* call `saltHashPassword(<your pass>);` AFTER the genRandomString function...
* now in your terminal cd into api/libs then run node pass-hashing.js, which should print out two lines. The first one has the salt and the second one has the hashed password.
* Save both of these somewhere and run mongo . type `use campus`.Then `db.admins.insert({username:'name',password:'hashedPass',salt:'salt'});` just use the password and salt created from pass-hashing...
