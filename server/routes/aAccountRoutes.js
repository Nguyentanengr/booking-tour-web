


const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAccounts, createAccount, getAccountById, updateAccount, deleteAccount } = require('../controllers/aAccountController');
const { getAccountsValidator, createAccountValidator, getAccountByIdValidator, updateAccountValidator, deleteAccountValidator } = require('../validators/aAccountValidator');


router.get('/', ...getAccountsValidator, getAccounts);
router.post('/', ...createAccountValidator, createAccount);
router.get('/:id', ...getAccountByIdValidator, getAccountById);
router.put('/:id', ...updateAccountValidator, updateAccount);
router.delete('/:id', ...deleteAccountValidator, deleteAccount);

module.exports = router;
