import React, { Component } from 'react';

// libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';


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
            <MuiThemeProvider>
                <div style={mainContainerStyle}>
                    <div style={titleContainer}>
                        <p className="txt-0 p-l p-r bold font-shadow" style={titleStyle}>Life is a journey, pay as you go</p>
                        <p className="txt-2 p-l p-r" style={subtitleStyle}>The integrated payment system for dynamic consumer base</p>
                        <div className="btn-flex-container m-t-md">
                            <div className="btn-flex-item">
                                <RaisedButton label="Merchant" primary={true} />
                            </div>
                            <div className="btn-flex-item">
                                <RaisedButton label="Customer" secondary={true} />
                            </div>
                        </div>
                    </div>
                    

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
            </MuiThemeProvider>
        )
    }
}


const styles = {
    mainContainerStyle: {
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/img/home_bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed"
    },

    titleContainer: {
        position: "absolute",
        top: "40%",
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
        marginRight: 12,
        cursor: "pointer"
    },

    logoImgStyle: {
        width: 24,
        height: 24,
        display: "block"
    }

}

export default NewMainPage;