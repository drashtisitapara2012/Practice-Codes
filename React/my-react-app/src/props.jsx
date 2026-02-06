import { createRoot } from 'react-dom/client'

function Car(props) {
    const { color } = props; //You can limit the properties a component receives by using destructuring.
    return (
        <>
            <h2>I am a {props.brand}!</h2>
            <h2>My car is a {props.carinfo[0]} {props.carinfo[1]}!</h2>
            <h2>My car is of {color} colour..</h2>
        </>
    );
}
const carInfo = ["Ford", "Mustang"];
function Garage() {
    return (
        <>
            <h1>Who lives in my garage?</h1>
            <Car brand="Ford" carinfo={carInfo} model="Mustang" color="red" year={1969} />
        </>
    );
}


//props.children property
function Son(props) {
    return (
        <div style={{ background: 'lightgreen' }}>
            <h2>Son</h2>
            <div>{props.children}</div>
        </div>
    );
}

function Daughter(props) {
    return (
        <div style={{ background: 'lightblue' }}>
            <h2>Daughter</h2>
            <div>{props.children}</div>
        </div>
    );
}
function Parent() {
    return (
        <div>
            <h1>My two Children</h1>
            <Son>
                <p>
                    This was written in the Parent component,
                    but displayed as a part of the Son component
                </p>
            </Son>
            <Daughter>
                <p>
                    This was written in the Parent component,
                    but displayed as a part of the Daughter component
                </p>
            </Daughter>
        </div>
    );
}

export { Garage, Parent };
