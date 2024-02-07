import { mongooseConnect } from "@/lib/dbConnection";
import mongoose, { Schema } from "mongoose";

mongooseConnect();

const reviewSchema = new Schema({
    content: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});


const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;