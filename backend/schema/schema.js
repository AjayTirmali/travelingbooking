const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } = require("graphql");
const Booking = require("../models/Booking");

// Define Booking Type
const BookingType = new GraphQLObjectType({
  name: "Booking",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    destination: { type: GraphQLString },
    date: { type: GraphQLString },
  },
});

// Define Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    bookings: {
      type: new GraphQLList(BookingType),
      resolve() {
        return Booking.find();
      },
    },
  },
});

// Define Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBooking: {
      type: BookingType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        destination: { type: GraphQLString },
        date: { type: GraphQLString },
      },
      async resolve(_, args) {
        try {
          const booking = new Booking(args);
          return await booking.save();
        } catch (error) {
          throw new Error("Error saving booking: " + error.message);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
