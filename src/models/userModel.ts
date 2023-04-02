import mongoose from "mongoose";
import bcrypt from "bcrypt"

const usersCollection = "userList"

export interface IUser{
    email: string,
    password: string,
    name: string,
    location: string,
    age: number,
    phone: number,
    profileThumbnail: string,
    isValidPassword?: (password: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        name: {type: String, required: true},
        location: {type: String, required: true},
        age: {type: Number, required: true},
        phone: {type: Number, required: true},
        profileThumbnail: {type: String, required: true}
    },
    {timestamps: true, versionKey: false}
)

userSchema.pre("save", async function(next) {
    const user = this
    const hash = await bcrypt.hash(user.password, 10)
    this.password = hash
    next()
})

userSchema.methods.isValidPassword = async function(password: string) {
    return await bcrypt.compare(password, this.password) 
}

export const UserModel = mongoose.model<IUser>(usersCollection, userSchema) 