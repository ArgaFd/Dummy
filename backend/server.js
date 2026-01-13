require('dotenv').config();

const app = require('./app');
const { pingPostgres } = require('./db/postgres');
const { connectMongo } = require('./db/mongo');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await pingPostgres();
  await connectMongo();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on port ${PORT}`);
  });
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
