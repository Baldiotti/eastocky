import Category from "../../lib/typeDefs/Category";
import Wallet from "../../lib/typeDefs/Wallet";
import Transaction from "../../lib/typeDefs/Transaction";
import Investment from "../../lib/typeDefs/Investment";
import Goals from "../../lib/typeDefs/Goals";

const typeDefs = `#graphql
  ${Goals}
  ${Investment}
  ${Transaction}
  ${Wallet}
  ${Category}
  type Query 
  type Mutation
`;

export default typeDefs;
