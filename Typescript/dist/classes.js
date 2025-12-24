"use strict";
class Person {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
const person = new Person("Jane");
console.log(person.getName());
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
}
class Square extends Rectangle {
    constructor(width) {
        super(width, width);
    }
}
const mySq = new Square(20);
console.log(mySq.getArea());
//Abstract Class
class Polygon {
    toString() {
        return `Polygon[area=${this.getArea()}]`;
    }
}
class Rect extends Polygon {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
}
const myRect = new Rect(10, 20);
console.log(myRect.getArea());
