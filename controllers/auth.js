const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const  { SECRET_KEY }  = process.env;
const User = require('../models/users');
const ctrlWrapper = require('../helpers/ctrlWrapper');

const register = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            res.status(409).json({ message: 'Email in use' });
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            ...req.body,
            password: hashPassword
        })

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription:  newUser.subscription
            }
        });

    } catch (error) {
        console.log(error);
    }
}


const logIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401).json({message: 'Email or password is wrong'})
        return;
    }

    const passCompare = await bcrypt.compare(password, user.password);

    if (!passCompare) {
        res.status(401).json({message: 'Email or password is wrong'})
        return;
    }

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription
        }
    })
}

const logOut = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.status(204).json()
}

const current = async (req, res) => {
    const { email, subscription } = req.body;

    req.json = {
        email,
        subscription
    }
   
}

module.exports = {
    register: ctrlWrapper(register),
    logIn: ctrlWrapper(logIn),
    logOut: ctrlWrapper(logOut),
    current: ctrlWrapper(current)
}