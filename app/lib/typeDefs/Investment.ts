const Investment = `#graphql
  type Investment {
    id: ID!
    investmentDate: String
    price: Float!
    quantity: Float!
    remainQuantity: Float
    stock: String!
    category: InvestmentCategory!
    type: OperationInvestmentType!
    relationInvestmentId: String
    walletId: ID!
    relatedInvestments: [Investment]
  }

  enum OperationInvestmentType {
    BUY
    SELL
  }
  
  enum InvestmentCategory {
    ACAO
    FII
    BDR
    CRYPTO
    STOCK
  }

  extend type Query {
		investments: [Investment]
		investment(id: ID!): Investment
    openInvestments: [Investment]
  }

  extend type Mutation {
    createInvestment(
      investmentDate: String
      price: Float!
      quantity: Float!
      remainQuantity: Float
      stock: String!
      category: InvestmentCategory!
      type: OperationInvestmentType!
      walletId: ID!
      relationInvestmentId: String
    ): Investment
    updateInvestment(
      id: ID!
      remainQuantity: Float

      investmentDate: String
      price: Float
      quantity: Float
      category: InvestmentCategory
      type: OperationInvestmentType
      walletId: ID
    ): Investment
    deleteInvestment(
      id: ID!
    ): Investment
  }
`;

export default Investment;
