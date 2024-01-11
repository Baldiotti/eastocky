const Transaction = `#graphql
  type Transaction {
    id: ID!
    description: String
    date: String
    value: Float!
    type: TransactionType!
    walletId: ID!
    categoryId: ID
    destinationWalletId: ID
    goalId: ID
  }

	enum TransactionType {
    EXPENSE
		GOAL
    INCOME
		TRANSFER
	}

  extend type Query {
		transactions: [Transaction]
		transaction(id: ID!): Transaction
  }

  extend type Mutation {
    createTransaction(
      description: String
      date: String
      value: Float!
      type: TransactionType!
      walletId: ID!
      categoryId: ID
      destinationWalletId: ID
      goalId: ID
    ): Transaction
    updateTransaction(
      id: ID!
      description: String
      date: String
      value: Float
      type: TransactionType
      walletId: ID
      categoryId: ID
      destinationWalletId: ID
      goalId: ID
    ): Transaction
    deleteTransaction(
      id: ID!
    ): Transaction
  }
`;

export default Transaction;