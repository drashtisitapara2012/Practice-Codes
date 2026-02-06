let age = 19;
let country = "USA";
let text = "You can Not drive!";

if (country == "USA" && age >= 16) {
    text = "You can drive!";
}
console.log(text);

//Ternary Operator
text = (age < 18) ? "Minor" : "Adult";
console.log(text);

//Switch Statement
let day;
let date = new Date().getDay(); //getDay() returns the day of the week as a number (0-6) 

switch (date) {
    case 0:
        day = "Sunday";
        break;
    case 1:
        day = "Monday";
        break;
    case 2:
        day = "Tuesday";
        break;
    case 3:
        day = "Wednesday";
        break;
    case 4:
        day = "Thursday";
        break;
    case 5:
        day = "Friday";
        break;
    case 6:
        day = "Saturday";
        break;
    default:
        day = "Unknown";
}
console.log("Today is " + day);


//Nullish Coalescing Operator : The ?? operator returns the right operand when the left operand is nullish (null or undefined), otherwise it returns the left operand.
let name = null;
let text1 = "missing";
let result = name ?? text1;
console.log(result);