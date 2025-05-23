import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import Account from "../models/account.model";
import { generateAccountNumber } from "../utils/generateAccountNumber";
import { encryptField, decryptField } from "../utils/encryption";

export const createAccount: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, surname, email, phoneNumber, dateOfBirth } = req.body;

    const existing = await Account.findOne({ email });
    if (existing) {
      res
        .status(400)
        .json({ message: "Account with this email already exists." });
      return;
    }

    const accountNumber = generateAccountNumber();

    const account = await Account.create({
      firstName,
      surname,
      email,
      phoneNumber,
      dateOfBirth,
      accountNumber,
    });

    res.status(201).json({
      message: "Account created successfully",
      data: account,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await Account.find();

    const result = accounts.map((account) => {
      const encryptedPhoneNumber = encryptField(account.phoneNumber);
      const encryptedDOB = encryptField(
        new Date(account.dateOfBirth).toISOString()
      );

      return {
        accountNumber: account.accountNumber,
        fullName: `${account.firstName} ${account.surname}`,
        sensitiveData: {
          encrypted: {
            phoneNumber: encryptedPhoneNumber,
            dateOfBirth: encryptedDOB,
          },
          decrypted: {
            phoneNumber: account.phoneNumber,
            dateOfBirth: account.dateOfBirth,
          },
        },
      };
    });

    res.json({ message: "Accounts retrieved successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const decryptData = (req: Request, res: Response) => {
  try {
    const encryptedFields = req.body;

    if (!encryptedFields || Object.keys(encryptedFields).length === 0) {
      res.status(400).json({ message: "No encrypted fields provided" });
      return;
    }

    const decrypted: Record<string, string> = {};

    for (const [key, value] of Object.entries(encryptedFields)) {
      if (typeof value === "string") {
        decrypted[key] = decryptField(value);
      } else {
        decrypted[key] = "";
      }
    }

    res.json({ decrypted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
