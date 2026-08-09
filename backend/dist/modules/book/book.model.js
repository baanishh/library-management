import mongoose, { Schema } from "mongoose";
const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    publishedYear: {
        type: Number,
        required: true,
    },
    totalCopies: {
        type: Number,
        required: true,
        min: [1, "Total copies must be at least 1"],
    },
    availableCopies: {
        type: Number,
        required: true,
        min: [0, "Available copies cannot be negative"],
    },
}, {
    timestamps: true,
});
export const Book = mongoose.model("Book", bookSchema);
