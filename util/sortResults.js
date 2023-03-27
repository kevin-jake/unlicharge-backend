export const sortResults = (arrayToSort, sortBy = "name", arrangement) => {
  let result = [];
  const numberSpecs = [
    "pricePerPc",
    "totalCapacity",
    "totalVoltage",
    "totalPrice",
    "totalQty",
    "nominalVoltage",
  ];

  if (!numberSpecs.includes(sortBy))
    result = arrayToSort.sort((a, b) => {
      let fa = a.specs[sortBy].toLowerCase(),
        fb = b.specs[sortBy].toLowerCase();

      if (fa < fb) {
        return arrangement === "asc" ? -1 : 1;
      }
      if (fa > fb) {
        return arrangement === "asc" ? 1 : -1;
      }
      return 0;
    });
  else
    result = arrayToSort.sort((a, b) => {
      const ret = a.specs[sortBy] - b.specs[sortBy];
      return arrangement === "asc" ? ret : -1 * ret;
    });

  return result;
};
