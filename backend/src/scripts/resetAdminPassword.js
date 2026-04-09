require("dotenv").config();

const { connectDatabase } = require("../config/db");
const User = require("../models/User");

const run = async () => {
  await connectDatabase();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@sarabnoor.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    throw new Error(`Admin user not found for email: ${adminEmail}`);
  }

  admin.password = adminPassword;
  admin.role = "admin";
  await admin.save();

  console.log(`Admin password reset successfully for ${adminEmail}`);
  process.exit(0);
};

run().catch((error) => {
  console.error("Failed to reset admin password", error);
  process.exit(1);
});
