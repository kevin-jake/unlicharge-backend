import mongoose from "mongoose";
// TODO: Update Images
const userIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const productId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const admin = userIds[0];
const thor = userIds[1];
const ironman = userIds[2];
const capAmerica = userIds[3];
const spiderman = userIds[4];

const productBattReqThor = productId[0];
const productBattActiveThor = productId[1];
const productBMSReqThor = productId[2];
const productABReqIron = productId[3];
const productBMSReqIron = productId[4];
const productBattActAdmin = productId[5];
const productBattActiveThorWithReq = productId[6];
const productABActIron = productId[7];
const productBMSActCap = productId[8];
const productBMSActCapWithReq = productId[9];
const productABActIronWithReq = productId[10];

export const users = [
  {
    _id: admin,
    username: "admin",
    firstName: "Administrator",
    lastName: "Casala",
    email: "admin@admin.com",
    password: "$2b$12$IvcJ9EblPMJ7Ehm4GMmtdO8JWGINCHmRnbWHoo4v35E3SGGGb1.D6",
    imagePath: "public/assets/p3.jpeg",
    mobileNumber: "09323345671",
    lastLogin: 1595589072,
    createdAt: 1595589072,
    updatedAt: 1595589072,
    occupation: "Administrator",
    location: "Lipa",
    role: "Admin",
  },
  {
    _id: thor,
    username: "thor",
    firstName: "Thor",
    lastName: "Odinson",
    email: "thor@marvel.com",
    password: "$2b$12$IvcJ9EblPMJ7Ehm4GMmtdO8JWGINCHmRnbWHoo4v35E3SGGGb1.D6",
    imagePath: "http://localhost:5000/image/thor/thor.png",
    mobileNumber: "09323345672",
    lastLogin: 1595589072,
    createdAt: 1595589072,
    updatedAt: 1595589072,
    occupation: "Electrician",
    location: "Asgard",
    role: "User",
  },
  {
    _id: ironman,
    username: "ironman",
    firstName: "Tony",
    lastName: "Stark",
    email: "ilove3000@marvel.com",
    password: "$2b$12$IvcJ9EblPMJ7Ehm4GMmtdO8JWGINCHmRnbWHoo4v35E3SGGGb1.D6",
    imagePath: "http://localhost:5000/image/ironman/ironman.png",
    mobileNumber: "09323345673",
    lastLogin: 1219214568,
    createdAt: 1219214568,
    updatedAt: 1219214568,
    occupation: "Solar Installer",
    location: "Miami",
    role: "User",
  },
  {
    _id: capAmerica,
    username: "capAmerica",
    firstName: "Steve",
    lastName: "Rogers",
    email: "avengers@marvel.com",
    password: "$2b$12$IvcJ9EblPMJ7Ehm4GMmtdO8JWGINCHmRnbWHoo4v35E3SGGGb1.D6",
    imagePath: "http://localhost:5000/image/capAmerica/cap.png",
    mobileNumber: "09323345674",
    lastLogin: 1219214568,
    createdAt: 1219214568,
    updatedAt: 1219214568,
    occupation: "Hobbyist",
    location: "Germany",
    role: "User",
  },
  {
    _id: spiderman,
    username: "spiderman",
    firstName: "Peter",
    lastName: "Parker",
    email: "spidey@marvel.com",
    password: "$2b$12$IvcJ9EblPMJ7Ehm4GMmtdO8JWGINCHmRnbWHoo4v35E3SGGGb1.D6",
    imagePath: "http://localhost:5000/image/spiderman/spidey.png",
    mobileNumber: "09323345675",
    lastLogin: 1381326073,
    createdAt: 1381326073,
    updatedAt: 1381326073,
    occupation: "Hobbyist",
    location: "New York",
    role: "User",
  },
];

const batterySpecsId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const battRequestThor = batterySpecsId[0];
const batteryActiveThor = batterySpecsId[1];
const batteryActiveAdmin = batterySpecsId[2];
const batteryActiveThorwithRequests = batterySpecsId[3];
const batteryCapEditRequest = batterySpecsId[4];
const batterySpideyEditRequest = batterySpecsId[5];

