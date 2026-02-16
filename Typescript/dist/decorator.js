"use strict";
//Decorators are functions that add metadata or behavior to classes and class members in a declarative way. Using decorators You add features like logging, validation, authorization, caching using a single line
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//Class Decorator : Runs when class is declared.They receive class constructor as their only property. Return new constructor function to replace the original calss
function Logger(constructor) {
    console.log("Class created:", constructor.name);
}
let user = class user {
    constructor() {
        this.name = "Drashti";
    }
};
user = __decorate([
    Logger
], user);
//Method Decorators : Method decorators allow wrapping or modifying class methods at definition time using the property descriptor.
function Log(target, //prototype of class
propertyKey, //method name
descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Method ${propertyKey} called with`, args);
        return originalMethod.apply(this, args);
    };
}
class Calculator {
    add(a, b) {
        return a + b;
    }
}
__decorate([
    Log
], Calculator.prototype, "add", null);
const calc = new Calculator();
calc.add(2, 3);
//example 2 of method decorator
function Authorize(role1) {
    return function (target, propertyKey, descriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args) {
            if (this.role1 !== role1) {
                throw new Error("Unauthorized");
            }
            return original.apply(this, args);
        };
    };
}
class AdminService {
    constructor() {
        this.role1 = "admin";
    }
    deleteUser() {
        console.log("User deleted");
    }
}
__decorate([
    Authorize("admin")
], AdminService.prototype, "deleteUser", null);
new AdminService().deleteUser();
//Property Decorators : 
