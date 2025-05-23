import mongoose, { Document, Schema } from "mongoose";

export interface ICard extends Document {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string; // MM/YY
  cvv: string;
  encryptedPhoneNumber: string;
  encryptedDOB: string;
  linkedAccount: mongoose.Types.ObjectId; // reference to Account model
  createdAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    cardholderName: { type: String, required: true },
    cardNumber: { type: String, required: true, unique: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
    encryptedPhoneNumber: { type: String, required: true },
    encryptedDOB: { type: String, required: true },
    linkedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Card = mongoose.model<ICard>("Card", CardSchema);

export default Card;

