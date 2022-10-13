const Battery = require("../../../server/models/Battery");
const checkAuth = require("../../../util/check-auth");
const {
  cudValidate,
  editDeleteOperation,
} = require("../../../util/crud-functions");
const { validateBatteryInput } = require("../../../util/validators");

module.exports = {
  Query: {
    //   Get all battery list in the database
    // This only gets Approved and Verified publish_statuses for user that is not the owner.
    async getBatteries(_, { userId }) {
      var filter = { publish_status: ["Request", "Approved", "Verified"] };

      if (userId === "634684e1659d6cb340997577") {
        filter = {};
      } else {
        filter.$or = [
          { creator: userId, publish_status: "Request" },
          { publish_status: ["Approved", "Verified"] },
        ];
      }
      try {
        const batteries = await Battery.find(filter).populate("creator"); //.sort({ createdAt: -1 });
        return batteries;
      } catch (err) {
        throw new Error(err);
      }
    },

    //   Get a single battery on the list in the database
    async getBattery(_, { battId }) {
      var filter = {
        _id: battId,
        publish_status: ["Request", "Approved", "Verified"],
      };

      // If admin condition
      if (userId === "634684e1659d6cb340997577") {
        filter = {};
      } else {
        filter = { _id: battId };
      }
      try {
        const batt = await Battery.findOne(filter);
        if (batt) return batt;
        else {
          throw new Error("Battery not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // TODO: Add completely remove the record or data
    // Create battery requests into the database
    async createBattery(_, { batteryInput }, context) {
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
        image_url,
      } = batteryInput;
      const user = checkAuth(context);
      cudValidate(batteryInput, validateBatteryInput);
      const newBatt = new Battery({
        name,
        type,
        model,
        nominal_voltage,
        capacity,
        price_per_pc,
        min_voltage,
        max_voltage,
        supplier,
        image_url,
        publish_status: "Request",
        creator: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const ret = await newBatt.save(
        Battery.populate(newBatt, { path: "creator" }, function (err, res) {
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
    async editBattery(_, { battId, batteryInput }, context) {
      const user = checkAuth(context);
      cudValidate(batteryInput, validateBatteryInput);
      return editDeleteOperation(
        battId,
        batteryInput,
        user,
        _,
        "EDIT_",
        "Battery"
      );
    },
    // Delete battery requests into the database
    async deleteBattery(_, { battId, reason }, context) {
      const user = checkAuth(context);
      return editDeleteOperation(battId, _, user, reason, "DELETE_", "Battery");
    },
  },
};
