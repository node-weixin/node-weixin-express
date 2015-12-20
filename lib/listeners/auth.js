module.exports = {
  /**
   * oauth creation process wil be called when an oauth request is executed
   * @param appConfig
   * @returns {Function}
   */
  onAuth: function () {
    return function () {
      console.log(arguments);
    };
  }
};
