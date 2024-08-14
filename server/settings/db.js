import mongoose from "mongoose";
import config from 'config';
import { logger } from "./logger.js";

const dbUri = config.get('dbUri');

await mongoose.connect(dbUri);
const db = mongoose.connection;

db.on('error', err => logger.error("Database Connection Failure", { err }));

db.on('open', () => logger.info("Database Connection Established"));

export default db; 
export {db}; 