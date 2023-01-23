import User from "../models/User.js";

/* READ */
// GET Users list
export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new Error("Fetching users failed, please try again later.");
    error.status = 500;
    console.log(err);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// GET User by ID
export const getUsersById = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(req.params);
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new Error("Something went wrong, could not find the User.");
    error.status = 500;
    console.log(err);
    return next(error);
  }

  if (!user) {
    const error = new Error("Could not find User for the provided uid.");
    error.status = 404;
    console.log(err);
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

/* UPDATE */
// TODO: Add update users / profile information
// export const addRemoveFriend = async (req, res) => {
//   try {
//     const { id, friendId } = req.params;
//     const user = await User.findById(id);
//     const friend = await User.findById(friendId);

//     if (user.friends.includes(friendId)) {
//       user.friends = user.friends.filter((id) => id !== friendId);
//       friend.friends = friend.friends.filter((id) => id !== id);
//     } else {
//       user.friends.push(friendId);
//       friend.friends.push(id);
//     }
//     await user.save();
//     await friend.save();

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, occupation, location, picturePath }) => {
//         return { _id, firstName, lastName, occupation, location, picturePath };
//       }
//     );

//     res.status(200).json(formattedFriends);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };
