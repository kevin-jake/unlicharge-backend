const BMS = require("../../../server/models/BMS");
const checkAuth = require("../../../util/check-auth");
const {
  cudValidate,
  editDeleteOperation,
} = require("../../../util/crud-functions");
const { validateBMSInput } = require("../../../util/validators");

module.exports = {
  Query: {
    //   Get all bms list in the database.
    // This only gets Approved and Verified publish_statuses for user that is not the owner.
    async getBMSes(_, { userId, requests = false }) {
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
        const bmses = await BMS.find(filter).populate("creator"); //.sort({ createdAt: -1 });
        if (requests) {
          var res = bmses.filter((item) => item.creator.id === userId);
          return res;
        }
        return bmses;
      } catch (err) {
        throw new Error(err);
      }
    },

    //   Get a single BMS on the list in the database
    async getBMS(_, { bmsId }) {
      var filter = {
        _id: bmsId,
        publish_status: ["Request", "Approved", "Verified"],
      };

      // If admin condition
      if (userId === "634684e1659d6cb340997577") {
        filter = {};
      } else {
        filter = { _id: bmsId };
      }
      try {
        const bms = await BMS.findOne(filter);
        if (bms) return bms;
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
    // Create bms requests into the database
    async createBMS(_, { bmsInput }, context) {
      const {
        name,
        brand,
        strings,
        charge_current,
        discharge_current,
        port_type,
        voltage,
        price,
        supplier,
        image_url,
      } = bmsInput;
      const user = checkAuth(context);
      cudValidate(bmsInput, validateBMSInput);
      const newBMS = new BMS({
        name,
        brand,
        strings,
        charge_current,
        discharge_current,
        port_type,
        voltage,
        price,
        supplier,
        image_url,
        publish_status:
          user.id === "634684e1659d6cb340997577" ? "Approved" : "Request",
        creator: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const ret = await newBMS.save(
        BMS.populate(newBMS, { path: "creator" }, function (err, res) {
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
    async editBMS(_, { bmsId, bmsInput }, context) {
      const user = checkAuth(context);
      cudValidate(bmsInput, validateBMSInput);
      return editDeleteOperation(bmsId, bmsInput, user, _, "EDIT_", "BMS");
    },
    // Delete bms requests into the database
    async deleteBMS(_, { bmsId, reason }, context) {
      const user = checkAuth(context);
      return editDeleteOperation(bmsId, _, user, reason, "DELETE_", "BMS");
    },
  },
};