export const batterySpecs = [
  {
    _id: battRequestThor,
    name: "18650 EVE",
    imagePath: "/test.jpg",
    brand: "Bitek",
    supplierLink: "https://www.facebook.com/LionDecour",
    supplier: "Lion Decour",
    battType: "Lithium Ion",
    nominalVoltage: 3.6,
    maxVoltage: 0,
    minVoltage: 0,
    capacity: 3.2,
    pricePerPc: 185,
    specCreator: thor,
    editRequest: false,
    status: "Request",
    productId: productBattReqThor,
  },
  {
    _id: batteryActiveThor,
    name: "2021 LiitoKala 32700 LiFePO4 3.2V 6500mah 35A",
    imagePath: "/test.jpg",
    brand: "LiitoKala",
    supplierLink:
      "https://shopee.ph/2021-LiitoKala-32700-LiFePO4-3.2V-6500mah-35A-continuous-discharge-55A-High-power-For-screwdriver-ba-i.499396114.10745042915?sp_atk=c305f8cd-5fb4-43a2-ad21-17c7afeacdfc",
    supplier: "LiitoKala",
    battType: "LiFePo4",
    nominalVoltage: 3.2,
    maxVoltage: 0,
    minVoltage: 0,
    capacity: 6.5,
    pricePerPc: 331,
    specCreator: thor,
    editRequest: false,
    status: "Active",
    productId: productBattActiveThor,
  },
  {
    _id: batteryActiveAdmin,
    name: "12V 150AH SOLAR GEL Deep Cycle Battery LVTOPSUN",
    imagePath: "/test.jpg",
    brand: "Lvtopsun",
    supplierLink:
      "https://shopee.ph/12V-150AH-SOLAR-GEL-Deep-Cycle-Battery-LVTOPSUN.-Solar-battery-i.500921351.10153599204?sp_atk=ce68e4e5-88a4-4a52-acad-947d6a1a3747",
    supplier: "Lvtopsun",
    battType: "Lead Acid",
    nominalVoltage: 12,
    maxVoltage: 0,
    minVoltage: 0,
    capacity: 150,
    pricePerPc: 9500,
    specCreator: admin,
    editRequest: false,
    status: "Active",
    productId: productBattActAdmin,
  },
  {
    _id: batteryActiveThorwithRequests,
    name: "32650 6ah",
    imagePath: "/test.jpg",
    brand: "32650 Generic",
    supplierLink:
      "https://shopee.ph/32650-lifepo4-battery-6000mAh-3.2V-(PLS-READ-DESCRIPTION)-per-piece-i.45615974.2716937427",
    supplier: "Dagupan Solar",
    battType: "LiFePo4",
    nominalVoltage: 3.2,
    maxVoltage: 0,
    minVoltage: 0,
    capacity: 6,
    pricePerPc: 95,
    specCreator: thor,
    editRequest: false,
    status: "Active",
    productId: productBattActiveThorWithReq,
  },
  {
    _id: batteryCapEditRequest,
    name: "32650 (Avengers Edition) 6ah",
    imagePath:
      "http://localhost:5000/image/capAmerica/90aa95962b4c332977e531c427c41d03.jpg",
    brand: "32650 Generic",
    supplierLink:
      "https://shopee.ph/32650-lifepo4-battery-6000mAh-3.2V-(PLS-READ-DESCRIPTION)-per-piece-i.45615974.2716937427",
    supplier: "Dagupan Solar",
    battType: "LiFePo4",
    nominalVoltage: 3.2,
    maxVoltage: 0,
    minVoltage: 0,
    capacity: 6,
    pricePerPc: 100,
    specCreator: capAmerica,
    editRequest: true,
    status: "Request",
    productId: productBattActiveThorWithReq,
  },
  {
    _id: batterySpideyEditRequest,
    name: "32650 test-spidey 6ah",
    imagePath:
      "http://localhost:5000/image/spiderman/90aa95962b4c332977e531c427c41d03.jpg",
    brand: "32650 Generic",
    supplierLink:
      "https://shopee.ph/32650-lifepo4-battery-6000mAh-3.2V-(PLS-READ-DESCRIPTION)-per-piece-i.45615974.2716937427",
    supplier: "Dagupan Solar",
    battType: "LiFePo4",
    nominalVoltage: 3.2,
    maxVoltage: 4.2,
    minVoltage: 2.5,
    capacity: 6,
    pricePerPc: 100,
    specCreator: spiderman,
    editRequest: true,
    status: "Request",
    productId: productBattActiveThorWithReq,
  },
];

