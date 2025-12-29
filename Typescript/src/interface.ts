//we can use interface for objects. we can extend interface as per need
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


//type for unions,intersections and primitives
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