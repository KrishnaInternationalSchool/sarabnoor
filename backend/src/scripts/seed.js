require("dotenv").config();

const { connectDatabase } = require("../config/db");
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Update = require("../models/Update");

const sampleCampaigns = require("./sample-data.json");

const seed = async () => {
  await connectDatabase();

  await Promise.all([Campaign.deleteMany({}), Update.deleteMany({})]);

  let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (!admin) {
    admin = await User.create({
      name: "Sarab Noor Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin"
    });
  }

  const campaigns = await Campaign.insertMany(sampleCampaigns.campaigns);

  await Update.create({
    title: "Warm meals, shared dignity",
    body: "Every contribution is helping us expand food and support programs with care, transparency, and compassion.",
    image: campaigns[0].coverImage,
    author: admin._id
  });

  console.log("Seed completed");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
