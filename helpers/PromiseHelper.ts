export function boolResolver(callback) {
  return new Promise((resolve, reject) => {
    callback(
      (i = true) => resolve(i),
      () => reject(false)
    );
  });
}
