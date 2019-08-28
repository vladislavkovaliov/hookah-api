class Unauthorized extends Error {
  constructor(opts) {
    super(opts);

    this.type = 'Unauthorized';
    this.message = 'Unauthorized';
    this.code = 401;
  }
}

module.exports = Unauthorized;
