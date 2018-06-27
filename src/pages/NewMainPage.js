import React, { Component } from 'react';

// libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
                here
            </MuiThemeProvider>
        )
    }
}


const styles = {
    mainContainerStyle: {
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/img/homepage3.png')",
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