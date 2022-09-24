const checkAuth = require("../../../util/check-auth");
const Battery = require("../../../server/models/Battery");

module.exports = {
  Mutation: {
    // Approving requests
    async approveRequest(_, { operation, partsListId, requestId }, context) {
      const user = checkAuth(context);
      var filter = {};
      var setData = {};
      var resArray = [];

      switch (operation) {
        case "CREATE": {
          filter = { _id: partsListId };
          setData = {
            publish_status: "Approved",
            updatedAt: new Date().toISOString(),
          };
          try {
            const battery = await Battery.findByIdAndUpdate(filter, setData, {
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
          break;
        }
        case "DELETE": {
          filter = { _id: partsListId, "delete_request._id": requestId };
          setData = {
            publish_status: "Removed",
            "delete_request.status": "Approved",
            "delete_request.updatedAt": new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          try {
            const battery = await Battery.findByIdAndUpdate(filter, setData, {
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
          break;
        }
        case "EDIT": {
          filter = { _id: partsListId };
          var previous_dataEditor = "";
          var creatorUsername = "";
          try {
            const res = await Battery.find(filter)
              .populate("creator")
              .populate({
                path: "edit_request",
                populate: {
                  path: "requestor",
                  model: "User",
                },
              }); //.sort({ createdAt: -1 });
            creatorUsername = res[0].creator.username;
            const new_dataId = res[0].new_data_from.toString();
            resArray = res[0].edit_request;
            setData = resArray.filter((item) => {
              return item.id === requestId;
            });
            const obj = setData[0]._doc;
            const {
              status,
              createdAt,
              updatedAt,
              requestor,
              _id,
              ...restObject
            } = obj;
            setData = restObject;
            if (new_dataId) {
              previous_dataEditor = resArray.filter((item) => {
                return item.id === new_dataId;
              })[0].requestor.username;
            }
          } catch (err) {
            throw new Error(err);
          }
          const {
            status,
            createdAt,
            updatedAt,
            requestor,
            _id,
            ...previous_data
          } = resArray[0]._doc;
          console.log(previous_data);
          try {
            await Battery.updateOne(
              { "edit_request._id": requestId },
              {
                $set: {
                  "edit_request.$.status": "Approved",
                  "edit_request.$.updatedAt": new Date().toISOString(),
                },
              }
            );
          } catch (err) {
            throw new Error(err);
          }

          try {
            const battery = await Battery.findByIdAndUpdate(
              {
                _id: partsListId,
              },
              {
                ...setData,
                publish_status: "Approved",
                new_data_from: requestId,
                approved_by: user.id,
                previous_data: {
                  ...previous_data,
                  editor: previous_dataEditor
                    ? previous_dataEditor
                    : creatorUsername,
                },
                updatedAt: new Date().toISOString(),
              },
              {
                new: true,
              }
            )
              .populate("creator")
              .populate("approved_by")
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
          break;
        }
      }
    },
  },
};
