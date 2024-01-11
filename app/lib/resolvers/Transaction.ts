import { Context } from "@/app/api/graphql/route";
import Wallet from "./Wallet";
import Goals from "./Goals";
import { Goals as GoalsType, Wallet as WalletType } from "@prisma/client";

const Transaction = {
	Query: {
		transactions: async (context: Context) => {
			return await context.prisma.transaction.findMany();
		},
		transaction: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.transaction.findUnique({
				where: {
					id: args.id,
				},
			});
		},
	},
	Mutation: {
		createTransaction: async (_parent: any, args: any, context: Context) => {
			const wallet = await Wallet.Query.wallet(
				null,
				{ id: args.walletId },
				context
			);

			if (!wallet) throw new Error("Wallet not found");

			try {
				switch (args.type) {
					case "EXPENSE":
						await withdrawValueToWalletOrGoal(wallet, args.value, context);
						break;
					case "INCOME":
						await depositValueToWalletOrGoal(wallet, args.value, context);
						break;
					case "TRANSFER":
						const destinationWallet = await Wallet.Query.wallet(
							null,
							{ id: args.destinationWalletId },
							context
						);
						if (!destinationWallet)
							throw new Error("Destination wallet not found");
						await withdrawValueToWalletOrGoal(wallet, args.value, context);
						await depositValueToWalletOrGoal(
							destinationWallet,
							args.value,
							context
						);
						break;
					case "GOAL":
						const destinationGoal = await Goals.Query.goal(
							null,
							{ id: args.goalId },
							context
						);
						if (!destinationGoal) throw new Error("Goal not found");
						await withdrawValueToWalletOrGoal(wallet, args.value, context);
						await depositValueToWalletOrGoal(
							destinationGoal,
							args.value,
							context
						);
						break;
					default:
						break;
				}
			} catch (error) {
				const updatedWithdrawValue: number =
					args.value > 0 ? args.value * -1 : args.value;
				await Wallet.Mutation.updateWallet(
					null,
					{
						id: args.walletId,
						balance: updatedWithdrawValue * -1 + wallet.balance,
					},
					context
				);
				console.log(error);
				return;
			}

			return await context.prisma.transaction.create({
				data: {
					description: args.description,
					date: args.date,
					value: args.value,
					type: args.type,
					walletId: args.walletId,
					categoryId: args.categoryId,
					destinationWalletId: args.destinationWalletId,
					goalId: args.goalId,
				},
			});
		},
		updateTransaction: async (_parent: any, args: any, context: Context) => {
			const transaction = await context.prisma.transaction.findUnique({
				where: {
					id: args.id,
				},
			});

			if (!transaction?.id) throw new Error("Transaction not found");

			const updatedValue = args.value ? args.value - transaction.value : 0;
			if (updatedValue !== 0) {
				const wallet = await Wallet.Query.wallet(
					null,
					{ id: transaction.walletId },
					context
				);
				if (!wallet?.id) throw new Error("Wallet not found");
				switch (transaction?.type) {
					case "EXPENSE":
						updatedValue < 0
							? await depositValueToWalletOrGoal(wallet, updatedValue, context)
							: await withdrawValueToWalletOrGoal(
									wallet,
									updatedValue,
									context
							  );
						break;
					case "INCOME":
						updatedValue < 0
							? await withdrawValueToWalletOrGoal(wallet, updatedValue, context)
							: await depositValueToWalletOrGoal(wallet, updatedValue, context);
						break;
					case "TRANSFER":
						const destinationWallet = await Wallet.Query.wallet(
							null,
							{ id: transaction.destinationWalletId },
							context
						);
						if (!destinationWallet)
							throw new Error("Destination wallet not found");
						if (updatedValue < 0) {
							await depositValueToWalletOrGoal(wallet, updatedValue, context);
							await withdrawValueToWalletOrGoal(
								destinationWallet,
								updatedValue,
								context
							);
						} else {
							await depositValueToWalletOrGoal(
								destinationWallet,
								updatedValue,
								context
							);
							await withdrawValueToWalletOrGoal(wallet, updatedValue, context);
						}
						break;
					case "GOAL":
						const destinationGoal = await Goals.Query.goal(
							null,
							{ id: transaction.goalId },
							context
						);
						if (!destinationGoal) throw new Error("Goal not found");
						if (updatedValue < 0) {
							await depositValueToWalletOrGoal(wallet, updatedValue, context);
							await Goals.Mutation.updateGoal(
								null,
								{
									id: destinationGoal.id,
									currentValue:
										updatedValue * -1 + destinationGoal.currentValue,
								},
								context
							);
						} else {
							await depositValueToWalletOrGoal(
								destinationGoal,
								updatedValue,
								context
							);
							await withdrawValueToWalletOrGoal(wallet, updatedValue, context);
						}
						break;
					default:
						break;
				}
			}

			return await context.prisma.transaction.update({
				where: {
					id: args.id,
				},
				data: {
					description: args.description,
					date: args.date,
					value: args.value,
					type: args.type,
					walletId: args.walletId,
					categoryId: args.categoryId,
					destinationWalletId: args.destinationWalletId,
					goalId: args.goalId,
				},
			});
		},
		deleteTransaction: async (_parent: any, args: any, context: Context) => {
			const transaction = await context.prisma.transaction.findUnique({
				where: {
					id: args.id,
				},
			});
			if (!transaction?.id) throw new Error("Transaction not found");
			const wallet = await Wallet.Query.wallet(
				null,
				{ id: transaction.walletId },
				context
			);
			if (!wallet?.id) throw new Error("Wallet not found");
			switch (transaction?.type) {
				case "EXPENSE":
					await depositValueToWalletOrGoal(wallet, transaction.value, context);
					break;
				case "INCOME":
					await withdrawValueToWalletOrGoal(wallet, transaction.value, context);
					break;
				case "TRANSFER":
					const destinationWallet = await Wallet.Query.wallet(
						null,
						{ id: transaction.destinationWalletId },
						context
					);
					if (!destinationWallet)
						throw new Error("Destination wallet not found");
					await depositValueToWalletOrGoal(wallet, transaction.value, context);
					await withdrawValueToWalletOrGoal(
						destinationWallet,
						transaction.value,
						context
					);
					break;
				case "GOAL":
					const destinationGoal = await Goals.Query.goal(
						null,
						{ id: transaction.goalId },
						context
					);
					if (!destinationGoal) throw new Error("Goal not found");
					await withdrawValueToWalletOrGoal(
						destinationGoal,
						transaction.value,
						context
					);
					await depositValueToWalletOrGoal(wallet, transaction.value, context);
					break;
			}
			return await context.prisma.transaction.delete({
				where: {
					id: args.id,
				},
			});
		},
	},
};

