import Category from "../../lib/typeDefs/Category";
import Wallet from "../../lib/typeDefs/Wallet";
import Transaction from "../../lib/typeDefs/Transaction";
import Goals from "../../lib/typeDefs/Goals";

const typeDefs = `#graphql
  ${Goals}
  ${Transaction}
  ${Wallet}
  ${Category}
  type Query 
  type Mutation
`;

export default typeDefs;
