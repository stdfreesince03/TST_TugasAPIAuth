const {createClient} = require('redis');

const client = createClient({
    password: 'GHY5RDgNXov4go7c5KkEBYKvNlJG67dh',
    socket: {
        host: 'redis-11000.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com',
        port: 11000
    }
});

client.on('error', (err) => {console.log('Redis Client Error',err)});

await client.connect();

module.exports = client;