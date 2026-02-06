//Decorators are functions that add metadata or behavior to classes and class members in a declarative way. Using decorators You add features like logging, validation, authorization, caching using a single line

//Class Decorator : Runs when class is declared.They receive class constructor as their only property. Return new constructor function to replace the original calss
function Logger(constructor: Function) {
  console.log("Class created:", constructor.name);
}

@Logger
class user {
  name = "Drashti";
}


//Method Decorators : Method decorators allow wrapping or modifying class methods at definition time using the property descriptor.
function Log(
  target: any,  //prototype of class
  propertyKey: string,  //method name
  descriptor: PropertyDescriptor ) //controls method behavior Here the prototype Descriptor is 
  // PropertyDescriptor = {
  // value: Function; //value is the original method
  // writable: boolean;
  // enumerable: boolean;
  // configurable: boolean;
  // }
   {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Method ${propertyKey} called with`, args);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number) {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);

//example 2 of method decorator
function Authorize(role1: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = function (this: any, ...args: any[]) {
      if (this.role1 !== role1) {
        throw new Error("Unauthorized");
      }
      return original.apply(this, args);
    };
  };
}

class AdminService {
  role1 = "admin";

 @Authorize("admin")
  deleteUser() {
    console.log("User deleted");
  }
}

new AdminService().deleteUser();


//Property Decorators : Property decorators attach metadata to class properties and are mainly used for validation, mapping, and framework-level features.
function LogProperty(target: any, propertyKey: string) {
  console.log(`Property decorated: ${propertyKey}`);
}

class Product {
  @LogProperty
  title!: string;

  @LogProperty
  price!: number;
}


//Parameter Decorator is applied to a parameter of a method or constructor.
function LogParam(
  target: Object,  //class prototype
  propertyKey: string,  //method name
  index: number  //position of parameter
) {
  console.log(
    `Parameter at position ${index} in method ${propertyKey}`
  );
}

class UserService {
  save(@LogParam name: string, age: number) {}
}
