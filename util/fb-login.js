const User = require("../server/models/User");
const jwtGenerateToken = require("./jwt-generate-token");

const facebookOptions = {
  //TODO: Change this later
  clientID: "",
  clientSecret: "",
  callbackURL: "http://localhost:5000/auth/facebook/callback",
  profileFields: ["id", "email", "first_name", "last_name"],
};

const facebookCallback = async (accessToken, refreshToken, profile, done) => {
  var response = {};
  const user = await User.findOne({
    fb_id: profile.id,
    signed_using: "Facebook",
  });

  if (user) {
    const token = jwtGenerateToken(user);
    user.last_login = new Date().toISOString();
    try {
      await user.save();
    } catch (err) {
      throw new UserInputError("Something went wrong. Could not login", {
        errors,
      });
    }
    response = {
      ...user._doc,
      id: user._id,
      token,
    };
  } else {
    const newUser = new User({
      email: profile.emails[0].value,
      username: profile.emails[0].value.split("@")[0],
      password: "Test123",
      mobile_number: "00000000000",
      signed_using: "Facebook",
      createdAt: new Date().toISOString(),
      last_login: new Date().toISOString(),
    });
    const res = await newUser.save();
    const token = jwtGenerateToken(res);
    response = {
      ...res._doc,
      id: res._id,
      token,
    };
  }
  console.log(response);
  done(null, response);
};

module.exports = { facebookOptions, facebookCallback };
