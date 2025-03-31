/* eslint-disable padding-line-between-statements */
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
const express = require('express');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const bcrypt = require("bcrypt");
const routerUsers = express.Router();
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./isAuth');
const User = require('./schema/users');
const multer = require('multer');
const path = require('path');

// routerUsers.get('/', verifyToken, async (req, res) => {
//     try {
//         const limit = parseInt(req?.query?.limit);
//         const offset = parseInt(req?.query?.offset);

//         const db = await dbConnect();
//         const userCollection = db.collection('users');
        
//         const response = await userCollection.find().toArray();
//         res.send(response.slice(offset, limit + offset));
//     } catch (error) {
//         res.send({error: error?.errmsg});
//     }
// })

routerUsers.get('/auth', verifyToken, async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.user?.email });
        return res
            .status(200)
            .json({
                user: existingUser,
            });
    } catch (error) {
        res.send({error: error?.errmsg});
    }
})

// Generate Unique Student ID
const generateUserId = async (userType) => {
    const lastUser = await User.findOne().sort({ createdAt: -1 });
    const lastId = lastUser ? parseInt(lastUser.userId.slice(3)) : 0;
    return userType === 'student' ? `STU${lastId + 1}` : `ADM${lastId + 1}`;
};

routerUsers.post("/register", async (req, res) => {
    try {
        const { password, email, user_type, role } = req.body.userInfo;
        if (!password || !email) {
            return res.status(400).json({ error: "Name and Email are required" });
        }

        // 🔹 Hash the password with a salt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate Student ID
        const userId = await generateUserId(user_type);
        // 🔹 Create and Save Student
        const newUser = new User({
            password: hashedPassword,
            email,
            userId,
            adminRole: role
        });
        await newUser.save();
        res.status(201).json({ message: "User saved!", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerUsers.post("/update", async (req, res) => {
    try {
        const { email: userEmail, firstName, lastName, address, dob, adminRole } = req.body.userInfo;
        console.log('req.body.userInfo', req.body.userInfo, userEmail);
        if (!userEmail) {
            return res.status(400).json({ error: "Name and Email are required" });
        }
        

        // 🔹 Create and Save Student
        const newUser = await User.findOneAndUpdate(
            {
                email: userEmail
            },
            {
                firstName,
                lastName,
                address,
                dob,
                adminRole
            },
            { new: true, upsert: true } // Create if not found
        );
        console.log({newUser});
        res.status(201).json({ message: "User saved!", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerUsers.post('/login', async (req, res) => {

    try {
        // const db = await dbConnect();
        // const userCollection = db.collection('users');
    
        const { email, password } = req.body.userInfo;;
        console.log('req.query.body', req.body.userInfo);


        if(!email || !password) {
            return res.status(400).send({message: 'Please provide correct credentials.'})
        }

        // Check If User Exists In The Database
        const user = await User.findOne({ email });
        console.log({user});
        // Compare Passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!user || !passwordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({
            userId: user._id,
            email: user.email
        },
        process.env.SECRET_KEY || "1234!@#%<{*&)",
        {
            expiresIn: "24h",
        });

        res.cookie("auth", token, {
            httpOnly: true, // ✅ Prevents client-side access
            secure: true, // ✅ Use HTTPS in production
            sameSite: "Strict" // ✅ Prevents CSRF attacks
        });

        return res
            .status(200)
            .json({
                message: "Login Successful",
                user,
                token
            });

    } catch (error) {
        res.send({error: error?.errmsg});
    }
    
})

// routerUsers.get("/logout", (req, res) => {
//     res.clearCookie("auth", { httpOnly: true, secure: true, sameSite: "Strict" });
//     return res.json({ message: "Logged out successfully" });
// });

module.exports = { routerUsers };

