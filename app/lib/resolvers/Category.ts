import { Context } from "@/app/api/graphql/route";

const Category = {
	Query: {
		categoriesActive: async (_parent: any, _args: any, context: Context) => {
			return await context.prisma.category.findMany({
				where: {
					isActive: true,
				},
			});
		},
		categoriesDisable: async (_parent: any, _args: any, context: Context) => {
			return await context.prisma.category.findMany({
				where: {
					isActive: false,
				},
			});
		},
		category: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.category.findUnique({
				where: {
					id: args.id,
				},
			});
		},
	},
	Object: {
		Category: {
			transaction: async (parent: any, _args: any, context: Context) => {
				return await context.prisma.transaction.findMany({
					where: {
						categoryId: parent.id,
					},
				});
			},
		},
	},
	Mutation: {
		createCategory: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.category.create({
				data: {
					name: args.name,
				},
			});
		},
		updateCategory: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.category.update({
				where: {
					id: args.id,
				},
				data: {
					name: args.name,
				},
			});
		},
		deleteCategory: async (_parent: any, args: any, context: Context) => {
			return await context.prisma.category.update({
				where: {
					id: args.id,
				},
				data: { isActive: false },
			});
		},
	},
};

export default Category;
