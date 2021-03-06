require('dotenv').config();
const express = require('express')
const app = express()
const graphQLHTTP = require('express-graphql').graphqlHTTP
const graphQL = require('./graphql')
const mongoose = require('mongoose')
const wireguard = require('./wireguard')
const ipWhitelist = require('ip-whitelist')
const Server = require('/home/ubuntu/wirapi/mongoose').Server

if(typeof URLSearchParams === 'undefined'){
    URLSearchParams = require('url').URLSearchParams;
}


mongoose.connect('mongodb://localhost/lead-knight2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log('Database connected'))

// checks for root permission in order to access the WG interface
if (process.env.SUDO_UID) {
    console.log('Root permission acquired')
} else {
    console.error('Root permission failed, terminating');
    process.exit(-1)
}

// load peer information in the database into WireGuard CLI
wireguard.initialize()
    .then(console.log('WireGuard initialized'))



// start the server
app.listen(80)
console.log('Server running')

/* // debugging code to find your IP address
app.use((req, res, next) => {
    console.log(req.connection.remoteAddress)
    next()
})
*/

// set up IP whitelisting for basic access control
//app.use(ipWhitelist(ipWhitelist.array(process.env.WHITELISTED_IPS.split(','))))

// setup GraphQL route
app.use('/', graphQLHTTP({
    schema: graphQL.schema,
    graphiql: true
}))

// periodically check the WireGuard CLI for updates
//setInterval(wireguard.checkStatus, process.env.CHECK_STATUS_INTERVAL)
