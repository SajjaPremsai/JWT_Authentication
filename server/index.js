const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const UserModel = require("./Model/User")
const dotenv = require("dotenv").config()

const app = express()

app.use(bodyparser.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials : true
}))
app.use(cookieParser())





// Database Connection

const Connection = mongoose.connect("mongodb+srv://codedemon434:04EErK3dXfvR9DaX@authentication.8ghho9q.mongodb.net/?retryWrites=true&w=majority")
.then(console.log("Connection Successfully"))
.catch((err)=>console.log(err))


app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username: username });

        if (!user) {
            res.status(401).send("Unauthorized Access: User not found");
            return;
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const access_token = jwt.sign({ username: username },process.env.ACCESS_TOKEN, {expiresIn : '1h'})
                const refresh_token = jwt.sign({ username: username }, process.env.REFRESH_TOKEN, { expiresIn: '2h' })
                res.cookie("AccessToken" , access_token ,{
                    httpOnly : true , secure:true , sameSite : 'strict' 
                })
                res.cookie("RefreshToken", refresh_token , {
                    httpOnly : true , secure : true , sameSite : 'strict' 
                })
                res.status(200).send({
                    verification: true,
                    message: "Verification Successful...."
                });
            } else {
                res.status(401).send({
                    verification: false,
                    message: "Unauthorized Access....."
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            verification: false,
            message: "Internal Server Error"
        });
    }
});

app.get("/logout",(req,res)=>{
    res.clearCookie("AccessToken")
    res.clearCookie("RefreshToken")
    res.send({
        message: "User Successfully Logged out"
    })
})

app.post("/register", async (req, res) => {
    try {
        const { fullname , username, password, email } = req.body;
        const existingUser = await UserModel.findOne({ $or: [{ username: username }, { email: email }] });
        if (existingUser) {
            res.status(400).send({
                verification: false,
                message: "Username or email already exists"
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            fullname,
            email,
            username,
            password: hashedPassword,
        });
        res.status(201).send({
            verification: true,
            message: "Successfully registered"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            verification: false,
            message: "Error creating user"
        });
    }
});


function Authentication(req, res, next) {
    const accessToken = req.cookies.AccessToken; // Assuming you have set the cookie name as "Access-Token"

    if (accessToken) {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (decoded) {
                req.decoded = decoded;
                next();
            } else {
                console.error(err);
                res.status(500).send({
                    verification: false,
                    message: "Please Login..."
                });
            }
        });
    } else {
        res.status(401).send({
            verification: false,
            message: "Unauthorized Access: Access token not provided"
        });
    }
}

app.get("/Dashboard", Authentication, (req, res) => {
    res.status(200).send({
        value: req.decoded,
        verification: true,
        message: "Dashboard Data"
    });
});




app.listen(process.env.PORT,()=>{
    console.log("Server listening on https://localhost:3001/")
})