import userModel from "../models/UserModel.js";

export const getUserdata = async(req,res) =>{
    try {
        // Get userId from req.user (set by userAuth middleware)
        const userId = req.user.id;
        
        console.log("Authenticated User ID:", userId); // For debugging

        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success:false,message:"User Not Found"})
        }

        res.json({
            success:true,
            userData:{
                name: user.name,
                isAccoutnVerified: user.isAccoutnVerified 
            }
        })

    } catch (error) {
        console.log("Error in getUserdata:", error);
        res.json({success:false,error:error.message})
    }
}