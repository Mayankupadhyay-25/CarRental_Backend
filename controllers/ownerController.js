import User from "../configs/models/User.js"

export const changeRoleToOwner = async (req, res) =>{
    try{
        const {_id} =req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"}) 
        res.json({success: true, message: "now you can list cars"})
    }catch (error){
        console.log(error.message);
        res.json({success: false, message:error.message})

    }

}