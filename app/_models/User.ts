import { mongooseConnect } from '@/lib/dbConnection';
import mongoose, { Schema } from 'mongoose';

mongooseConnect();

const userSchema = new Schema({
    username: {
        type: String,
    },
    imageUrl: String,
    externalUserId: {
        type: String,
        unique: true,
    },
},
    {
        timestamps: true
    }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

