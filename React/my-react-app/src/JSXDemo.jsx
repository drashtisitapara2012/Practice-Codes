import React from "react";

class JSXDemo extends React.Component {
    handleOnClick = () => {
        console.log("clicked");
    };
    render() {
        return (
            <>
                <h1 id='jsx'>This is JSX</h1>
                {/*  when jsx in converted to js
                React.createElement(h1,{id:"jsx"},'This is JSX')
                 
                {
                    type : 'h1',
                    props:{
                        id:'jsx,
                        children:'This is JSX'
                  }
                 }
                */}

                <button id="btn" onClick={this.handleOnClick}>
                    Click Here
                </button>
                <h2 className="active">This is another heading</h2>
                <p>React is {5+5} times better than JSX</p>
                {/* React.createElement("button", {
                    id: "btn",
                onClick: function() { }
            }, "Click Here") */}
            </>
        );
    }
}

export default JSXDemo;
