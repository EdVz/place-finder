import { mongooseConnect } from "@/lib/dbConnection";
import mongoose, { Schema } from "mongoose";

mongooseConnect();

const ImageSchema = new Schema({
    url: String,
});
const placeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rating: Number,
    averageSpent: {
        type: Number,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

placeSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/places/${this._id}">${this.name}</a>`;
});

const Place = mongoose.models.Place || mongoose.model('Place', placeSchema);
export default Place;