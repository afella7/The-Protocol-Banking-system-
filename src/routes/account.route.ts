import { Router } from 'express';
import { createAccount, listAccounts, decryptData } from '../controllers/account.controller';

const router = Router();

router.post('/accounts', createAccount);

router.get("/accounts", listAccounts);

router.post("/accounts/decrypt", decryptData);

export default router;
