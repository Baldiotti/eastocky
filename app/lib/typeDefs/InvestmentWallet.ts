const InvestmentWallet = `#graphql
  type InvestmentWallet {
    id: ID!
    name: String!
    balance: Float
    region: RegionInvestment!
    investment: [Investment]
    userId: ID!
  }

  extend type Query {
		investmentWallets: [InvestmentWallet]
		investmentWallet(id: ID!): InvestmentWallet
  }

  extend type Mutation {
    createInvestmentWallet(
      name: String!
      balance: Float
      region: RegionInvestment!
      userId: ID!
    ): InvestmentWallet
    updateInvestmentWallet(
      id: ID!
      name: String
      region: RegionInvestment
    ): InvestmentWallet
    deleteInvestmentWallet(
      id: ID!
    ): InvestmentWallet
  }
`;

export default InvestmentWallet;