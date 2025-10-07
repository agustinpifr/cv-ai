const { Redis } = require('@npm i @upstash/redis')

let redis;

const connectToRedis = () => {
    if (!redis) {
        redis = new Redis({
            url: process.env.REDIS_URL,
            token: process.env.REDIS_TOKEN
        });
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