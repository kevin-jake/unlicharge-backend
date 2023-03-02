import mongoose from "mongoose";
// TODO: Update Images
const userIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
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

export const users = [
  {
    _id: userIds[0],
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
    location: "Lipa",
    role: "Admin",
  },
  {
    _id: userIds[1],
    username: "thor",
    firstName: "Thor",
    lastName: "Odinson",
    email: "thor@marvel.com",
    password: "$2b$12$IvcJ9EblPMJ7Ehm4GMmtdO8JWGINCHmRnbWHoo4v35E3SGGGb1.D6",
    imagePath: "public/assets/p3.jpeg",
    mobileNumber: "09323345672",
    lastLogin: 1595589072,
    createdAt: 1595589072,
    updatedAt: 1595589072,
    location: "Asgard",
    role: "User",
  },
  {
    _id: userIds[2],
    username: "ironman",
    firstName: "Tony",
    lastName: "Stark",
    email: "ilove3000@marvel.com",
    password: "$2b$12$IvcJ9EblPMJ7Ehm4GMmtdO8JWGINCHmRnbWHoo4v35E3SGGGb1.D6",
    imagePath: "public/assets/p3.jpeg",
    mobileNumber: "09323345673",
    lastLogin: 1219214568,
    createdAt: 1219214568,
    updatedAt: 1219214568,
    location: "Miami",
    role: "User",
  },
  {
    _id: userIds[3],
    username: "capAmerica",
    firstName: "Steve",
    lastName: "Rogers",
    email: "avengers@marvel.com",
    password: "$2b$12$IvcJ9EblPMJ7Ehm4GMmtdO8JWGINCHmRnbWHoo4v35E3SGGGb1.D6",
    imagePath: "public/assets/p3.jpeg",
    mobileNumber: "09323345674",
    lastLogin: 1219214568,
    createdAt: 1219214568,
    updatedAt: 1219214568,
    location: "Germany",
    role: "User",
  },
  {
    _id: userIds[4],
    username: "spiderman",
    firstName: "Peter",
    lastName: "Parker",
    email: "spidey@marvel.com",
    password: "$2b$12$IvcJ9EblPMJ7Ehm4GMmtdO8JWGINCHmRnbWHoo4v35E3SGGGb1.D6",
    imagePath: "public/assets/p3.jpeg",
    mobileNumber: "09323345675",
    lastLogin: 1381326073,
    createdAt: 1381326073,
    updatedAt: 1381326073,
    location: "New York",
    role: "User",
  },
];

// export const posts = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     userId: userIds[1],
//     firstName: "Steve",
//     lastName: "Ralph",
//     location: "New York, CA",
//     description: "Some really long random description",
//     picturePath: "post1.jpeg",
//     userPicturePath: "p3.jpeg",
//     likes: new Map([
//       [userIds[0], true],
//       [userIds[2], true],
//       [userIds[3], true],
//       [userIds[4], true],
//     ]),
//     comments: [
//       "random comment",
//       "another random comment",
//       "yet another random comment",
//     ],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     userId: userIds[3],
//     firstName: "Whatcha",
//     lastName: "Doing",
//     location: "Korea, CA",
//     description:
//       "Another really long random description. This one is longer than the previous one.",
//     picturePath: "post2.jpeg",
//     userPicturePath: "p6.jpeg",
//     likes: new Map([
//       [userIds[7], true],
//       [userIds[4], true],
//       [userIds[1], true],
//       [userIds[2], true],
//     ]),
//     comments: [
//       "one more random comment",
//       "and another random comment",
//       "no more random comments",
//       "I lied, one more random comment",
//     ],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     userId: userIds[4],
//     firstName: "Jane",
//     lastName: "Doe",
//     location: "Utah, CA",
//     description:
//       "This is the last really long random description. This one is longer than the previous one.",
//     picturePath: "post3.jpeg",
//     userPicturePath: "p5.jpeg",
//     likes: new Map([
//       [userIds[1], true],
//       [userIds[6], true],
//       [userIds[3], true],
//       [userIds[5], true],
//     ]),
//     comments: [
//       "one more random comment",
//       "I lied, one more random comment",
//       "I lied again, one more random comment",
//       "Why am I doing this?",
//       "I'm bored",
//     ],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     userId: userIds[5],
//     firstName: "Harvey",
//     lastName: "Dunn",
//     location: "Los Angeles, CA",
//     description:
//       "This is the last really long random description. This one is longer than the previous one. Man I'm bored. I'm going to keep typing until I run out of things to say.",
//     picturePath: "post4.jpeg",
//     userPicturePath: "p7.jpeg",
//     likes: new Map([
//       [userIds[1], true],
//       [userIds[6], true],
//       [userIds[3], true],
//     ]),
//     comments: [
//       "I lied again, one more random comment",
//       "Why am I doing this?",
//       "I'm bored",
//       "I'm still bored",
//       "All I want to do is play video games",
//       "I'm going to play video games",
//     ],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     userId: userIds[6],
//     firstName: "Carly",
//     lastName: "Vowel",
//     location: "Chicago, IL",
//     description:
//       "Just a short description. I'm tired of typing. I'm going to play video games now.",
//     picturePath: "post5.jpeg",
//     userPicturePath: "p8.jpeg",
//     likes: new Map([
//       [userIds[1], true],
//       [userIds[3], true],
//       [userIds[5], true],
//       [userIds[7], true],
//     ]),
//     comments: [
//       "I lied again, one more random comment",
//       "Why am I doing this?",
//       "Man I'm bored",
//       "What should I do?",
//       "I'm going to play video games",
//     ],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     userId: userIds[7],
//     firstName: "Jessica",
//     lastName: "Dunn",
//     location: "Washington, DC",
//     description:
//       "For the last time, I'm going to play video games now. I'm tired of typing. I'm going to play video games now.",
//     picturePath: "post6.jpeg",
//     userPicturePath: "p9.jpeg",
//     likes: new Map([
//       [userIds[1], true],
//       [userIds[2], true],
//     ]),

