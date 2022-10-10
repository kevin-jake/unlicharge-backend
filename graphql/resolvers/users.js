const User = require("../../server/models/User");
const bcrypt = require("bcryptjs");
const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const jwtGenerateToken = require("../../util/jwt-generate-token");

module.exports = {
  Query: {
    async getUsers(_, { username }) {
      if (username === "adminjek") {
        var retArr = [];
        try {
          const users = await User.find().sort({ last_login: -1 });
          users.map((user) => retArr.push({ ...user._doc, id: user._id }));
          return retArr;
        } catch (err) {
          throw new Error(err);
        }
      } else throw new AuthenticationError("Action not allowed");
    },
  },
  Mutation: {
    async login(_, { username, password }, context, info) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }
      const token = jwtGenerateToken(user);

      // add last login to check active users
      user.last_login = new Date().toISOString();

      try {
        await user.save();
      } catch (err) {
        throw new UserInputError("Something went wrong. Could not login", {
          errors,
        });
      }

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      {
        registerInput: {
          username,
          email,
          password,
          confirmPassword,
          mobile_number,
          signed_using,
          address,
        },
      },
      context,
      info
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is already taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        mobile_number,
        signed_using: signed_using || "App",
        address,
        createdAt: new Date().toISOString(),
        last_login: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
