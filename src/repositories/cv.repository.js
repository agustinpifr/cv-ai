const Cv = require("../models/cv.models");

const saveCV = async (userId, pdfBuffer, templateName) => {
  const cv = new Cv({ userId, pdfBuffer, templateName });
  return await cv.save();
};

const findCVsByUser = async (userId, { page = 1, limit = 10 } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const query = { userId };
  const [items, total] = await Promise.all([
    Cv.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Cv.countDocuments(query)
  ]);
  const totalPages = Math.ceil(total / limitNum) || 1;
  return { items, total, page: pageNum, limit: limitNum, totalPages };
};

module.exports = {
  saveCV,
  findCVsByUser
}