import app, { runApp } from "./app";
import { connectDB } from "./config/db";
import { transporter,  verifySMTPConnection } from "./config/smtpEmail";


// Active the server
const App = app;
runApp();

// Connect to DB
connectDB((err, connection)=> {
    if(err) return console.log("Error to connect DB: ", err.message);
    console.log("Correct connection to DB",  connection);
});

// Connection to email SMTP
const SMTPEmail = transporter;
verifySMTPConnection((err, connection)=> {
    if(err) return console.log("Error to connect SMTP email: ", err.message);
    console.log("Correct connection to SMTP email");
});


