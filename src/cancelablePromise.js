const cancelablePromise = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) => {
      if (hasCanceled_) {
        reject({ isCanceled: true });
      } else {
        resolve(val);
      }
    })
      .catch((error) => {
        if (hasCanceled_) {
          reject({ isCanceled: true });
        } else {
          reject(error);
        }
      });
  });

  return {
    promise: wrappedPromise,
    /* Call cancel promise */
    cancel() {
      hasCanceled_ = true;
    },
    then(call) {
      return wrappedPromise.then(call);
    },
  };
};

export default cancelablePromise;
