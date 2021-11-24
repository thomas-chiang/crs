const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const { emailService } = require("../services");
const { generatePasswordResetToken } = require("../utils/token");
const User = require("../models/user.js")
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

require('dotenv').config();


router.get('/', async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");
        const sortedUsers = allUsers.rows.sort(function (x, y) {
            return new Date(x.user_created_at).getTime() - new Date(y.user_created_at).getTime();
        });
        res.status(200).json( sortedUsers );
    } catch (error) {
        res.status(404).json({ message: error.message });
    }}
);

router.patch('/:user_email', async (req, res) => { 
    try {
        const { user_email } = req.params;
        const { is_activated } = req.body;
        const updatedUser = await pool.query(
            `UPDATE users SET is_activated = $1 WHERE user_email = $2 RETURNING *`,
            [is_activated, user_email]
        )
        
        res.json(updatedUser.rows[0]);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }}
);


router.post('/signin', async (req, res) => {
    const { user_email, user_password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [user_email]);

        if(user.rows.length === 0){
            return res.status(404).json({ message: 'Email does not exist'}) //send. ~= json. 
        }
        
        const validPassword = await bcryptjs.compare(user_password, user.rows[0].user_password);
        
        if(!validPassword){
            return res.status(400).json({message: 'Password is incorrect'}) //send. ~= json. 
        }

        const token = jwt.sign({ email: user.rows[0].user_email, id: user.rows[0].user_id  }, process.env.jwtSecret, {expiresIn: '1hr'})

        res.status(200).json({ result: user.rows[0], token });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }}
);


router.post('/signup', async (req, res) => {
    const { user_email, user_password, confirmPassword, firstName, lastName, position } = req.body;
    
    const fullName = `${firstName} ${lastName}`;

    try {
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[user_email]);

        if (user.rows.length !== 0) {
            return res.status(404).json({ message: 'User already exists'}); // 401 unauthenticated
        }
        
        if (user_password !== confirmPassword) return res.status(404).json({ message: "Passwords don't match"});
        
        const bcryptjsPassword = await bcryptjs.hash(user_password, 12);

        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password, position) VALUES ($1, $2, $3, $4) RETURNING *", [fullName, user_email, bcryptjsPassword, position]); 

        const token = jwt.sign({ email: newUser.rows[0].user_email, id: newUser.rows[0].user_id  }, process.env.jwtSecret, {expiresIn: '1hr'})

        res.status(200).json({ result: newUser.rows[0], token });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }}
);

router.post("/recover", async (req, res, next) => {
    try {
        const { email } = req.body
        const token = generatePasswordResetToken();
        const user = await User.savePasswordResetToken(email, token);
        if (user) {
            await emailService.sendPasswordResetEmail(user, token) 
        }

        return res.status(200).json({ message: `If your email exists, you should receive an email shortly.`})
    } catch (error) {
        console.error(error);
        next(error)
    }
})

router.post("/password-reset", async (req, res, next) => {
    try {
        const { token } = req.query

        const { newPassword } = req.body

        const bcryptjsPassword = await bcryptjs.hash(newPassword, 12);

        const user= await User.resetPassword(token, bcryptjsPassword);
       
        if (user) {
            await emailService.sendPasswordResetConfirmationEmail(user) 
        }

        return res.status(200).json({ message: `Password successfully reset.`})
    } catch (error) {
        console.error(error);
        next(error)
    }

})



module.exports = router;