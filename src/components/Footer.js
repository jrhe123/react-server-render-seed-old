import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { root_page } from '../utilities/urlPath'
import { green400 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { showSnackbar }  from '../actions/layout_action';

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
        this.props.dispatch(showSnackbar(''));
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.msg) {
            this.setState({ open: true });
        }
    }

    render() {

        const {
            contentContainerStyle,
            footerContainerStyle,
            footerFlexContainerStyle,
            footerDescContainerStyle,
            boldFont,
            logoContainerStyle,
            logoItemStyle,
            logoImgStyle,
        } = styles;

        return (
            <div style={footerContainerStyle}>
                <div style={contentContainerStyle}>
                    <div style={footerFlexContainerStyle}>
                        <div className="footer-item">
                            <div style={footerDescContainerStyle}>
                                <p className="txt-4" style={boldFont}>OPAY INC.</p>
                                <p className="txt-4">Unit304 - 3950 14TH AVE,</p>
                                <p className="txt-4">MARKHAM, ON L3R 0A9</p>
                                <p className="txt-4">647-931-3090</p>
                                <p className="txt-4">INFO@OPAY.CA</p>
                                <br />
                                <p className="txt-4" style={boldFont}>© 2017 COPYRIGHT OPAY.</p>
                                <Link to={`${root_page}websiteterm`}><p className="txt-4" style={{ display: 'inline' }}>Web Site Terms of Use</p></Link>
                                <p style={{ display: 'inline', fontSize: '20px' }}>&nbsp;|&nbsp;</p>
                                <Link to={`${root_page}privacypolicy`}><p className="txt-4" style={{ display: 'inline' }}>Privacy Policy</p></Link>
                            </div>
                        </div>
                        <div className="footer-item">
                            <div style={footerDescContainerStyle}>
                                <p className="txt-4" style={boldFont}>OPAY CUSTOMER SUPPORT</p>
                                <p className="txt-4">1-833-366-6729</p>
                                <p className="txt-4">1-833-366-OPAY</p>
                                <p className="txt-4">24/7 Hotline</p>
                            </div>
                        </div>
                        <div className="footer-item footer-logo">
                            <div style={logoContainerStyle}>
                                <div style={logoItemStyle}>
                                    <img style={logoImgStyle} src="/img/twitter_icon.png" />
                                </div>
                                <div style={logoItemStyle}>
                                    <img style={logoImgStyle} src="/img/youtube_icon.png" />
                                </div>
                                <div style={logoItemStyle}>
                                    <img style={logoImgStyle} src="/img/instagram_icon.png" />
                                </div>
                                <div style={logoItemStyle}>
                                    <img style={logoImgStyle} src="/img/facebook_icon.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { msg: state.snackbar_reducer.msg };
}

const styles = {

    contentContainerStyle : {
        maxWidth: "1080px",
        margin: "0 auto"
    },

    boldFont: {
        fontWeight: "bold"
    },

    footerContainerStyle: {
        backgroundColor: "#343434",
        paddingTop: "24px",
        paddingBottom: "24px"
    },

    footerFlexContainerStyle: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },

    footerDescContainerStyle: {
        color: "#fff",
        paddingLeft: 24
    },

    logoContainerStyle: {
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
    },
}

export default connect(mapStateToProps)(Footer);