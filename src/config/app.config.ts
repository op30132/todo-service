

export default (): any => ({
  port: process.env.PORT || 3001,
  prod: JSON.parse(process.env.PROD) || false,
  uri: 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PSD + '@' + process.env.DB_URL + ':' + process.env.DB_PORT + '/admin',
  jwt_secret: process.env.JWT_SECRET,
  jwt_expire: process.env.JWT_EXPIRE || '5m',
  refresh_expire: process.env.REFRESH_EXPIRE || '15d'
})