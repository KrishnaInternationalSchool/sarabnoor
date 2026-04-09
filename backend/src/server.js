require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/db");
const { bootstrapAppData } = require("./services/bootstrapService");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDatabase();
  await bootstrapAppData();

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
