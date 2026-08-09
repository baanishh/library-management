import mongoose, { Schema } from "mongoose";
const transactionSchema = new Schema({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["BORROW", "RETURN"],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
export const Transaction = mongoose.model("Transaction", transactionSchema);
