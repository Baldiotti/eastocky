const Goals = `#graphql
  type Goals {
    id: ID!
		name: String!
		goal: Float!
		currentValue: Float
		initialDate: String
		deadline: String!
		endDate: String
		userId: ID!
		transaction: [Transaction]
  }

  extend type Query {
		goals: [Goals]
		goal(id: ID!): Goals
  }

  extend type Mutation {
    createGoal(
			name: String!
			goal: Float!
			currentValue: Float
			initialDate: String
			deadline: String!
			endDate: String
			userId: String!
		): Goals
		updateGoal(
      id: ID!
			name: String
			goal: Float
			initialDate: String
			deadline: String
			endDate: String
    ): Goals
    deleteGoal(
      id: ID!
    ): Goals
  }
`;

export default Goals;
