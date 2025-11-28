const { Redis } = require('@upstash/redis')

let redis;

const connectToRedis = () => {
    if (!redis) {
        const url = process.env.REDIS_URL;
        const token = process.env.REDIS_TOKEN;
        
        if (!url || !token) {
            throw new Error(`Redis config missing: REDIS_URL=${url ? 'set' : 'MISSING'}, REDIS_TOKEN=${token ? 'set' : 'MISSING'}`);
        }
        
        redis = new Redis({ url, token });
        console.log('Redis client initialized');
    }
    return redis;
}

const getRedis = () => {
    return connectToRedis();
}

const set = async (key, value) => {
    await redis.set(key, value);
}

const setex = async (key, value, ttl) => {
    await redis.setex(key, ttl, value);
}

const get = async (key) => {
    return await redis.get(key);
}

const keys = async (pattern) => {
    return await redis.keys(pattern);
}

const del = async (key) => {
    await redis.del(key);
}

const incr = async (key) => {
    return await redis.incr(key);
}



module.exports = {
    set,
    setex,
    get,
    keys,
    connectToRedis,
    getRedis,
    del,
    incr
}