class Person {
    private name: string;

    public constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }
}

const person = new Person("Jane");

console.log(person.getName());


//Inheritance
interface Shape {
    getArea: () => number;
}
class Rectangle implements Shape {
    public constructor(protected readonly width: number, protected readonly height: number) {

    }
    public getArea(): number {
        return this.width * this.height;
    }
}
class Square extends Rectangle {
    public constructor(width: number) {
        super(width, width);
    }
}
const mySq = new Square(20);
console.log(mySq.getArea());


//Abstract Class
abstract class Polygon {
    public abstract getArea(): number;

    public toString(): string {
        return `Polygon[area=${this.getArea()}]`;
    }
}

class Rect extends Polygon {
    public constructor(protected readonly width: number, protected readonly height: number) {
        super();
    }

    public getArea(): number {
        return this.width * this.height;
    }
}

const myRect = new Rect(10, 20);
console.log(myRect.getArea());