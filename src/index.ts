import { connectDB } from "./config/db";
import { transporter } from "./config/smtpEmail";
import app from "./config/app";

// Server APP 
const App = app;

// connect to Database
connectDB()
.then((connection)=> console.log("Correct conection to MongoDB"))
.catch((err: any)=> console.error("Fail connect to MongoDB", err.message));

// email SMTP
const smtpEmail = transporter;
smtpEmail.verify()
.then(smtp => console.log("Correct connection to SMTP email"))
.catch((err: any)=> console.error("Fail to connect to SMTP email", err.message));
