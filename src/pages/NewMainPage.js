import React, { Component } from 'react';

class NewMainPage extends Component{

    render(){

        const {
            mainContainerStyle,
            bgStyle,
            titleContainer,
            titleStyle,
            subtitleStyle,
            logoContainerStyle,
            logoItemStyle,
            logoImgStyle,
        } = styles;

        return (
            <div style={mainContainerStyle}>
                <div style={titleContainer}>
                    <p className="txt-1 p-l p-r" style={titleStyle}>Life is a journey, pay as you go</p>
                    <p className="txt-2 p-l p-r" style={subtitleStyle}>The integrated payment system for dynamic consumer base</p>
                </div>
                <img style={bgStyle} src="/img/home_bg.png" />

                <div style={logoContainerStyle}>
                        <div style={logoItemStyle}>
                            <img style={logoImgStyle} src="/img/twitter_white_icon.png" />
                        </div>
                        <div style={logoItemStyle}>
                            <img style={logoImgStyle} src="/img/youtube_white_icon.png" />
                        </div>
                        <div style={logoItemStyle}>
                            <img style={logoImgStyle} src="/img/instagram_white_icon.png" />
                        </div>
                        <div style={logoItemStyle}>
                            <img style={logoImgStyle} src="/img/facebook_white_icon.png" />
                        </div>
                </div>
            </div>
        )
    }
}

const styles = {
    mainContainerStyle: {
        position: "relative",
        width: "100vw",
        height: "100vh",
    },

    bgStyle: {
        width: "100vw",
        height: "100vh",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        filter: "grayscale(0.6)"
    },

    titleContainer: {
        position: "absolute",
        top: "50%",
        left: 0,
        zIndex: "999",
        width: "100%",
        textAlign: "center"
    },

    titleStyle: {
        color: "#fff",
    },

    subtitleStyle: {
        color: "#fff",
    },

    logoContainerStyle: {
        position: "absolute",
        bottom: 12,
        right: 0,
        width: "100%",
        height: 24,
    },

    logoItemStyle: {
        float: "right",
        width: 24,
        height: 24,
        marginRight: 12
    },

    logoImgStyle: {
        width: 24,
        height: 24,
        display: "block"
    }

}

export default NewMainPage;