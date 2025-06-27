import mongoose from "mongoose";
import config from 'config';
import { logger } from "./logger.js";

const dbUri = config.get('dbUri');

console.log('Database URI: ',dbUri);
await mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', err => logger.error("Database Connection Failure", { err }));

db.on('open', () => logger.info("Database Connection Established"));

export default db; 
export {db};