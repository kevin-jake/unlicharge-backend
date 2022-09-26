// Checks if input is a valid number
function isNumber(str) {
  if (typeof str !== "string") {
    return false;
  }

  if (str.trim() === "") {
    return false;
  }

  return !isNaN(str);
}

module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password === "") {
    errors.password = "Password must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateBatteryInput = ({
  name,
  type,
  model,
  nominal_voltage,
  capacity,
  price_per_pc,
  min_voltage,
  max_voltage,
}) => {
  const errors = {};
  const validType = ["Lead Acid", "Li-on", "LiFePo4"];
  if (name.trim() === "") {
    errors.name = "Name must not be empty";
  }
  if (!validType.includes(type)) {
    errors.type = "Battery type is not a valid type";
  }
  if (model.trim() === "") {
    errors.model = "Model must not be empty";
  }
  if (nominal_voltage.trim() === "") {
    errors.nominal_voltage = "Nominal Voltage must not be empty";
  } else if (!isNumber(nominal_voltage)) {
    errors.nominal_voltage = "Nominal Voltage must be a valid number";
  }
  if (capacity.trim() === "") {
    errors.capacity = "Capacity must not be empty";
  } else if (!isNumber(capacity)) {
    errors.capacity = "Capacity must be a valid number";
  }
  if (price_per_pc.trim() === "") {
    errors.price_per_pc = "Price must not be empty";
  } else if (!isNumber(price_per_pc)) {
    errors.price_per_pc = "Price must be a valid number";
  }
  if (min_voltage) {
    if (!isNumber(min_voltage)) {
      errors.min_voltage = "Minimum voltage must be a valid number";
    }
  }
  if (max_voltage) {
    if (!isNumber(max_voltage)) {
      errors.max_voltage = "Maximum voltage must be a valid number";
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateBMSInput = ({
  name,
  type,
  model,
  nominal_voltage,
  capacity,
  price_per_pc,
  min_voltage,
  max_voltage,
}) => {
  const errors = {};
  const validType = ["Lead Acid", "Li-on", "LiFePo4"];
  if (name.trim() === "") {
    errors.name = "Name must not be empty";
  }
  if (!validType.includes(type)) {
    errors.type = "Battery type is not a valid type";
  }
  if (model.trim() === "") {
    errors.model = "Model must not be empty";
  }
  if (nominal_voltage.trim() === "") {
    errors.nominal_voltage = "Nominal Voltage must not be empty";
  } else if (!isNumber(nominal_voltage)) {
    errors.nominal_voltage = "Nominal Voltage must be a valid number";
  }
  if (capacity.trim() === "") {
    errors.capacity = "Capacity must not be empty";
  } else if (!isNumber(capacity)) {
    errors.capacity = "Capacity must be a valid number";
  }
  if (price_per_pc.trim() === "") {
    errors.price_per_pc = "Price must not be empty";
  } else if (!isNumber(price_per_pc)) {
    errors.price_per_pc = "Price must be a valid number";
  }
  if (min_voltage) {
    if (!isNumber(min_voltage)) {
      errors.min_voltage = "Minimum voltage must be a valid number";
    }
  }
  if (max_voltage) {
    if (!isNumber(max_voltage)) {
      errors.max_voltage = "Maximum voltage must be a valid number";
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
