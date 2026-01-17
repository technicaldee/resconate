const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class WalletService {
    /**
     * Get or create a wallet for an owner
     */
    async getOrCreateWallet(ownerId, ownerType) {
        let wallet = await prisma.wallets.findUnique({
            where: { owner_id: ownerId }
        });

        if (!wallet) {
            wallet = await prisma.wallets.create({
                data: {
                    owner_id: ownerId,
                    owner_type: ownerType,
                    available_balance: 0,
                    pending_balance: 0
                }
            });
        }

        return wallet;
    }

    /**
     * Deposit funds into a wallet (usually from Paystack)
     */
    async deposit(ownerId, amount, description, referenceId) {
        return await prisma.$transaction(async (tx) => {
            const wallet = await tx.wallets.update({
                where: { owner_id: ownerId },
                data: {
                    available_balance: { increment: amount }
                }
            });

            await tx.wallet_transactions.create({
                data: {
                    wallet_id: wallet.id,
                    type: 'DEPOSIT',
                    amount: amount,
                    description: description,
                    reference_id: referenceId
                }
            });

            return wallet;
        });
    }

    /**
     * Add to pending balance (when earner claims a task)
     */
    async addPending(ownerId, amount, description, referenceId) {
        return await prisma.$transaction(async (tx) => {
            const wallet = await tx.wallets.update({
                where: { owner_id: ownerId },
                data: {
                    pending_balance: { increment: amount }
                }
            });

            await tx.wallet_transactions.create({
                data: {
                    wallet_id: wallet.id,
                    type: 'ESCROW_PENDING',
                    amount: amount,
                    description: description,
                    reference_id: referenceId
                }
            });

            return wallet;
        });
    }

    /**
     * Move from pending to available (on approval)
     */
    async resolvePending(ownerId, amount, description, referenceId) {
        return await prisma.$transaction(async (tx) => {
            const wallet = await tx.wallets.update({
                where: { owner_id: ownerId },
                data: {
                    pending_balance: { decrement: amount },
                    available_balance: { increment: amount }
                }
            });

            await tx.wallet_transactions.create({
                data: {
                    wallet_id: wallet.id,
                    type: 'EARNING',
                    amount: amount,
                    description: description,
                    reference_id: referenceId
                }
            });

            return wallet;
        });
    }

    /**
     * Withdraw funds
     */
    async requestWithdrawal(ownerId, amount, bankDetails) {
        if (amount < 5000) {
            throw new Error('Minimum withdrawal amount is N5,000');
        }

        return await prisma.$transaction(async (tx) => {
            const wallet = await tx.wallets.findUnique({
                where: { owner_id: ownerId }
            });

            if (!wallet || wallet.available_balance < amount) {
                throw new Error('Insufficient balance');
            }

            const updatedWallet = await tx.wallets.update({
                where: { owner_id: ownerId },
                data: {
                    available_balance: { decrement: amount }
                }
            });

            const withdrawal = await tx.withdrawal_requests.create({
                data: {
                    wallet_id: updatedWallet.id,
                    amount: amount,
                    bank_details: bankDetails,
                    status: 'PENDING'
                }
            });

            await tx.wallet_transactions.create({
                data: {
                    wallet_id: updatedWallet.id,
                    type: 'WITHDRAWAL',
                    amount: amount,
                    description: 'Withdrawal request initiated',
                    reference_id: withdrawal.id
                }
            });

            return withdrawal;
        });
    }

    async getBalance(ownerId) {
        return await prisma.wallets.findUnique({
            where: { owner_id: ownerId }
        });
    }

    async getTransactions(ownerId) {
        const wallet = await this.getOrCreateWallet(ownerId);
        return await prisma.wallet_transactions.findMany({
            where: { wallet_id: wallet.id },
            orderBy: { created_at: 'desc' }
        });
    }
}

module.exports = new WalletService();