const bmsSpecsId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const bmsSpecs = [
  {
    _id: bmsSpecsId[0],
    name: "Daly bms discharge/ charge current BMS for Lifepo4",
    imagePath: "/test.jpg",
    brand: "Daly",
    supplierLink:
      "https://shopee.ph/Daly-bms-discharge-charge-current-BMS-for-Lifepo4-i.298508939.4449568123?sp_atk=e0bb3f3e-e9ab-4d60-a321-50da5bd04755&xptdk=e0bb3f3e-e9ab-4d60-a321-50da5bd04755",
    supplier: "Shopee",
    strings: 4,
    chargeCurrent: 15,
    dischargeCurrent: 8,
    portType: "Common",
    voltage: 12,
    price: 455,
    specCreator: thor,
    editRequest: false,
    status: "Active",
    productId: productBMSReqThor,
  },
  {
    _id: bmsSpecsId[1],
    name: "JK SMART BMS 12v 24v 48v Active Balance 7S to 24S 40A to 200A Lifepo4 Lithium ion 32700 21700 18650",
    imagePath: "/test.jpg",
    brand: "JK",
    supplierLink:
      "https://shopee.ph/JK-SMART-BMS-12v-24v-48v-Active-Balance-7S-to-24S-40A-to-200A-Lifepo4-Lithium-ion-32700-21700-18650-i.16612090.18814255632?sp_atk=8d352451-2e1b-48f0-b08a-8a991c5fcf7d&xptdk=8d352451-2e1b-48f0-b08a-8a991c5fcf7d",
    supplier: "Shopee",
    strings: 8,
    chargeCurrent: 40,
    dischargeCurrent: 10,
    portType: "Common",
    voltage: 12,
    price: 2199,
    specCreator: ironman,
    editRequest: false,
    status: "Active",
    productId: productBMSReqIron,
  },
  {
    _id: bmsSpecsId[2],
    name: "16S 3.2V  LFP 100A Same Port With Bluetooth Module",
    imagePath: "/test.jpg",
    brand: "JBD",
    supplierLink:
      "https://shopee.ph/JBD-BMS-Lifepo4-12V-24V-48V-4S-8S-16S-100A-Same-Port-With-Passive-Balance-Included-Bluetooth-Module-BMS-for-Lifepo4-Battery-for-Lithium-Battery-Applied-in-Electic-vehicles-Storage-Inverter-and-Caravan-Cars-i.564409672.15818548812?sp_atk=b86ca57e-fa13-46fb-ae1e-4a0552f90844&xptdk=b86ca57e-fa13-46fb-ae1e-4a0552f90844",
    supplier: "Shopee",
    strings: 16,
    chargeCurrent: 100,
    dischargeCurrent: 25,
    portType: "Common",
    voltage: 52,
    price: 4424,
    specCreator: capAmerica,
    editRequest: false,
    status: "Active",
    productId: productBMSActCap,
  },
  {
    _id: bmsSpecsId[3],
    name: "8S 3.2V  LFP 100A Same Port With Bluetooth Module",
    imagePath: "/test.jpg",
    brand: "JBD",
    supplierLink:
      "https://shopee.ph/JBD-BMS-Lifepo4-12V-24V-48V-4S-8S-16S-100A-Same-Port-With-Passive-Balance-Included-Bluetooth-Module-BMS-for-Lifepo4-Battery-for-Lithium-Battery-Applied-in-Electic-vehicles-Storage-Inverter-and-Caravan-Cars-i.564409672.15818548812?sp_atk=b86ca57e-fa13-46fb-ae1e-4a0552f90844&xptdk=b86ca57e-fa13-46fb-ae1e-4a0552f90844",
    supplier: "Shopee",
    strings: 16,
    chargeCurrent: 100,
    dischargeCurrent: 25,
    portType: "Common",
    voltage: 24,
    price: 2903,
    specCreator: capAmerica,
    editRequest: false,
    status: "Active",
    productId: productBMSActCapWithReq,
  },
  {
    _id: bmsSpecsId[4],
    name: "8S 3.2V  LFP 100A Same Port With Wifi Module",
    imagePath: "/test.jpg",
    brand: "JBD",
    supplierLink:
      "https://shopee.ph/JBD-BMS-Lifepo4-12V-24V-48V-4S-8S-16S-100A-Same-Port-With-Passive-Balance-Included-Bluetooth-Module-BMS-for-Lifepo4-Battery-for-Lithium-Battery-Applied-in-Electic-vehicles-Storage-Inverter-and-Caravan-Cars-i.564409672.15818548812?sp_atk=b86ca57e-fa13-46fb-ae1e-4a0552f90844&xptdk=b86ca57e-fa13-46fb-ae1e-4a0552f90844",
    supplier: "Shopee",
    strings: 16,
    chargeCurrent: 100,
    dischargeCurrent: 25,
    portType: "Common",
    voltage: 24,
    price: 2950,
    specCreator: thor,
    editRequest: true,
    status: "Request",
    productId: productBMSActCapWithReq,
  },
];

