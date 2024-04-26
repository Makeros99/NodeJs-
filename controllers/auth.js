const Auth = require("../models/auth.js")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async(req , res) => {
    const { username , password , email} = req.body
    try{
        const user = await Auth.findOne({email})
        if(user){
            return res.status(500).json({message: "böyle bir kullanıcı zaten mevcut"})
        }

        if(password.lenght < 8){
            return res.status(500).json({message: "Şifre 8 karakterden aşağı olamaz"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await Auth.create({username, password : hashedPassword, email})

        const token = await jwt.sign({id: newUser._id} , process.env.SECRET_TOKEN, {expiresIn: "1h"})

        res.status(201).json({
            status: "OK",
            ...newUser,
            token
        })

    } catch(error){
        res.status(500).json({message: "Burada bir hata var"})
    }
}


const login = async (req,res) =>{
    const {email,password} = req.body
    try {
        const user = await Auth.findOne({email});
        if(!user){
            return res.status(500).json({message: "Böyle bir kullanıcı bulunamadı"})
        }
        const comparePassword = await bcrypt.compare(password , user.password)
        if(!comparePassword){
            return res.status(500).json({message: "Girdiğiniz şifre hatalı"})
        }
        const token = await jwt.sign({id: user._id} , process.env.SECRET_TOKEN, {expiresIn: "1h"})
        res.status(200).json({
            status:"OK",
            ...user,
            token
        })

    } catch (error) {
        res.status(500).json({message: "Burada bir hata var"})
    }
}


module.exports = {login , register}