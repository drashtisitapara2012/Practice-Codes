class Car{
    constructor(name,year){
        this.name=name;
        this.year=year;
    }
    age(){
        const date=new Date();
        return date.getFullYear()-this.year;
    }
}
const myCar=new Car("Ford",2015);
console.log("My car is "+myCar.name);
console.log("My car is "+myCar.age()+" years old.");

//inheritance
class Car1 {
  constructor(brand) {
    this.carname = brand;
  }
  present() {
    return 'I have a ' + this.carname;
  }
}

class Model extends Car1 {
  constructor(brand, mod) {
    super(brand); //calls the parent class constructor
    this.model = mod;
  }
  show() {
    return this.present() + ', it is a ' + this.model;
  }
}

let myCar1 = new Model("Ford", "Mustang");
console.log(myCar1.show());  

// A static method belongs to the class itself, not to objects.
class Helper {
  static hello() {
    return "Hello World!";
  }
}

console.log(Helper.hello());
//const helper = new Helper();
//console.log(helper.hello()); // This will generate an error because hello() is a static method