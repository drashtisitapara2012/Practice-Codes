import React from 'react';
import ReactDOM from 'react-dom/client';

// The state object is where you store property values that belongs to the component.

class Car extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: "Ford",
      model: "Mustang",
      color: "red",
      year: 1964
    };
  }
  changeColor=()=>{
    this.setState({color:"blue"});  //to change the value in teh state object, use this.setState()
  }
  render() {
    return (
      <div>
        <h1>My {this.state.brand}</h1>
        <p>
          It is a {this.state.color}
          {this.state.model}
          from {this.state.year}.
        </p>
        <button type="button" onClick={this.changeColor}>Change Color </button>
      </div>
    );
  }
}
export default Car;
                    