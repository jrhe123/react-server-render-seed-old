import React, { Component } from 'react';

// libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';

// Component
import Header from '../components/Header';

// Router
import { root_page, merchant_login } from '../utilities/urlPath'

// API
import { facebook, twitter, instagram, youtube } from '../utilities/apiUrl'


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
                <div style={{ zIndex: '2000', position:'fixed' }}>
                    <Header pathname={this.props.location.pathname}/>
                </div>
                <div style={mainContainerStyle}>
                    <div style={titleContainer}>
                        <p className="txt-0 p-l p-r bold font-shadow" style={titleStyle}>Life is a journey, pay as you go</p>
                        <p className="txt-2 p-l p-r" style={subtitleStyle}>The integrated payment system for dynamic consumer base</p>
                        <div className="btn-flex-container">
                            <div className="btn-flex-item">
                                <Link to={`${root_page}${merchant_login}`}><RaisedButton className="raised-btn" label="Merchant" backgroundColor="#E5873C" labelColor="#FFF" /></Link>
                            </div>
                            <div className="btn-flex-item">
                                <RaisedButton className="raised-btn" label="Customer" backgroundColor="#E5873C" labelColor="#FFF" />
                            </div>
                        </div>
                    </div>

                    <div style={logoContainerStyle}>
                            <div style={logoItemStyle}>
                                <a href={twitter}><img style={logoImgStyle} src="/img/twitter_icon.png" /></a>
                            </div>
                            <div style={logoItemStyle}>
                                <a href={youtube}><img style={logoImgStyle} src="/img/youtube_icon.png" /></a>
                            </div>
                            <div style={logoItemStyle}>
                                <a href={instagram}><img style={logoImgStyle} src="/img/instagram_icon.png" /></a>
                            </div>
                            <div style={logoItemStyle}>
                                <a href={facebook}><img style={logoImgStyle} src="/img/facebook_icon.png" /></a>
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