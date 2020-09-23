import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./hello";
import { PostResolver } from "./post";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  (await orm)
    .getMigrator()
    .up()
    .catch((err) => {
      console.error(err);
    });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em})
  });

  apolloServer.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log("server is running");
  });
};

main().catch((err) => {
  console.error(err);
});
