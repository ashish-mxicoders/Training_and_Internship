"use strict";
function mul(x, y) {
    return x * y;
}
function div(a, b) {
    return a / b;
}
function applyfunc(funcs, values) {
    const results = [];
    for (let i = 0; i < funcs.length; i++) {
        const args = values[i];
        const result = funcs[i](args[0], args[1]);
        results.push(result);
    }
    return results;
}
let ans = applyfunc([mul, div], [[1, 2], [40, 5]]);
console.log(ans);
