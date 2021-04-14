const { ApolloServer, gql } = require('apollo-server-express');
// Although 'express' has not been installed yet, It has been used in the background so we can import it.
const express = require('express');
const path = require('path');
const fs = require('fs');

const typeDefs = gql`
  type File {
    url: String!
  }

  type Query {
    uploads: [File]
  }

  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    uploadFile: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const stream = createReadStream();
      const pathName = path.join(__dirname, `/public/images/${filename}`);
      await stream.pipe(fs.createWriteStream(pathName));

      return {
        url: `http://localhost:4000/images/${filename}`
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
server.applyMiddleware({ app });

app.use(express.static('public'));

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000`);
});
