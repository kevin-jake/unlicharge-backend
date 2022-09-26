const { mongoose } = require("mongoose");
const BMS = require("../../../server/models/BMS");
const checkAuth = require("../../../util/check-auth");
const {
  cudValidate,
  editDeleteOperation,
} = require("../../../util/crud-functions");
const { validateBMSInput } = require("../../../util/validators");

module.exports = {
  Query: {
    //   Get all battery list in the database
    async getBatteries(_, { userId }) {
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
        const batteries = await BMS.find(filter).populate("creator"); //.sort({ createdAt: -1 });
        return batteries;
      } catch (err) {
        throw new Error(err);
      }
    },

    //   Get a single battery on the list in the database
    async getBMS(_, { battId }) {
      try {
        const batt = await BMS.findById(battId);
        if (batt) return batt;
        else {
          throw new Error("BMS not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // TODO: Add completely remove the record or data
    // Create battery requests into the database
    async createBMS(_, { batteryInput }, context) {
      const {
        name,
        type,
        model,
        nominal_voltage,
        capacity,
        price_per_pc,
        min_voltage,
        max_voltage,
        supplier,
      } = batteryInput;
      const user = checkAuth(context);
      cudValidate(batteryInput, validateBMSInput);
      const newBatt = new BMS({
        name,
        type,
        model,
        nominal_voltage,
        capacity,
        price_per_pc,
        min_voltage,
        max_voltage,
        supplier,
        publish_status: "Request",
        creator: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const ret = await newBatt.save(
        BMS.populate(newBatt, { path: "creator" }, function (err, res) {
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
    // Edit battery requests into the database
    async editBMS(_, { battId, batteryInput }, context) {
      const user = checkAuth(context);
      cudValidate(batteryInput, validateBMSInput);
      return editDeleteOperation(battId, batteryInput, user, _, "EDIT_", "BMS");
    },
    // Delete battery requests into the database
    async deleteBMS(_, { battId, reason }, context) {
      const user = checkAuth(context);
      return editDeleteOperation(
        battId,
        batteryInput,
        user,
        reason,
        "DELETE_",
        "BMS"
      );
    },
  },
};
