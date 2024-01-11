const Category = `#graphql
  type Category {
    id: ID!
    name: String!
    isActive: Boolean!
    transaction: [Transaction]
  }

  extend type Query {
		categoriesActive: [Category]
		categoriesDisable: [Category]
		category(id: ID!): Category
  }

  extend type Mutation {
    createCategory(
      name: String!
    ): Category
    updateCategory(
      id: ID!
      name: String!
    ): Category
    deleteCategory(
      id: ID!
    ): Category
  }
`;

export default Category;