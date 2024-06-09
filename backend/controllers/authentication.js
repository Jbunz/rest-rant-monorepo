const router = require('express').Router();
const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = db;

router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        if (!user || !(await bcrypt.compare(req.body.password, user.passwordDigest))) {
            return res.status(404).json({
                message: `Could not find a user with the provided username and password`
            });
        }

        const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ user: user, token: token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/profile', async (req, res) => {
    try {
        res.json(req.currentUser);
    } catch (error) {
        console.error("Error in fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
