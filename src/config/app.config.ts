

export default (): any => ({
  port: process.env.PORT || 3001,
  prod: JSON.parse(process.env.PROD) || false,
  front_end_url: process.env.FRONT_END_URL,
  uri: 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PSD + '@' + process.env.DB_URL + '/'+process.env.DB_NAME+'?retryWrites=true&w=majority',
  jwt_secret: process.env.JWT_SECRET,
  jwt_expire: process.env.JWT_EXPIRE || '5m',
  refresh_expire: process.env.REFRESH_EXPIRE || '15d'
})