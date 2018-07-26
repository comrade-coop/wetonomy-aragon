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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { assertThrowsAsync, sleep }