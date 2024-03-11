const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone_number:{
        type: String,
        required: true,
        unique: true,
    },
    password_hashed:{
        type: String,
        required: true,
    },
    member: {
        is_premium:{
            type: Boolean,
            required: true,
        },
	    reward: {
            type: Number,
            required: true,
        },
	    payment_info: {
            account: {
                type: String,
                required: true,
            },
		    security_code_hashed: {
                type: String,
                required: true,
            },
	},
},
}
);

const employeeSchema = new mongoose.Schema({
    role: {
      type: String,
      required: true,
    },
    
  });

const User = mongoose.model('User', userSchema);

const Employee = User.discriminator('Employee', employeeSchema);




module.exports = {User, Employee};