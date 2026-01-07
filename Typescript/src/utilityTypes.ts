//Partial changes all the properties in an object to be optional.
interface Point {
    x: number;
    y: number;
}
let pointPart: Partial<Point> = {};
pointPart.x = 10;
console.log(pointPart);

//Required changes all the properties in an object to be required
interface Car {
    make: string;
    model: string;
    mileage?: number;
}
let myCar: Required<Car> = {
    make: 'Ford',
    model: 'Focus',
    mileage: 12000
};
console.log(myCar);

//Record is a shortcut to defining an object type with a specific key type and value type
const nameAgeMap: Record<string, number> = {
    'Alice': 21,
    'Bob': 25
};
console.log(nameAgeMap);

//Omit removes keys from object type
interface People {
    name: string;
    age: number;
    location?: string;
}

const bob: Omit<People, 'age' | 'location'> = {
    name: 'Bob'
};
console.log(bob);

//Pick removes all but the specified keys from an object type
interface Human {
    name1: string;
    age: number;
    location?: string;
}
const bob1: Pick<Human, 'age'> = {
    age: 21
};
console.log(bob1);

//Exclude removes types from a union
type Primitive=string | number | boolean;
const value1:Exclude<Primitive,string>=true;
console.log(value1);


//ReturnType extracts the return type of a function type
type PointGenerator=()=>{x:number;y:number};
const point:ReturnType<PointGenerator>={
    x:10,
    y:20
};
console.log(point);

//Parameters extracts the parameter types of a function type as an array
type PointPrinter=(p:{x:number;y:number;})=>void;
const point1:Parameters<PointPrinter>[0]={
    x:10,
    y:20
};
console.log(point1);

//Readonly is used to create a new type where all properties are readonly, meaning they cannot be modified once assigned a value
interface People{
    name:string;
    age:number;
}
const people:Readonly<People>={
    name:"Dylan",
    age:35,
};
//person.name='Israel';