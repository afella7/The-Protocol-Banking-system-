// src/models/account.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  accountNumber: string;
}

const AccountSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAccount>('Account', AccountSchema);
