import { Context } from "@/app/api/graphql/route";
import Wallet from "./Wallet";

const Investment = {
	Query: {
		investments: async (_parent: any, _args: any, context: Context) => {
			return await context.prisma.investment.findMany();
		},
		investment: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.investment.findUnique({
				where: { id: args.id },
				include: { relatedInvestments: true },
			});
		},
		openInvestments: async (_parent: any, _args: any, context: Context) => {
			return await context.prisma.investment.findMany({
				where: { type: "BUY", remainQuantity: { gt: 0 } },
				include: { relatedInvestments: true },
			});
		},
	},
	Mutation: {
		createInvestment: async (_parent: any, args: any, context: Context) => {
			const wallet = await Wallet.Query.wallet(
				null,
				{ id: args.walletId },
				context
			);
			if (!wallet) throw new Error("Wallet not found");

			const updatedOperationPrice = args.price * args.quantity;

			if (args.type === "BUY" && wallet.balance < updatedOperationPrice)
				throw new Error("Insufficient funds");

			Wallet.Mutation.updateWallet(
				null,
				{
					id: wallet.id,
					balance:
						wallet.balance +
						updatedOperationPrice * (args.type === "BUY" ? -1 : 1),
				},
				context
			);

			if (args.type === "SELL") {
				const investment = await context.prisma.investment.findUnique({
					where: {
						id: args.relationInvestmentId,
					},
				});
				if (!investment) throw new Error("Investment not found");

				if (investment.remainQuantity >= args.quantity) {
					await context.prisma.investment.update({
						where: {
							id: args.relationInvestmentId,
						},
						data: {
							remainQuantity: investment.remainQuantity - args.quantity,
						},
					});
				} else throw new Error("Can't sell more than you have");
			}

			return await context.prisma.investment.create({
				data: {
					investmentDate: args.investmentDate,
					price: args.price,
					quantity: args.quantity,
					remainQuantity: args.type === "BUY" ? args.quantity : 0,
					stock: args.stock,
					category: args.category,
					type: args.type,
					walletId: args.walletId,
					relationInvestmentId: args.relationInvestmentId,
				},
			});
		},
		updateInvestment: async (_parent: any, args: any, context: Context) => {
			const investment = await Investment.Query.investment(
				null,
				{ id: args.id },
				context
			);
			if (!investment) throw new Error("Investment not found");

			if (args.price || args.quantity) {
				const updatedPrice =
					(args.price ?? investment.price) *
					(args.quantity ?? investment.quantity);
				const latestPrice = investment.price * investment.quantity;
				const updatedPriceWithType =
					investment.type === "SELL"
						? updatedPrice - latestPrice
						: latestPrice - updatedPrice;

				const wallet = await Wallet.Query.wallet(
					null,
					{ id: investment.walletId },
					context
				);
				if (!wallet) throw new Error("Wallet not found");

				if (wallet.balance < updatedPriceWithType)
					throw new Error("Insufficient funds");

				Wallet.Mutation.updateWallet(
					null,
					{
						id: wallet.id,
						balance: wallet.balance + updatedPriceWithType,
					},
					context
				);
			}

			if (args.quantity) {
				if (investment.type === "SELL") {
					const relatedInvestment = await Investment.Query.investment(
						null,
						{ id: investment.relationInvestmentId },
						context
					);
					if (!relatedInvestment) throw new Error("Investment not found");

					if (
						relatedInvestment.remainQuantity >=
						args.quantity - investment.quantity
					) {
						await context.prisma.investment.update({
							where: {
								id: relatedInvestment.id,
							},
							data: {
								remainQuantity:
									relatedInvestment.remainQuantity +
									investment.quantity -
									args.quantity,
							},
						});
					} else throw new Error("Can't sell more than you have");
				} else {
					if (
						investment.remainQuantity <=
						args.quantity - investment.quantity
					) {
						await context.prisma.investment.update({
							where: {
								id: investment.id,
							},
							data: {
								remainQuantity: investment.remainQuantity + args.quantity - investment.quantity,
							},
						});
					} else throw new Error("You cannot have bought less than you sold");
				}
			}

			return await context.prisma.investment.update({
				where: {
					id: args.id,
				},
				data: {
					investmentDate: args.investmentDate,
					price: args.price,
					quantity: args.quantity,
					remainQuantity: args.remainQuantity,
					category: args.category,
					type: args.type,
					walletId: args.walletId,
					relationInvestmentId: args.relationInvestmentId,
				},
			});
		},
		deleteInvestment: async (_parent: any, args: any, context: Context) => {
			const investment = await context.prisma.investment.findUnique({
				where: { id: args.id },
				include: { relatedInvestments: true },
			});
			if (!investment) throw new Error("Investment not found");

			let updatedPrice: number = 0;
			if (investment.type === "BUY") {
				investment.relatedInvestments.forEach(async (relatedInvestment) => {
					updatedPrice +=
						relatedInvestment.price * relatedInvestment.quantity * -1;
				});
			}
			updatedPrice +=
				investment.price *
				investment.quantity *
				(investment.type === "BUY" ? 1 : -1);
			const wallet = await Wallet.Query.wallet(
				null,
				{ id: investment.walletId },
				context
			);
			if (!wallet) throw new Error("Wallet not found");

			Wallet.Mutation.updateWallet(
				null,
				{
					id: investment.walletId,
					balance: wallet.balance + updatedPrice,
				},
				context
			);
			investment.relatedInvestments.forEach(async (relatedInvestment) => {
				await context.prisma.investment.delete({
					where: {
						id: relatedInvestment.id,
					},
				});
			});

			if (investment.type === "SELL") {
				const relatedInvestment = await context.prisma.investment.findUnique({
					where: {
						id: investment.relationInvestmentId!,
					},
				});
				if (!relatedInvestment) throw new Error("Investment not found");
				await context.prisma.investment.update({
					where: {
						id: relatedInvestment.id,
					},
					data: {
						remainQuantity:
							relatedInvestment.remainQuantity + investment.quantity,
					},
				});
			}
			return await context.prisma.investment.delete({
				where: {
					id: args.id,
				},
			});
		},
	},
};

export default Investment;
