"use strict";
//this below are litterals, they are not variables, they are types that can only have one value
let direction;
direction = "north"; // ✅ valid
// direction="hello" // ❌ invalid, 
let response;
let answer; //cant assign false or anything else, only true is valid
//---enum---
//now we can use anything but using enum beccause as u can see here small medium large can be anything but enum defines they are sizes
//number enum 
var Size;
(function (Size) {
    Size[Size["Small"] = 0] = "Small";
    Size[Size["Medium"] = 1] = "Medium";
    Size[Size["Large"] = 35] = "Large"; //we can assign any no to it
})(Size || (Size = {}));
var size = Size.Small;
var size2 = 35;
if (size === Size.Small) {
    console.log("Size is small");
}
//string enum
var Direction;
(function (Direction) {
    Direction["Up"] = "UP";
    Direction["Down"] = "DOWN";
    Direction["Left"] = "LEFT";
    Direction["Right"] = "RIGHT";
})(Direction || (Direction = {}));
