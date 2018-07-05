async function assertThrowsAsync(promise, regExp, msg) {
  let f = () => {};
  try {
    await promise;
  } catch (e) {
    f = () => {
      throw e
    };
  } finally {
    assert.throws(f, regExp);
  }
}

module.exports = { assertThrowsAsync }