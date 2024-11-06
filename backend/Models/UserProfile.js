const mongoose =  require('mongoose');

const profileSchema = new mongoose.Schema({
    gender:{
        type:String, 
    },
    dateOfBirth:{
        type:String, 
        
    },
    about:{
        type:String, 
        trim:true,
    },
    contactNumber:{
        type:String, 
        
    },
    participated:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "Event",
    }],

})

module.exports = mongoose.model("UserProfile", profileSchema);