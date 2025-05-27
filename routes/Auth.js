const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


router.post("/registration",
    [
        body("username", "Username must be at least 3 characters long").isLength({min: 3}),
        body("email", "Please enter a valid email").isEmail(),
        body("password", "Password must be at least 8 characters long").isLength({min: 8}),
    ],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {username,email,password} = req.body;
        try {

            // Check if user already exists
            let user = await User.findOne({email: email});
            if(user){
                return res.status(400).json({error: "User with this email already exists"});
            }

            // make bcrypt password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user
            user = new User({
                username,
                email,
                password: hashedPassword
            });
            
            // Save the user to the database
            const data ={
                user: {
                    id: user.id
                }
            }

            // authenticate user jwt token
            const authToken = jwt.sign(data,JWT_SECRET );
            await user.save();
            res.json({user,authToken});
            
        } catch (error) {
            console.error("Error in registration:", error);
            res.status(500).send("Internal Server Error");
            
        }

})



// Login route
router.post("/login",
    [
        body("email", "Please enter a valid email").isEmail(),
        body("password", "Password cannot be blank").exists()
    ],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        
        const {email, password} = req.body;
        try {
            // Check if user exists
            let user = await User.findOne({email});
            if(!user){
                return res.status(400).json({message: "Invalid credentials"});
            }

            // Compare password
            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                return res.status(400).json({message: "Invalid credentials"});
            }

            // Generate auth token
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({user,authToken});

        } catch (error) {
            console.error("Error in login:", error);
            res.status(500).send("Internal Server Error");
        }
    }
)


module.exports = router;