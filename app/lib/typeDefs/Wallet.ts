const Wallet = `#graphql
  type Wallet {
    id: ID!
    name: String!
    balance: Float
    userId: ID!
    investments: [Investment]!
    transactions: [Transaction]!
  }

  extend type Query {
		wallets: [Wallet]
		wallet(id: ID!): Wallet
  }

  extend type Mutation {
    createWallet(
      name: String!
      balance: Float
      userId: ID!
    ): Wallet
    updateWallet(
      id: ID!
      name: String
      balance: Float
    ): Wallet
    deleteWallet(
      id: ID!
    ): Wallet
  }
`;

export default Wallet;