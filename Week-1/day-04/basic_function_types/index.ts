function mul(x:number,y:number):number{
    return x*y
}
function div(a:number,b:number):number{
    return a/b
}

function applyfunc(funcs : ((a:number,b:number)=>number)[],
values:[number,number][],
):number[]
{
    const results:number[] = [];
    for(let i=0;i<funcs.length;i++){
        const args = values[i]
        const result = funcs[i](args[0],args[1]);
        results.push(result)
    }
    return results
}





let ans =applyfunc([mul,div],[[1,2],[40,5]])
console.log(ans)