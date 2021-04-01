import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";

export default (): MongooseModuleOptions => ({
  uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PSD}@${process.env.DB_URL}:${process.env.DB_PORT}/admin`,
  // uri: 'mongodb://root:test@192.168.99.100:27017/admin',
  useNewUrlParser: true,
  useUnifiedTopology: true
})