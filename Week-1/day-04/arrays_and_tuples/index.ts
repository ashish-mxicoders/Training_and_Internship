var arr = [1,2,3,4] //typescript knows that this is a number array
var b =[1,"l",3]
var arr2:string[]=["hello","world"] //typescript knows that this is a string array
var arr3=[["hi",1],["hello",2]] //here for this nested array if  u hover it shows (string | number)[][] which means it is an array of arrays that can contain either strings or numbers 
//so when possible mostly use single type arrays instead of mixed type arrays for better type safety and clarity in your code.

//---Tuples---
var tuple1:[string,number] = ["hello",1]
console.log(tuple1) //this is a tuple which is a fixed length array with fixed types for each index. Here the first element is string and second is number.
//tupeles array se kese alg hai to jo array hai usme ek hi type ka data dal skte and no fixed length but tuple me pele se bta diya ki pele string ayega fir number to ab [string,number,number] nhi dal skte ye tuples ka sirf itna purpose hi hai

//Tuple kyu, jab array se ho sakta hai?

//Dikkat ye hai ki [string, number] ko normal array me likhoge to type kuch aisa banta hai:


let a: (string | number)[] = ["Ashish", 22];

a[0]; // type: string | number  (pata nahi kya hai)
a[1]; // type: string | number

//Ab a[0].toUpperCase() karoge to error aayega, kyunki TS ko lagta hai ye number bhi ho sakta hai. Har baar check lagana padega:


if (typeof a[0] === "string") a[0].toUpperCase();

//Tuple me ye problem nahi:

let t: [string, number] = ["Ashish", 22];

t[0].toUpperCase(); // ✅ TS ko pata hai ye string hai
t[1].toFixed(2);    // ✅ TS ko pata hai ye number hai

console.log(t)

const coords:[number,number[]] = [1,[2,3,4]] //ye tuple hai jisme pehla element number hai aur dusra element number ka array hai

console.log(coords) //1