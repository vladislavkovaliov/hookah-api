class NotFound extends Error {
  constructor(opts) {
    super(opts);

    this.type = 'NotFound';
    this.message = 'NotFound';
    this.code = 404;
  }
}

module.exports = NotFound;
