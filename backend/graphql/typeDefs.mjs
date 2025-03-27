import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Date

  type Booking {
    id: ID!
    name: String!
    email: String!
    destination: String!
    date: String!
    createdAt: String
  }

  type Query {
    getBookings: [Booking]
    getActiveBookings: [Booking]
  }

  type Mutation {
    addBooking(name: String!, email: String!, destination: String!, date: String!): Booking
    deleteBooking(id: ID!): DeleteResponse
  }

  type DeleteResponse {
    success: Boolean!
    message: String
  }
`;

export default typeDefs;