const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const SessionModel = require('../models/session.model');
const UserModel = require('../models/user.model');
const { Unauthorized } = require('../errors');

const auth = async (req, res, next) => {
  try {
    const token = req.header('hookah-jwt');
    const data = jwt.verify(token, 'secret13');
    let filter = {
      userId: mongoose.Types.ObjectId(data._id),
      token,
    };
    const session = await SessionModel.findOne(filter);
    if (!session) {
      await UserModel.update(
       { _id: mongoose.Types.ObjectId(data._id) },
       { $pull: { tokens: { $in: token } } },
      );
      throw new Unauthorized();
    }

    const user = await UserModel.findOne({
      _id: data._id,
      tokens: { $in: token },
    });

    req.user = user._doc; // eslint-disable-line
    req.token = token;    // eslint-disable-line

    next();
  } catch (e) {
    console.trace(e);
    next(e);
  }
};

module.exports = auth;
