import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import userModel from "../models/UserModel.js";
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailtemplates.js';


export const register = async(req,res)=>{
         
    const {name,email,password} = req.body; //destructing object

    if(!name || !email || !password){
        return res.json({success:false,message:"Missing Details"})
    }

    try {

        const existingUser = await userModel.findOne({email})

        if (existingUser) {
          return res.json({success:false,message:"User Already Exists"})   
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = new userModel({name,email,password:hashedPassword})
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none':'strict', maxAge:7*24*60*60*1000
        })

        // SENDING MAIL TO NEW USERS

        const mailOptions = {
          from:process.env.SENDER_EMAIL,
          to:email,
          subject:'Welcome to Kavi-Mern-Auth',
          text:`Welcome to Kavi-Mern-Auth Your Account has been created with ${email} `
        }

        await transporter.sendMail(mailOptions)

        return res.json({success:true})
        
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }

}

export const login = async(req,res) =>{
     
      const {email,password} = req.body;

      if (!email || !password) {
        return res.json({success:false,message:"Enater a Valid Email and Password"})
      }

      try {
         const user = await userModel.findOne({email})

         if (!user) {
             return res.json({success:false,message:"Enter a Valid Email"})
         }

         const isMatch = await bcrypt.compare(password,user.password)

         if (!isMatch) {
             return res.json({success:false,message:"Enter a Valid Password"})
         }

         const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
         
        res.cookie('token',token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none':'strict', maxAge:7*24*60*60*1000
        })

        return res.json({success:true})



      } catch (error) {
        res.status(500).json({success:false,message:error.message})
      }
}

export const logout = async(req,res) =>{
       try {
           res.clearCookie('token',{
             httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none':'strict'
           })

           return res.json({success:true,message:"LogOut Successfull"})

       } catch (error) {
         res.status(500).json({success:false,message:error.message})
       }
}

// SENDING VERIFICATION OTP AFTER CREATING ACCOUNT


export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (user.isAccoutnVerified) {
      return res.json({ success: false, message: "Account Already Verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
     // text: `Your Verification OTP is ${otp}. Please verify your account.`,
     html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification OTP sent to email" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;  // <-- FIXED

  if (!otp) {
    return res.json({ success: false, message: "OTP is required" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccoutnVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email Verified Successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//Checking User for Authentication

export const  isAuthenticated = async(req,res) => {
              try {
                   return res.json({success:true})
              } catch (error) {
                res.json({success:false,message:error.message})
              }
} 

// SEND PASSWORD RESET OTP

export const resetOtp = async(req,res) =>{
        const{email} = req.body;

        if(!email){
            return  res.json({success:false,message:"Email is Required"})
        }

        try {

           const user = await userModel.findOne({email});

          if(!user){
            return res.json({success:false,message:"User not Found"})     
           }

           const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset Otp",
    //  text: `Your OTP for Password Reset is ${otp}. Please Reset your Password.`,
      html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",email)
    };

    await transporter.sendMail(mailOptions);

    return res.json({success:true,message:"Password Has Been Sent to the Registered Email"})

        } catch (error) {
          res.json({success:false,message:error.message})
        }
   
}

// RESET PASSWORD

export const resetPassword  = async(req,res) => {
        const{email,otp,newPassword} = req.body;

        if(!email || !otp || !newPassword){
            return res.json({success:false,message:"Email,Otp and New Password is  Required"})
        }

        try {
          
           const user = await userModel.findOne({email})

           if(!user){
              return res.json({success:false,message:"User Not Found"})
           }

           if(user.resetOtp == "" || user.resetOtp !== otp){
                return res.json({success:false,message:"Invalid OTP"})
           }

           if(user.resetOtpExpireAt < Date.now()){
                return res.json({success:false,message:"OTP Expired"})
           }

           if(user.resetOtp == otp){
            res.json({success:true,message:"Password has been Resetted Successfully"})
           }

           const hashedPassword = await bcrypt.hash(newPassword,10);

           user.password = hashedPassword;
           user.resetOtp = "";
           user.resetOtpExpireAt = 0;

           await user.save();

           res.json({success:true,message:"Password has been Resetted Successfully"})

        } catch (error) {
          res.json({success:false,message:error.message})
        }
}