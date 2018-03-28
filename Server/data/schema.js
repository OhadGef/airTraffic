import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Flight {
    icao24: String
    longitude: String
    latitude: String
    geo_altitude: String
    velocity: String
    heading: String
    }
type Query {
  messages: [Flight!]!
}

type Mutation {
    addMessage(message: String!): [String!]!
}

type Subscription {
  messageAdded: [Flight]
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
