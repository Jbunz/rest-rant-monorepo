const router = require('express').Router();
const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = db;

router.post('/', async (req, res) => {
    let user = await User.findOne({
        where: { email: req.body.email }
    });

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({
            message: `Could not find a user with the provided username and password`
        });
    } else {
        const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ user: user, token: token });
    }
});

router.get('/profile', async (req, res) => {
    try {
        const [authenticationMethod, token] = req.headers.authorization.split(' ');

        if (authenticationMethod === 'Bearer') {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { id } = decoded;

            let user = await User.findOne({
                where: {
                    userId: id
                }
            });
            res.json(user);
        } else {
            res.status(401).json({ message: 'Invalid authentication method' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;
