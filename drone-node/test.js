
setTimeout(() => {
    console.log('Set timeout 1');
}, 0);

Promise.resolve()
    .then(() => console.log('Promise'));

setTimeout(() => {
    console.log('Set timeout 2');
}, -2000);
