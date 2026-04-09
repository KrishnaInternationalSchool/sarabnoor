const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Update = require("../models/Update");
const sampleData = require("../scripts/sample-data.json");

const bootstrapAppData = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: "Sarab Noor Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin"
      });
    }
  }

  const campaignCount = await Campaign.countDocuments();

  if (campaignCount === 0) {
    const campaigns = await Campaign.insertMany(sampleData.campaigns);
    const admin = await User.findOne({ email: adminEmail });

    if (admin) {
      await Update.create({
        title: "Warm meals, shared dignity",
        body: "Every contribution is helping us expand food and support programs with care, transparency, and compassion.",
        image: campaigns[0].coverImage,
        author: admin._id
      });
    }
  }
};

module.exports = { bootstrapAppData };
