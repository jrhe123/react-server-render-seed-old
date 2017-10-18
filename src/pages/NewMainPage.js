import React, { Component } from 'react';

class NewMainPage extends Component{

    render(){

        const bgStyle = {
            width: "100vw",
            height: "100vh",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            filter: "grayscale(0.6)"
        };

        const titleContainer = {
            position: "absolute",
            top: "50%",
            left: 0,
            zIndex: "999",
            width: "100%",
            textAlign: "center"
        };

        const titleStyle = {
            color: "#fff",
            fontSize: "36px"
        };

        const subtitleStyle = {
            color: "#fff",
            fontSize: "18px"
        };

        return (
            <div>
                <div style={titleContainer}>
                    <p style={titleStyle}>Life is a journey, pay as you go</p>
                    <p style={subtitleStyle}>The integrated payment system for dynamic consumer base</p>
                </div>
                <img style={bgStyle} src="/img/home_bg.png" />
            </div>
        )
    }
}

export default NewMainPage;