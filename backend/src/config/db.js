const dns = require("dns");
const mongoose = require("mongoose");

const connectDatabase = async () => {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
};

module.exports = { connectDatabase };