//     comments: [
//       "Can I play video games now?",
//       "No let's actually study",
//       "Never mind, I'm going to play video games",
//       "Stop it.",
//       "Michael, stop it.",
//     ],
//   },
// ];

const batterySpecsId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const batterySpecs = [
  {
    _id: batterySpecsId[0],
    name: "18650 EVE",
    imagePath: "public/assets/info2.jpeg",
    brand: "Bitek",
    supplierLink: "https://www.facebook.com/LionDecour",
    supplier: "Lion Decour",
    type: "Lithium Ion",
    nominalVoltage: 3.6,
    maxVoltage: 0,
    minVoltage: 0,
    capacity: 3.2,
    pricePerPc: 185,
    specCreator: userIds[1],
    editRequest: false,
    status: "Request",
    productId: productId[0],
  },
  {
    _id: batterySpecsId[1],
    name: "2021 LiitoKala 32700 LiFePO4 3.2V 6500mah 35A",
    imagePath: "public/assets/info2.jpeg",
    brand: "LiitoKala",
    supplierLink:
      "https://shopee.ph/2021-LiitoKala-32700-LiFePO4-3.2V-6500mah-35A-continuous-discharge-55A-High-power-For-screwdriver-ba-i.499396114.10745042915?sp_atk=c305f8cd-5fb4-43a2-ad21-17c7afeacdfc",
    supplier: "LiitoKala",
    type: "LiFePo4",
    nominalVoltage: 3.2,
    maxVoltage: 0,
    minVoltage: 0,
    capacity: 6.5,
    pricePerPc: 331,
    specCreator: userIds[1],
    editRequest: false,
    status: "Active",
    productId: productId[1],
  },
  {
    _id: batterySpecsId[2],
    name: "12V 150AH SOLAR GEL Deep Cycle Battery LVTOPSUN",
    imagePath: "public/assets/info2.jpeg",
    brand: "Lvtopsun",
    supplierLink:
      "https://shopee.ph/12V-150AH-SOLAR-GEL-Deep-Cycle-Battery-LVTOPSUN.-Solar-battery-i.500921351.10153599204?sp_atk=ce68e4e5-88a4-4a52-acad-947d6a1a3747",
    supplier: "Lvtopsun",
    type: "Lead Acid",
    nominalVoltage: 12,
    maxVoltage: 0,
    minVoltage: 0,
    capacity: 150,
    pricePerPc: 9500,
    specCreator: userIds[0],
    editRequest: false,
    status: "Active",
    productId: productId[5],
  },
  {
    _id: batterySpecsId[3],
    name: "32650 6ah",
    imagePath: "public/assets/info2.jpeg",
    brand: "32650 Generic",
    supplierLink:
      "https://shopee.ph/32650-lifepo4-battery-6000mAh-3.2V-(PLS-READ-DESCRIPTION)-per-piece-i.45615974.2716937427",
    supplier: "Dagupan Solar",
    type: "LiFePo4",
    nominalVoltage: 3.2,
    maxVoltage: 0,
    minVoltage: 0,
    capacity: 6,
    pricePerPc: 95,
    specCreator: userIds[1],
    editRequest: false,
    status: "Active",
    productId: productId[6],
  },
];

const bmsSpecsId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const bmsSpecs = [
  {
    _id: bmsSpecsId[0],
    name: "Daly bms discharge/ charge current BMS for Lifepo4",
    imagePath: "public/assets/info2.jpeg",
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
    specCreator: userIds[1],
    editRequest: false,
    status: "Active",
    productId: productId[2],
  },
  {
    _id: bmsSpecsId[1],
    name: "JK SMART BMS 12v 24v 48v Active Balance 7S to 24S 40A to 200A Lifepo4 Lithium ion 32700 21700 18650",
    imagePath: "public/assets/info2.jpeg",
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
    specCreator: userIds[2],
    editRequest: false,
    status: "Active",
    productId: productId[4],
  },
  {
    _id: bmsSpecsId[2],
    name: "16S 3.2V  LFP 100A Same Port With Bluetooth Module",
    imagePath: "public/assets/info2.jpeg",
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
    specCreator: userIds[3],
    editRequest: false,
    status: "Active",
    productId: productId[8],
  },
  {
    _id: bmsSpecsId[3],
    name: "8S 3.2V  LFP 100A Same Port With Bluetooth Module",
    imagePath: "public/assets/info2.jpeg",
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
    specCreator: userIds[3],
    editRequest: false,
    status: "Active",
    productId: productId[9],
  },
];

