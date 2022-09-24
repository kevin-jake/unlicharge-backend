const { mongoose } = require("mongoose");
const Battery = require("../../../server/models/Battery");
const checkAuth = require("../../../util/check-auth");
const cudValidate = require("../../../util/create-update-delete-validate");
const { validateBatteryInput } = require("../../../util/validators");

async function editDeleteOperation(
  battId,
  batteryInput,
  user,
  reason,
  operation
) {
  var battData = {};
  var setData = {};
  var oper = operation;
  var previous_dataEditor;

  try {
    battData = await Battery.findById(battId)
      .populate("creator")
      .populate({
        path: "edit_request",
        populate: {
          path: "requestor",
          model: "User",
        },
      });
    const new_dataId = battData.new_data_from.toString();
    if (new_dataId) {
      previous_dataEditor = battData.edit_request.filter((item) => {
        return item.id === new_dataId;
      })[0].requestor.username;
      console.log(battData.edit_request);
    }
  } catch (err) {
    throw new Error(err);
  }
  battData.creator.username === user.username
    ? (oper += "OWNER")
    : (oper += "REQ");
  console.log(oper);
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
  } = battData;
  switch (oper) {
    case "EDIT_OWNER": {
      const editId = mongoose.Types.ObjectId();
      setData = {
        $set: {
          ...batteryInput,
          updatedAt: new Date().toISOString(),
          new_data_from: editId,
          approved_by: user.id,
          previous_data: {
            name,
            type,
            model,
            nominal_voltage,
            capacity,
            price_per_pc,
            min_voltage,
            max_voltage,
            supplier,
            editor: previous_dataEditor,
          },
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
      };
      break;
    }
    case "EDIT_REQ": {
      setData = {
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
      };
      break;
    }
    case "DELETE_OWNER": {
      if (battData.publish_status === "Removed") {
        throw new Error("Battery already removed!");
      }
      setData = {
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
      };
      break;
    }
    case "DELETE_REQ": {
      if (battData.publish_status === "Removed") {
        throw new Error("Battery already removed!");
      }
      setData = {
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
      };
      break;
    }
  }

  try {
    const battery = await Battery.findByIdAndUpdate({ _id: battId }, setData, {
      new: true,
    })
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
    return battery;
  } catch (err) {
    throw new Error(err);
  }
}

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
    // Create requests
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
    async editBattery(_, { battId, batteryInput }, context) {
      const user = checkAuth(context);
      cudValidate(batteryInput, validateBatteryInput);
      return editDeleteOperation(battId, batteryInput, user, _, "EDIT_");
    },
    async deleteBattery(_, { battId, reason }, context) {
      const user = checkAuth(context);
      return editDeleteOperation(battId, batteryInput, user, reason, "DELETE_");
    },
  },
};
