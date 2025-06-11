const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const register = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const exist = await User.findOne({ email })
        if (exist) return res.status(400).json({ message: 'User already exists' })

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashed
        });
        await user.save()
        res.status(201).json({ message: 'User registered' })

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const exist = await User.findOne({ email })
        if (!exist) return res.status(400).json({ message: 'Invalid credentials' })

        const passwordMatch = await bcrypt.compare(password, exist.password)
        if (!passwordMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userid: exist._id, name: exist.name }, process.env.JWT_SECRET, { expiresIn: '1h', })

        res.status(200).json({ message: 'Login successful', token });

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

}

const profile=async (req,res) => {
     try {
        const user = await User.findById(req.user.userid).select('-password'); 
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    register, login,profile,
};