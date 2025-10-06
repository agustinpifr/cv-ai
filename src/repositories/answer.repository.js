const { getRedis } = require("../services/redis.client");

const redis = getRedis();

/* Mandamos como key userId_answer_questionId y como value su respuesta */
const saveAnswer = async (userId, questionId, questionContent, answer) => {
  if (await redis.get(`${userId}_answer_${questionId}`)) {
    await redis.del(`${userId}_answer_${questionId}`); // Si existe, lo eliminamos
  } 
  await redis.setex(`${userId}_answer_${questionId}`, 60 * 60 * 24 * 30, { questionContent, answer }); // 30 dias
};

const getAnswer = async (userId, questionId) => {
  const { questionContent, answer } = await redis.get(`${userId}_answer_${questionId}`);
  return { questionContent, answer };
};

const getAllAnswers = async (userId) => {
  const keys = await redis.keys(`${userId}_answer_*`);
  const answers = [];
  for (const key of keys) {
    const { questionContent, answer } = await redis.get(key);
    answers.push({ questionContent, answer });
  }
  return answers;
};

module.exports = {
  saveAnswer,
  getAnswer,
  getAllAnswers
};