export const activeBalancerSpecsId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const activeBalancerSpecs = [
  {
    _id: activeBalancerSpecsId[0],
    name: "Active balancer 3S 4S 8S 12S Li-ion Lifepo4 lithium battery active equalizer",
    imagePath: "/test.jpg",
    brand: "Generic",
    supplierLink:
      "https://shopee.ph/Active-balancer-3S-4S-8S-12S-Li-ion-Lifepo4-lithium-battery-active-equalizer-i.498737510.21956687321?sp_atk=df0d4826-3a1e-42d4-b08a-b40dea965f99&xptdk=df0d4826-3a1e-42d4-b08a-b40dea965f99",
    supplier: "Shopee",
    strings: 4,
    balanceCurrent: 1.2,
    balancingType: "Active",
    price: 209,
    specCreator: ironman,
    editRequest: false,
    status: "Active",
    productId: productABReqIron,
  },
  {
    _id: activeBalancerSpecsId[1],
    name: "6S 7S 8S 5A 6A Active Equalizer Balancer/8s equalizer Lifepo4 Lithium Lipo LTO Energy transfer",
    imagePath: "/test.jpg",
    brand: "Generic",
    supplierLink:
      "https://shopee.ph/6S-7S-8S-5A-6A-Active-Equalizer-Balancer-8s-equalizer-Lifepo4-Lithium-Lipo-LTO-Energy-transfe-i.306592453.11771884792?sp_atk=021c4de0-7df3-43ef-b9e3-6f4ea7c9129a&xptdk=021c4de0-7df3-43ef-b9e3-6f4ea7c9129a",
    supplier: "Shopee",
    strings: 8,
    balanceCurrent: 5.5,
    balancingType: "Active",
    price: 1230,
    specCreator: ironman,
    editRequest: false,
    status: "Active",
    productId: productABActIron,
  },
  {
    _id: activeBalancerSpecsId[2],
    name: "Daly 3S 1A",
    imagePath: "/test.jpg",
    brand: "Daly",
    supplierLink:
      "https://shopee.ph/3S-4S-8S-Balance-Li-ion-Lifepo4-LTO-Lithium-Battery-Active-Equalizer-Balancer-Board-CapacitorBMS-i.18252381.18643600287?sp_atk=374b8628-a572-4e54-95c3-eadc27430c2d&xptdk=374b8628-a572-4e54-95c3-eadc27430c2d",
    supplier: "Shopee",
    strings: 3,
    balanceCurrent: 1,
    balancingType: "Active",
    price: 799,
    specCreator: ironman,
    editRequest: false,
    status: "Active",
    productId: productABActIronWithReq,
  },
  {
    _id: activeBalancerSpecsId[3],
    name: "Daly 4S 1A",
    imagePath: "/test.jpg",
    brand: "Daly",
    supplierLink:
      "https://shopee.ph/3S-4S-8S-Balance-Li-ion-Lifepo4-LTO-Lithium-Battery-Active-Equalizer-Balancer-Board-CapacitorBMS-i.18252381.18643600287?sp_atk=374b8628-a572-4e54-95c3-eadc27430c2d&xptdk=374b8628-a572-4e54-95c3-eadc27430c2d",
    supplier: "Shopee",
    strings: 4,
    balanceCurrent: 1,
    balancingType: "Active",
    price: 900,
    specCreator: thor,
    editRequest: true,
    status: "Request",
    productId: productABActIronWithReq,
  },
];

