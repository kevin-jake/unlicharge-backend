const { UserInputError } = require("apollo-server-express");
const { default: mongoose } = require("mongoose");

// Validate and show errors in the backend
const cudValidate = (inputs, validateFunction) => {
  const { valid, errors } = validateFunction(inputs);
  if (!valid) {
    throw new UserInputError("Errors", { errors });
  }
};

// General function for edit and delete request this will select if Owner or User requests
async function editDeleteOperation(
  partsListId,
  requestInput,
  user,
  reason,
  operation,
  table
) {
  var requestData = {};
  var setData = {};
  var oper = operation;
  var previousDataObj;

  try {
    requestData = await mongoose
      .model(table)
      .findById(partsListId)
      .populate("creator")
      .populate({
        path: "edit_request",
        populate: {
          path: "requestor",
          model: "User",
        },
      });
    const new_dataId = requestData.new_data_from.toString();
    if (new_dataId) {
      previous_dataEditor = requestData.edit_request.filter((item) => {
        return item.id === new_dataId;
      })[0].requestor.username;
      console.log(requestData.edit_request);
    }
  } catch (err) {
    throw new Error(err);
  }
  requestData.creator.username === user.username
    ? (oper += "OWNER")
    : (oper += "REQ");
  console.log(oper);
  switch (table) {
    case "Battery": {
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
      } = requestData;
      previousDataObj = {
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
      };
      break;
    }
    case "BMS": {
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
      } = requestData;
      previousDataObj = {
        name,
        brand,
        strings,
        charge_current,
        discharge_current,
        port_type,
        voltage,
        price,
        supplier,
        editor: previous_dataEditor,
      };
      break;
    }
  }

  switch (oper) {
    case "EDIT_OWNER": {
      const editId = mongoose.Types.ObjectId();
      setData = {
        $set: {
          ...requestInput,
          updatedAt: new Date().toISOString(),
          new_data_from: editId,
          approved_by: user.id,
          previous_data: {
            ...previousDataObj,
          },
          edit_request: [
            ...requestData.edit_request,
            {
              ...requestInput,
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
            ...requestData.edit_request,
            {
              ...requestInput,
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
      if (requestData.publish_status === "Removed") {
        throw new Error("BMS already removed!");
      }
      setData = {
        $set: {
          updatedAt: new Date().toISOString(),
          publish_status: "Removed",
          delete_request: [
            ...requestData.delete_request,
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
      if (requestData.publish_status === "Removed") {
        throw new Error(table + " already removed!");
      }
      setData = {
        $set: {
          delete_request: [
            ...requestData.delete_request,
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
    const res = await mongoose
      .model(table)
      .findByIdAndUpdate({ _id: partsListId }, setData, {
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
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { cudValidate, editDeleteOperation };