async function withdrawValueToWalletOrGoal(
	walletOrGoal: WalletType | GoalsType,
	value: number,
	context: Context
) {
	const updatedWithdrawValue: number = value > 0 ? value * -1 : value;
	if ("balance" in walletOrGoal) {
		if (walletOrGoal.balance < value) throw new Error("Insufficient funds");

		Wallet.Mutation.updateWallet(
			null,
			{
				id: walletOrGoal.id,
				balance: updatedWithdrawValue + walletOrGoal.balance,
			},
			context
		);
	} else {
		if (walletOrGoal.currentValue < value)
			throw new Error("Insufficient funds");
		return await Goals.Mutation.updateGoal(
			null,
			{
				id: walletOrGoal.id,
				currentValue: updatedWithdrawValue + walletOrGoal.currentValue,
			},
			context
		);
	}
}

async function depositValueToWalletOrGoal(
	destinationWalletOrGoal: WalletType | GoalsType,
	value: number,
	context: Context
) {
	const updatedDepositValue: number = value < 0 ? value * -1 : value;

	if ("balance" in destinationWalletOrGoal) {
		return await Wallet.Mutation.updateWallet(
			null,
			{
				id: destinationWalletOrGoal.id,
				balance: updatedDepositValue + destinationWalletOrGoal.balance,
			},
			context
		);
	} else {
		return await Goals.Mutation.updateGoal(
			null,
			{
				id: destinationWalletOrGoal.id,
				currentValue:
					updatedDepositValue + destinationWalletOrGoal.currentValue,
			},

			context
		);
	}
}

export default Transaction;
