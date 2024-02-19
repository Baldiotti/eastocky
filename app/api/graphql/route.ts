import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import typeDefs from "../../lib/typeDefs/index";
import resolvers from "../../lib/resolvers/index";

export type Context = {
	prisma: PrismaClient;
};

const apolloServer = new ApolloServer<Context>({ typeDefs, resolvers });

export default startServerAndCreateNextHandler(apolloServer, {
	context: async (req, res) => ({ req, res, prisma }),
});