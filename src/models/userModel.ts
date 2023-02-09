import mongoose from "mongoose";
import bcrypt from "bcrypt"

const usersCollection = "user"

interface IUser{
    email: string,
    password: string,
    isValidPassword: (password: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
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