export const activeBalancerSpecsId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const activeBalancerSpecs = [
  {
    _id: activeBalancerSpecsId[0],
    name: "Active balancer 3S 4S 8S 12S Li-ion Lifepo4 lithium battery active equalizer",
    imagePath: "public/assets/info2.jpeg",
    brand: "Generic",
    supplierLink:
      "https://shopee.ph/Active-balancer-3S-4S-8S-12S-Li-ion-Lifepo4-lithium-battery-active-equalizer-i.498737510.21956687321?sp_atk=df0d4826-3a1e-42d4-b08a-b40dea965f99&xptdk=df0d4826-3a1e-42d4-b08a-b40dea965f99",
    supplier: "Shopee",
    strings: 4,
    balanceCurrent: 1.2,
    balancingType: "Active",
    price: 209,
    specCreator: userIds[2],
    editRequest: false,
    status: "Active",
    productId: productId[3],
  },
  {
    _id: activeBalancerSpecsId[1],
    name: "6S 7S 8S 5A 6A Active Equalizer Balancer/8s equalizer Lifepo4 Lithium Lipo LTO Energy transfer",
    imagePath: "public/assets/info2.jpeg",
    brand: "Generic",
    supplierLink:
      "https://shopee.ph/6S-7S-8S-5A-6A-Active-Equalizer-Balancer-8s-equalizer-Lifepo4-Lithium-Lipo-LTO-Energy-transfe-i.306592453.11771884792?sp_atk=021c4de0-7df3-43ef-b9e3-6f4ea7c9129a&xptdk=021c4de0-7df3-43ef-b9e3-6f4ea7c9129a",
    supplier: "Shopee",
    strings: 8,
    balanceCurrent: 5.5,
    balancingType: "Active",
    price: 1230,
    specCreator: userIds[2],
    editRequest: false,
    status: "Active",
    productId: productId[7],
  },
  {
    _id: activeBalancerSpecsId[2],
    name: "Daly 3S 1A",
    imagePath: "public/assets/info2.jpeg",
    brand: "Daly",
    supplierLink:
      "https://shopee.ph/3S-4S-8S-Balance-Li-ion-Lifepo4-LTO-Lithium-Battery-Active-Equalizer-Balancer-Board-CapacitorBMS-i.18252381.18643600287?sp_atk=374b8628-a572-4e54-95c3-eadc27430c2d&xptdk=374b8628-a572-4e54-95c3-eadc27430c2d",
    supplier: "Shopee",
    strings: 3,
    balanceCurrent: 1,
    balancingType: "Active",
    price: 799,
    specCreator: userIds[2],
    editRequest: false,
    status: "Active",
    productId: productId[10],
  },
];

export const products = [
  {
    _id: productId[0],
    category: "Battery",
    specs: batterySpecsId[0],
    creator: userIds[1],
    publishStatus: "Request",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[1],
    category: "Battery",
    specs: batterySpecsId[1],
    creator: userIds[1],
    publishStatus: "Approved",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[2],
    category: "BMS",
    specs: bmsSpecsId[0],
    creator: userIds[1],
    publishStatus: "Request",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[3],
    category: "ActiveBalancer",
    specs: activeBalancerSpecsId[0],
    creator: userIds[2],
    publishStatus: "Request",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[4],
    category: "BMS",
    specs: bmsSpecsId[1],
    creator: userIds[2],
    publishStatus: "Request",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[5],
    category: "Battery",
    specs: batterySpecsId[2],
    creator: userIds[0],
    publishStatus: "Approved",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[6],
    category: "Battery",
    specs: batterySpecsId[3],
    creator: userIds[1],
    publishStatus: "Approved",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[7],
    category: "ActiveBalancer",
    specs: activeBalancerSpecsId[1],
    creator: userIds[2],
    publishStatus: "Approved",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[8],
    category: "BMS",
    specs: bmsSpecsId[2],
    creator: userIds[3],
    publishStatus: "Approved",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[9],
    category: "BMS",
    specs: bmsSpecsId[3],
    creator: userIds[3],
    publishStatus: "Approved",
    editRequests: [],
    deleteRequests: [],
  },
  {
    _id: productId[10],
    category: "Active Balancer",
    specs: activeBalancerSpecsId[2],
    creator: userIds[2],
    publishStatus: "Approved",
    editRequests: [],
    deleteRequests: [],
  },
];
// TODO: Add edit and delete request dummy data
