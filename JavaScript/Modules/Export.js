const name="John";
const age=20;

//exporting variables
export {name,age};

//exporting function
export function greet(){
    console.log("Hello "+name);
} 

//default export
export default function info(){
    console.log("Name: "+name+", Age: "+age);
}