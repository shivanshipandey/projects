const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const reviewSchema = new mongoose.schema(
  {
    bookId: {
      type: ObjectId,
      ref: "Book",
      required: true,
    },
    reviewedBy: {
      type: String,
      required: true,
      default: "Guest",
      value: String,
    },
    reviewedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "rating should be between 1 to 5 "],
      max: 5,
    },
    review: { type: String },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);