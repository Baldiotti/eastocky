import { Context } from "@/app/api/graphql/route";

const InvestmentWallet = {
	Query: {
		investmentWallets: async (_parent: any, _args: any, context: Context) => {
			return await context.prisma.investmentWallet.findMany();
		},
		investmentWallet: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.investmentWallet.findUnique({
				where: {
					id: args.id,
				},
			});
		},
	},
	Object: {
		InvestmentWallet: {
			investment: async (parent: any, _args: any, context: Context) => {
				return await context.prisma.investment.findMany({
					where: {
						investmentWalletId: parent.id,
					},
				});
			},
		},
	},
	Mutation: {
		createInvestmentWallet: async (
			_parent: any,
			args: any,
			context: Context
		) => {
			return await context.prisma.investmentWallet.create({
				data: {
					name: args.name,
					balance: args.balance,
					userId: args.userId,
					region: args.region,
					Investment: args.Investment,
				},
			});
		},
		updateInvestmentWallet: async (
			_parent: any,
			args: any,
			context: Context
		) => {
			return await context.prisma.investmentWallet.update({
				where: {
					id: args.id,
				},
				data: {
					name: args.name,
					region: args.region,
				},
			});
		},
    deleteInvestmentWallet: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.investmentWallet.delete({
				where: {
					id: args.id,
				},
			});
		},
	},
};

export default InvestmentWallet;
