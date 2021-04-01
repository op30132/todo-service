const mongos_uri = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PSD + '@' + process.env.DB_URL + ':' + process.env.DB_PORT + '/admin';


export default (): any => ({
  port: process.env.PORT,
  prod: JSON.parse(process.env.PROD),
  uri: process.env.URI,
  database: {
    uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PSD}@${process.env.DB_URL}:${process.env.DB_PORT}/admin`,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
})