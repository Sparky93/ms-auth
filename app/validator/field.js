module.exports.identifier = (req, res, next) => {
  const identifier = req.body.identifier;

  if (!identifier) {
    return res.status(412).json({
      success: false,
      message: "identifier can't be empty"
    });
  }
  next();
};

module.exports.nickname = (req, res, next) => {
  const nickname = req.body.nickname;

  if (!nickname) {
    return res.status(412).json({
      success: false,
      message: "nickname can't be empty"
    });
  }
  next();
};

module.exports.password = (req, res, next) => {
  const pass = req.body.password;

  if (!pass || pass.length < process.env.PASSWORD_STRENGTH) {
    return res.status(412).json({
      success: false,
      message: `minimum password length is ${process.env.PASSWORD_STRENGTH}`
    });
  }
  next();
};

module.exports.description = (req, res, next) => {
  const desc = req.body.description;

  if (!desc || desc.length < 1) {
    return res.status(412).json({
      success: false,
      message: `description too small`
    });
  }
  next();
}

module.exports.value = (req, res, next) => {
  const val = req.body.value;

  if (!val || val.length < 1) {
    return res.status(412).json({
      success: false,
      message: `value too small`
    });
  }
  next();
}