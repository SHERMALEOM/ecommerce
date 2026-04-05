import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: 'TSwpOe0eOo3YKIwJqSKy4CT2gnzbg5pW',
    socket: {
        host: 'redis-18693.c212.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 18693
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

await redisClient.set('foo', 'bar');

const result = await redisClient.get('foo');
console.log(result); // bar

export default redisClient;