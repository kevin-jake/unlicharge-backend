const AB = require("../../../server/models/ActiveBalancer");
const checkAuth = require("../../../util/check-auth");
const {
  cudValidate,
  editDeleteOperation,
} = require("../../../util/crud-functions");
const { validateABInput } = require("../../../util/validators");

module.exports = {
  Query: {
    //   Get all bms list in the database.
    // This only gets Approved and Verified publish_statuses for user that is not the owner.
    async getActiveBalancers(_, { userId }) {
      var filter = { publish_status: ["Request", "Approved", "Verified"] };

      if (userId === "6329ad7d621d3b2c46426d3e") {
        filter = {};
      } else {
        filter.$or = [
          { creator: userId, publish_status: "Request" },
          { publish_status: ["Approved", "Verified"] },
        ];
      }
      try {
        const activeBalancers = await AB.find(filter).populate("creator"); //.sort({ createdAt: -1 });
        return activeBalancers;
      } catch (err) {
        throw new Error(err);
      }
    },

    //   Get a single AB on the list in the database
    async getAB(_, { abId }) {
      var filter = {
        _id: abId,
        publish_status: ["Request", "Approved", "Verified"],
      };

      // If admin condition
      if (userId === "6329ad7d621d3b2c46426d3e") {
        filter = {};
      } else {
        filter = { _id: abId };
      }
      try {
        const bms = await AB.findOne(filter);
        if (bms) return bms;
        else {
          throw new Error("Active Balancer not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // TODO: Add completely remove the record or data
    // Create bms requests into the database
    async createAB(_, { abInput }, context) {
      const {
        name,
        brand,
        strings,
        balance_current,
        balancing,
        price,
        supplier,
      } = abInput;
      const user = checkAuth(context);
      cudValidate(abInput, validateABInput);
      const newAB = new AB({
        name,
        brand,
        strings,
        balance_current,
        balancing,
        price,
        supplier,
        publish_status: "Request",
        creator: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const ret = await newAB.save(
        AB.populate(newAB, { path: "creator" }, function (err, res) {
          if (err) {
            throw new Error(err);
          }
          return {
            ...res._doc,
            id: res._id,
            creator: { ...res.creator, id: res.creator._id },
          };
        })
      );
      console.log(ret);
      return ret;
    },
    // Edit bms requests into the database
    async editAB(_, { abId, abInput }, context) {
      const user = checkAuth(context);
      cudValidate(abInput, validateABInput);
      return editDeleteOperation(
        abId,
        abInput,
        user,
        _,
        "EDIT_",
        "ActiveBalancer"
      );
    },
    // Delete bms requests into the database
    async deleteAB(_, { abId, reason }, context) {
      const user = checkAuth(context);
      return editDeleteOperation(
        abId,
        abInput,
        user,
        reason,
        "DELETE_",
        "ActiveBalancer"
      );
    },
  },
};