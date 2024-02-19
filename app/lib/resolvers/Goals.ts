import { Context } from "@/app/api/graphql/route";

const Goals = {
	Query: {
		goals: async (_parent: any, _args: any, context: Context) => {
			return await context.prisma.goals.findMany();
		},
		goal: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.goals.findUnique({
				where: {
					id: args.id,
				},
			});
		},
	},
	Object: {
		Goals: {
			transaction: async (parent: any, _args: any, context: Context) => {
				return await context.prisma.transaction.findMany({
					where: {
						goalId: parent.id,
					},
				});
			},
		},
	},
	Mutation: {
		createGoal: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.goals.create({
				data: {
					name: args.name,
					goal: args.goal,
					currentValue: args.currentValue,
					initialDate: args.initialDate,
					deadline: args.deadline,
					endDate: args.endDate,
					profileId: args.profileId,
				},
			});
		},
		updateGoal: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.goals.update({
				where: {
					id: args.id,
				},
				data: {
					name: args.name,
					goal: args.goal,
					initialDate: args.initialDate,
					deadline: args.deadline,
					endDate: args.endDate,
					currentValue: args.currentValue,
				},
			});
		},
		deleteGoal: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.goals.delete({
				where: {
					id: args.id,
				},
			});
		},
	},
};

export default Goals;
