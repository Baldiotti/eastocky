import { Context } from "@/app/api/graphql/route";

const Wallet = {
	Query: {
		wallets: async (_parent: any, _args: any, context: Context) => {
			return await context.prisma.wallet.findMany();
		},
		wallet: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.wallet.findUnique({
				where: {
					id: args.id,
				},
			});
		},
	},
	Object: {
		Wallet: {
			investments: async (parent: any, _args: any, context: Context) => {
				return await context.prisma.investment.findMany({
					where: {
						walletId: parent.id,
					},
				});
			},
			transactions: async (parent: any, _args: any, context: Context) => {
				return await context.prisma.transaction.findMany({
					where: {
						walletId: parent.id,
					},
				});
			},
		},
	},
	Mutation: {
		createWallet: async (
			_parent: any,
			args: any,
			context: Context
		) => {
			return await context.prisma.wallet.create({
				data: {
					name: args.name,
					balance: args.balance,
					userId: args.userId,
				},
			});
		},
		updateWallet: async (
			_parent: any,
			args: any,
			context: Context
		) => {
			return await context.prisma.wallet.update({
				where: {
					id: args.id,
				},
				data: {
					name: args.name,
          balance: args.balance,
				},
			});
		},
    deleteWallet: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.wallet.delete({
				where: {
					id: args.id,
				},
			});
		},
	},
};

export default Wallet;
