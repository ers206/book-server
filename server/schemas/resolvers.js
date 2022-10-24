// from mod see challenge docs 
// thought not needed 
const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('books')
                // .populate('friends'); 
          
              return userData;
            }
          
            throw new AuthenticationError('Not logged in');
          },
    // get all users
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('books');
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            // .populate('friends')
            .populate('books');
        },

        // Error: Query.books defined in resolvers, but not in schema 
        books: async (parent, { username }) => {
          const params = username ? { username } : {};
          return Book.find(params).sort({ createdAt: -1 });
        },
        book: async (parent, { _id }) => {
          return Book.findOne({ _id });
        }

    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
            return { token, user };
          },
           deleteBook: async(parent, arg, context) => {
            if(context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: {bookid: args.bookId }}},
                { new: true }

              );
              return updatedUser;
            }
           },

           saveBook: async (parent, args, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: args }},
                { new: true }
              );
              return updatedUser;
            }
           },
          

        }
    
  };

  module.exports = resolvers;