//we can use interface for objects. we can extend interface as per need. interface support declaration merging means if we decalre 2 interface with same name it will merge both
// interface Rectangle {
//   height1: number,
//   width1: number
// }

// interface ColoredRectangle extends Rectangle {
//   color: string
// }

// const coloredRectangle: ColoredRectangle = {
//   height1: 20,
//   width1: 10,
//   color: "red"
// };

// console.log(coloredRectangle);


//type for unions,intersections and primitives type does not support 2 types with same name
type FirstType={
  name:string;
  age:number;
};
type SecondType={
  address:string;
  phone:string;
};
type CombinedType=FirstType & SecondType;
const person2 : CombinedType={
  name:"john",
  age:20,
  address:"Ahmedabad",
  phone:"123456783",
};
console.log(person2);