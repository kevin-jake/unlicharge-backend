export const sortResults = (arrayToSort, sortBy = "name", arrangement) => {
  let result = [];
  const numberSpecs = [
    "pricePerPc",
    "price",
    "capacity",
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
      const isComputedSpecs = /total/.test(sortBy);
      let ret;
      isComputedSpecs
        ? (ret =
            a.specs._doc.computedSpecs[sortBy] -
            b.specs._doc.computedSpecs[sortBy])
        : (ret = a.specs[sortBy] - b.specs[sortBy]);
      return arrangement === "asc" ? ret : -1 * ret;
    });

  return result;
};

export const sortByStatus = (arrayToSort) => {
  let result = [];
  const order = { Request: 1, Approved: 2 };

  result = arrayToSort.sort(
    (a, b) =>
      (order[a.publishStatus] || Number.MAX_VALUE) -
      (order[b.publishStatus] || Number.MAX_VALUE)
  );

  return result;
};
