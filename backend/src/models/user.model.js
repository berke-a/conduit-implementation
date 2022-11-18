const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    token:{
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    bio:{
        type: String,
        required: false,
    },
    image:{
        type: String,
        required: false,
    },
    followers:{
        type: Array,
        required: false,
    },
    articles:{
        type: Array,
        required: false,
    },

})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 16);
});

userSchema.methods.generateToken = async function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const decodedData = jwt.decode(token);
    this.token = token;
    this.expiresAt = decodedData.exp;

    return token;
};

userSchema.methods.matchPassword = async function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
};


const User = mongoose.model("User", userSchema);

export default User;