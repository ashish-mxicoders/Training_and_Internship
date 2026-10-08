//this below are litterals, they are not variables, they are types that can only have one value
let direction: "north" | "south" | "east" | "west";

direction = "north"; // ✅ valid
// direction="hello" // ❌ invalid, 

let response:number

let answer:true; //cant assign false or anything else, only true is valid


//---enum---
//now we can use anything but using enum beccause as u can see here small medium large can be anything but enum defines they are sizes
//number enum 
enum Size{
    Small,   //the enum starts with 0 
    Medium,
    Large = 35 //we can assign any no to it
}
var size :Size = Size.Small;
var size2 :Size = 35;


if(size === Size.Small){
    console.log("Size is small");
}

//string enum
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}
