class InvalidLoginCredentialsError extends Error {
  constructor(opts) {
    super(opts);

    this.type = 'Invalid login credentials';
    this.message = 'Invalid login credentials';
    this.code = 400;
  }
}

module.exports = InvalidLoginCredentialsError;
