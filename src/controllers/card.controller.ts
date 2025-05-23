import { Request, Response, NextFunction } from "express";
import Account from "../models/account.model";
import VirtualCard from "../models/card.model";
import {
  generateCardNumber,
  generateExpiryDate,
  generateCVV,
} from "../utils/cardGenerators";
import { encryptField, decryptField } from "../utils/encryption";

export const createVirtualCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accountId } = req.body;

    // Check if the account exists
    const account = await Account.findById(accountId);
    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    // Generate card data
    const cardNumber = generateCardNumber();
    const expiryDate = generateExpiryDate();
    const cvv = generateCVV();

    // Normalize dateOfBirth as Date object
    const dob = new Date(account.dateOfBirth);

    // Encrypt sensitive fields
    const encryptedCardNumber = encryptField(cardNumber);
    const encryptedExpiryDate = encryptField(expiryDate);
    const encryptedCVV = encryptField(cvv);
    const encryptedPhoneNumber = encryptField(account.phoneNumber);
    const encryptedDOB = encryptField(dob.toISOString());

    // Save to DB
    const virtualCard = await VirtualCard.create({
      linkedAccount: account._id,
      cardholderName: `${account.firstName} ${account.surname}`,
      cardNumber: encryptedCardNumber,
      expiryDate: encryptedExpiryDate,
      cvv: encryptedCVV,
      encryptedPhoneNumber,
      encryptedDOB,
    });

    res.status(201).json({
      message: "Virtual card created successfully",
      cardId: virtualCard._id,
      encryptedData: {
        cardNumber: encryptedCardNumber,
        expiryDate: encryptedExpiryDate,
        cvv: encryptedCVV,
        phoneNumber: encryptedPhoneNumber,
        dateOfBirth: encryptedDOB,
      },
      decryptedData: {
        cardNumber,
        expiryDate,
        cvv,
        phoneNumber: account.phoneNumber,
        dateOfBirth: dob.toISOString(), // consistent ISO output
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getVirtualCardById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const virtualCard = await VirtualCard.findById(id).populate("linkedAccount");
    if (!virtualCard) {
      res.status(404).json({ message: "Virtual card not found" });
      return;
    }

    // Decrypt sensitive fields
    const decryptedCardNumber = decryptField(virtualCard.cardNumber);
    const decryptedExpiryDate = decryptField(virtualCard.expiryDate);
    const decryptedCVV = decryptField(virtualCard.cvv);
    const decryptedPhoneNumber = decryptField(virtualCard.encryptedPhoneNumber);
    const decryptedDOB = decryptField(virtualCard.encryptedDOB);

    res.status(200).json({
      message: "Virtual card retrieved successfully",
      data: {
        id: virtualCard._id,
        cardholderName: virtualCard.cardholderName,
        cardNumber: decryptedCardNumber,
        expiryDate: decryptedExpiryDate,
        cvv: decryptedCVV,
        phoneNumber: decryptedPhoneNumber,
        dateOfBirth: decryptedDOB,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
