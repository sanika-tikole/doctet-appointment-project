const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // Some networks fail SRV lookups in Node; allow custom DNS resolvers via env.
    const dnsServers = (process.env.MONGO_DNS_SERVERS || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    if (dnsServers.length > 0) {
      dns.setServers(dnsServers);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
