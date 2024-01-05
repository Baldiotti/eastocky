import InvestmentWallet from "../../lib/typeDefs/InvestmentWallet";

const typeDefs = `#graphql
  ${InvestmentWallet}
  type Query 
  type Mutation
`;

export default typeDefs;
