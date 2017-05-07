import cancelAblePromise from '../src/cancelablePromise';

/* global describe it expect*/
describe('Test cancelablePromise', () => {
  it('Should wrap a promise then return object hold promise', (done) => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 10);
    });

    const wrappedPromise = cancelAblePromise(promise);
    wrappedPromise.promise.then((res) => {
      expect(res).toEqual(true);
      done();
    });
  });

  it('Should can be cancel promise', (done) => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 10);
    });


    const wrappedPromise = cancelAblePromise(promise);

    wrappedPromise.cancel();
    wrappedPromise.promise.then().catch((e) => {
      expect(e).toEqual({ isCanceled: true });
      done();
    });
  });

  it('Should can be cancel promise when promise got reject', (done) => {
    const promise = new Promise((resolve, reject) => {
      reject('reject');
    });


    const wrappedPromise = cancelAblePromise(promise);

    wrappedPromise.cancel();
    wrappedPromise.promise.then().catch((e) => {
      expect(e).toEqual({ isCanceled: true });
      done();
    });
  });

  it('Should reject promise normally when no call cancel', (done) => {
    const promise = new Promise((resolve, reject) => {
      reject('reject');
    });


    const wrappedPromise = cancelAblePromise(promise);

    wrappedPromise.promise.then().catch((e) => {
      expect(e).toEqual('reject');
      done();
    });
  });
});
