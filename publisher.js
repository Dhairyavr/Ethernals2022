const Redis = require("ioredis");

const redis = new Redis({
  port: 10922,
  host: `${process.env.REDIS_HOST}`,
  password: `${process.env.REDIS_PASSWORD}`,
});

exports.SetData = async (key, value, ex) => {
  await redis.setex(key, value, ex);
};
