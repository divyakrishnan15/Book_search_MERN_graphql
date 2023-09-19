const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');



const resolvers = {
    Query:{
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
        if(context.user) {
          const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
        
        return userData;
        }
  
        throw new AuthenticationError('Not logged in');
      }
    },



    Mutation:{


        login:async(parent, {email,password})=>{
            const user = await User.findOne({email})
            if (!user) {
                throw new AuthenticationError('No User with this email found!');
              }
            const correctPw = await user.isCorrectPassword(password)

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
              }
            
      const token = signToken(profile);
      return { token, user };
        },



        addUser:async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
      
            return { token, user };
          },



        saveBook:async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                  );
                  return updatedUser;
                }
                throw new AuthenticationError('You need to be logged in!')
              },

        // removeBook:async (parent, { bookId }, context) => {
        //     if (context.user) {
        //       return User.findOneAndUpdate(
        //         { _id: context.user._id },
        //         { $pull: { savedBooks: {bookId} } },
        //         { new: true }
        //       );
        //     }
        //     throw new AuthenticationError('You need to be logged in!');
        // }


        
        removeBook: async (parent, args, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
              );
              return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!')
          } 

    }
}


module.exports = resolvers;