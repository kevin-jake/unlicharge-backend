const { UserInputError } = require("apollo-server-express");
const { mongoose } = require("mongoose");
const Battery = require("../../../server/models/Battery");
const checkAuth = require("../../../util/check-auth");
const cudValidate = require("../../../util/create-update-delete-validate");
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
        publish_status: "Request",
        creator: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const res = await newBatt.save();

      return { ...res._doc, id: res._id, creator: user };
    },
    async editBattery(_, { battId, batteryInput }, context) {
      var res = {};
      var battData = {};
      const user = checkAuth(context);
      cudValidate(batteryInput, validateBatteryInput);

      try {
        battData = await Battery.findById(battId).populate("creator");
      } catch (err) {
        throw new Error(err);
      }

      if (battData.creator.username === user.username) {
        try {
          const editId = mongoose.Types.ObjectId();
          const battery = await Battery.findByIdAndUpdate(
            { _id: battId },
            {
              $set: {
                ...batteryInput,
                updatedAt: new Date().toISOString(),
                new_data_from: editId,
                edit_request: [
                  ...battData.edit_request,
                  {
                    ...batteryInput,
                    _id: editId,
                    requestor: user.id,
                    status: "Owner Update",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                ],
              },
            },
            { new: true }
          )
            .populate("creator")
            .populate({
              path: "edit_request",
              populate: {
                path: "requestor",
                model: "User",
              },
            })
            .populate({
              path: "delete_request",
              populate: {
                path: "requestor",
                model: "User",
              },
            }); //.sort({ createdAt: -1 });
          console.log(battery);
          return battery;
        } catch (err) {
          throw new Error(err);
        }
      } else {
        try {
          const battery = await Battery.findByIdAndUpdate(
            { _id: battId },
            {
              $set: {
                edit_request: [
                  ...battData.edit_request,
                  {
                    ...batteryInput,
                    requestor: user.id,
                    status: "Request",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                ],
              },
            },
            { new: true }
          )
            .populate("creator")
            .populate({
              path: "edit_request",
              populate: {
                path: "requestor",
                model: "User",
              },
            })
            .populate({
              path: "delete_request",
              populate: {
                path: "requestor",
                model: "User",
              },
            }); //.sort({ createdAt: -1 });
          console.log(battery);
          return battery;
        } catch (err) {
          throw new Error(err);
        }
      }
      return res;
    },
    async deleteBattery(_, { battId, reason }, context) {
      var battData = {};
      const user = checkAuth(context);

      try {
        battData = await Battery.findById(battId).populate("creator");
      } catch (err) {
        throw new Error(err);
      }

      if (battData.publish_status === "Removed") {
        throw new Error("Battery already removed!");
      }

      if (battData.creator.username === user.username) {
        try {
          const battery = await Battery.findByIdAndUpdate(
            { _id: battId },
            {
              $set: {
                updatedAt: new Date().toISOString(),
                publish_status: "Removed",
                delete_request: [
                  ...battData.delete_request,
                  {
                    reason,
                    requestor: user.id,
                    status: "Owner Update",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                ],
              },
            },
            { new: true }
          )
            .populate("creator")
            .populate({
              path: "edit_request",
              populate: {
                path: "requestor",
                model: "User",
              },
            })
            .populate({
              path: "delete_request",
              populate: {
                path: "requestor",
                model: "User",
              },
            }); //.sort({ createdAt: -1 });
          console.log(battery);
          return battery;
        } catch (err) {
          throw new Error(err);
        }
      } else {
        try {
          const battery = await Battery.findByIdAndUpdate(
            { _id: battId },
            {
              $set: {
                delete_request: [
                  ...battData.delete_request,
                  {
                    reason,
                    requestor: user.id,
                    status: "Request",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                ],
              },
            },
            { new: true }
          )
            .populate("creator")
            .populate({
              path: "edit_request",
              populate: {
                path: "requestor",
                model: "User",
              },
            })
            .populate({
              path: "delete_request",
              populate: {
                path: "requestor",
                model: "User",
              },
            }); //.sort({ createdAt: -1 });
          console.log(battery);
          return battery;
        } catch (err) {
          throw new Error(err);
        }
      }
    },
  },
};