const editRequestsId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const deleteRequestsId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const products = [
  {
    _id: productBattReqThor,
    category: "Battery",
    specs: battRequestThor,
    creator: thor,
    publishStatus: "Request",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productBattActiveThor,
    category: "Battery",
    specs: batteryActiveThor,
    creator: thor,
    publishStatus: "Approved",
    processedBy: admin,
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productBMSReqThor,
    category: "BMS",
    specs: bmsSpecsId[0],
    creator: thor,
    publishStatus: "Request",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productABReqIron,
    category: "ActiveBalancer",
    specs: activeBalancerSpecsId[0],
    creator: ironman,
    publishStatus: "Request",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productBMSReqIron,
    category: "BMS",
    specs: bmsSpecsId[1],
    creator: ironman,
    publishStatus: "Request",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productBattActAdmin,
    category: "Battery",
    specs: batteryActiveAdmin,
    creator: admin,
    processedBy: admin,
    publishStatus: "Approved",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productBattActiveThorWithReq,
    category: "Battery",
    specs: batteryActiveThorwithRequests,
    creator: thor,
    publishStatus: "Approved",
    processedBy: admin,
    editRequests: [editRequestsId[0], editRequestsId[1]],
    deleteRequests: [deleteRequestsId[0]],
  },
  {
    _id: productABActIron,
    category: "ActiveBalancer",
    specs: activeBalancerSpecsId[1],
    creator: ironman,
    processedBy: admin,
    publishStatus: "Approved",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productBMSActCap,
    category: "BMS",
    specs: bmsSpecsId[2],
    creator: capAmerica,
    publishStatus: "Approved",
    processedBy: admin,
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productBMSActCapWithReq,
    category: "BMS",
    specs: bmsSpecsId[3],
    creator: capAmerica,
    publishStatus: "Approved",
    processedBy: admin,
    editRequests: [editRequestsId[2]],
    deleteRequests: [deleteRequestsId[1]],
  },
  {
    _id: productABActIronWithReq,
    category: "ActiveBalancer",
    specs: activeBalancerSpecsId[2],
    creator: ironman,
    publishStatus: "Approved",
    processedBy: admin,
    editRequests: [editRequestsId[3]],
    deleteRequests: [deleteRequestsId[2]],
  },
];

export const editRequests = [
  {
    _id: editRequestsId[0],
    requestedProduct: productBattActiveThorWithReq,
    category: "Battery",
    newSpecs: batteryCapEditRequest,
    status: "Request",
    requestor: capAmerica,
    comment: [],
  },
  {
    _id: editRequestsId[1],
    requestedProduct: productBattActiveThorWithReq,
    category: "Battery",
    newSpecs: batterySpideyEditRequest,
    status: "Request",
    requestor: spiderman,
    comment: [
      {
        userId: spiderman,
        body: "Friendly neighborhood aslkdfjlakj",
      },
      {
        userId: thor,
        body: "Mjolnir to me!!",
      },
      {
        userId: spiderman,
        body: "Hi Thor!",
      },
    ],
  },
  {
    _id: editRequestsId[2],
    requestedProduct: productBMSActCapWithReq,
    category: "BMS",
    newSpecs: bmsSpecsId[4],
    status: "Request",
    requestor: thor,
    comment: [
      {
        userId: thor,
        body: "Another!!!",
      },
      {
        userId: capAmerica,
        body: "Back off Thor",
      },
      {
        userId: capAmerica,
        body: "Ok please backoff",
      },
      {
        userId: thor,
        body: "No I am fine thank you",
      },
    ],
  },
  {
    _id: editRequestsId[3],
    requestedProduct: productABActIronWithReq,
    category: "ActiveBalancer",
    newSpecs: activeBalancerSpecsId[3],
    status: "Request",
    requestor: thor,
    comment: [
      {
        userId: thor,
        body: "Another!!!",
      },
      {
        userId: ironman,
        body: "Not again Thor",
      },
    ],
  },
];

export const deleteRequests = [
  {
    _id: deleteRequestsId[0],
    requestedProduct: productBattActiveThorWithReq,
    category: "Battery",
    requestor: spiderman,
    deleteReason: "This is not exisiting anymore",
    status: "Request",
    comment: [
      {
        userId: thor,
        body: "What do you mean not exising?",
      },
      {
        userId: spiderman,
        body: "Check your link there",
      },
    ],
  },
  {
    _id: deleteRequestsId[1],
    requestedProduct: productBMSActCapWithReq,
    category: "BMS",
    requestor: ironman,
    status: "Request",
    deleteReason: "Wrong information",
    comment: [
      {
        userId: capAmerica,
        body: "Ok",
      },
      {
        userId: ironman,
        body: "Thanks",
      },
    ],
  },
  {
    _id: deleteRequestsId[2],
    requestedProduct: productABActIronWithReq,
    category: "ActiveBalancer",
    status: "Rejected",
    requestor: thor,
    deleteReason: "Just want to delete it",
    comment: [],
  },
];
