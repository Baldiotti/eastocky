import Category from "./Category";
import Goals from "./Goals";
import Transaction from "./Transaction";
import Wallet from "./Wallet";
// import other resolvers...

const resolvers = {
	Query: {
		...Category.Query,
		...Goals.Query,
		...Transaction.Query,
		...Wallet.Query,
		// spread other query resolvers...
	},
	Mutation: {
		...Category.Mutation,
		...Goals.Mutation,
		...Transaction.Mutation,
		...Wallet.Mutation,
		// spread other mutation resolvers...
	},
	...Category.Object,
	...Goals.Object,
	...Wallet.Object,
};

export default resolvers;
