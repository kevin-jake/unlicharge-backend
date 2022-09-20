const { UserInputError } = require("apollo-server-express");
const Battery = require("../../../server/models/Battery");
const User = require("../../../server/models/User");
const checkAuth = require("../../../util/check-auth");
const { validateBatteryInput } = require("../../../util/validators");

module.exports = {
  Query: {
    //   Get all battery list in the database
    async getBatteries(_, { publish_status }) {
      const filter = {};
      if (publish_status) {
        filter.publish_status = publish_status;
      }
      try {
        const batteries = await Battery.find(filter).populate("creator"); //.sort({ createdAt: -1 });
        return batteries;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getBattery(_, { battId }) {
      try {
        const batt = await Battery.findById(battId);
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
    async createBattery(
      _,
      {
        batteryInput: {
          name,
          type,
          model,
          nominal_voltage,
          capacity,
          price_per_pc,
          min_voltage,
          max_voltage,
          publish_status,
          supplier,
        },
      },
      context
    ) {
      const user = checkAuth(context);

      const { valid, errors } = validateBatteryInput(
        name,
        type,
        model,
        nominal_voltage,
        capacity,
        price_per_pc,
        min_voltage,
        max_voltage
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

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
        publish_status: publish_status || "Request",
        creator: user.id,
        createdAt: new Date().toISOString(),
      });
      const res = await newBatt.save();

      return { ...res._doc, id: res._id, creator: user };
    },
  },
};
