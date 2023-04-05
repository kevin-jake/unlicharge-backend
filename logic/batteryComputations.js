// Naming convention:
// input_* means all arguments or variable with this prefix is coming from input of user
// data_* means all variables or arguments is from the database or builtin data from the ui
// total_* means this is an output of a function
// total* is the return to the caller

// Computes battery total capacity
const batteryTotalCapacity = (input_dod, input_capacity, data_battType) => {
  var defaultDod = input_dod;
  if (!input_dod) {
    switch (data_battType) {
      case "LiFePo4": {
        defaultDod = 80;
        break;
      }
      case "Lead Acid": {
        defaultDod = 50;
        break;
      }
      case "Li-on": {
        defaultDod = 80;
        break;
      }
      default:
        defaultDod = 100;
    }
  }
  const total_batteryCapacity = Math.ceil(
    Math.round(input_capacity * (1 + (1 - defaultDod / 100)) * 100) / 100
  );
  return { total_batteryCapacity, defaultDod };
};

// Computes how many batteries in series and in parallel
const batteryNumber = (
  input_battVoltage,
  data_nominalVoltage,
  data_capacity,
  total_batteryCapacity
) => {
  const total_series = Math.ceil(input_battVoltage / data_nominalVoltage);
  const total_parallel = Math.ceil(total_batteryCapacity / data_capacity);
  const total_quantity = total_series * total_parallel;

  if (total_series && total_parallel && total_quantity) {
    return { total_series, total_parallel, total_quantity };
  }
  return null;
};

// Computes the max and min battery voltage
const batteryTotalLimits = (
  // input_MaxVolt,
  // input_MinVolt,
  total_SeriesBatteries,
  data_nominalVoltage,
  data_maxVoltage,
  data_minVoltage
) => {
  const total_nominalVoltage = total_SeriesBatteries * data_nominalVoltage;
  const total_MaxVolt = total_SeriesBatteries * data_maxVoltage;
  const total_MinVolt = total_SeriesBatteries * data_minVoltage;
  if (total_SeriesBatteries) {
    return { total_MaxVolt, total_MinVolt, total_nominalVoltage };
  }
  return null;
};

// Computes the charge C rate and discharge C rate
const batteryCRates = (
  total_parallel,
  data_capacity,
  data_chargeCRate,
  data_dischargeCRate
) => {
  const total_chargeCRate = total_parallel * (data_chargeCRate * data_capacity);
  const total_dischargeCRate =
    total_parallel * (data_dischargeCRate * data_capacity);
  if (total_parallel) {
    return { total_chargeCRate, total_dischargeCRate };
  }
  return null;
};

const batterySummary = (
  data_battery,
  input_batteryVoltage,
  input_batteryCapacity,
  input_dod
) => {
  var totalLimits, totalPrice, cRates;
  const totalCapacity = batteryTotalCapacity(
    +input_dod,
    +input_batteryCapacity,
    data_battery.battType
  );
  const totalNumber = batteryNumber(
    +input_batteryVoltage,
    +data_battery.nominalVoltage,
    +data_battery.capacity,
    totalCapacity.total_batteryCapacity
  );
  if (totalNumber) {
    totalLimits = batteryTotalLimits(
      +totalNumber.total_series,
      +data_battery.nominalVoltage,
      +data_battery.maxVoltage,
      +data_battery.minVoltage
    );
    totalPrice = totalNumber.total_quantity * +data_battery.pricePerPc;
    cRates = batteryCRates(
      totalNumber.total_parallel,
      +data_battery.capacity,
      +data_battery.chargeCRate,
      +data_battery.dischargeCRate
    );
  }
  if (totalNumber && totalLimits)
    return {
      totalCapacity: totalCapacity.total_batteryCapacity,
      totalPrice,
      totalDischargeCRate: cRates.total_dischargeCRate,
      totalSeries: totalNumber.total_series,
      totalParallel: totalNumber.total_parallel,
      totalNominalVolt: totalLimits.total_nominalVoltage,
      totalMinVolt: totalLimits.total_MinVolt,
      totalMaxVolt: totalLimits.total_MaxVolt,
      totalQty: totalNumber.total_quantity,
      totalchargeCrate: cRates.total_chargeCRate,
      totaldod: totalCapacity.defaultDod,
    };
  else return null;
};

export { batterySummary };
