module.exports = async function existsByObjectId(model, filter) {
  const isExists = await model.exists(filter);

  return isExists;
};
