import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.ENCRYPTION_SECRET || "";
const algorithm = "aes-256-cbc";
const ivLength = 16;

export const encryptField = (text: string): string => {
  const iv = crypto.randomBytes(ivLength);
  const key = crypto.createHash("sha256").update(secret).digest();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decryptField = (encryptedText: string): string => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.createHash("sha256").update(secret).digest();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

