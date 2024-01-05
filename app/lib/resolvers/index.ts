import InvestmentWallet from "./InvestmentWallet";
// import other resolvers...

const resolvers = {
	Query: {
		...InvestmentWallet.Query,
		// spread other query resolvers...
	},
	Mutation: {
		...InvestmentWallet.Mutation,
		// spread other mutation resolvers...
	},
  ...InvestmentWallet.Object,
};

export default resolvers;
