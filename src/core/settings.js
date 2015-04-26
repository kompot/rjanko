export default {

  apiHost: () => process.env.NODE_ENV === 'production'
    ? process.env.API_HOST
    : process.env.API_HOST || 'http://localhost:3000'

}
