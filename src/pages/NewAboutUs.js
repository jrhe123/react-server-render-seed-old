import React, { Component } from 'react';

// libraries
import Slider from 'react-slick';


class NewAboutUs extends Component{

    render(){

        const {
            bannerContainerStyle,
            bannerImgStyle,
            bannerTxtStyle,
            contentContainerStyle,
            centerTitleTxtStyle,
            centerDivStyle,
            titleStyle,
            delimit,

            detailContainerStyle,
            detailFlexContainerStyle,
            detailFlexItemStyle,

            teamContainerStyle,
            teamFlexContainerStyle,
            teamFlexItemStyle,
            teamImgStyle,
            teamDescStyle,

            footerContainerStyle,
            footerFlexContainerStyle,
            footerFlexItemStyle,
            footerDescContainerStyle,
            boldFont,
            logoContainerStyle,
            logoItemStyle,
            logoImgStyle,
        } = styles;

        const settings = {
            dots: true,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            className: 'center',
            centerMode: true,
            centerPadding: '60px',
        };

        return(

            <div>
                <div style={bannerContainerStyle}>
                    <p style={bannerTxtStyle}>ABOUT US</p>
                    <img style={bannerImgStyle} src="/img/feature_bg.png" />
                </div>

                <div style={detailContainerStyle}>
                    <div style={contentContainerStyle}>
                        <div style={detailFlexContainerStyle}>
                            <div style={detailFlexItemStyle}>
                                <p>
                                    Opay Inc. established in Toronto and incorporated under the Canadian Federal Government. OPay is the subsidiary of Open Decisions Inc. which has extensive experience with banking and Telco system deploy- ment, IT architecture and production operations. Most of the executive directors come from leading com- puter and networking companies with a lot of system design and management experiences. Open Decisions has established a strong customer base comprising major players in the  nancial and Telco industries. Our major customers include well-known banks such as Bank of China, China Construction Bank, Industrial and Commercial Bank of China, etc.
                                </p>
                            </div>
                            <div style={detailFlexItemStyle}>
                                <p>
                                    Registered as a money service business (MSB) by FINTRAC, Opay is planning to take the next strategic step. The company plans to utilize its advantages by enriching its mobile payment platform and expanding its global presence.
                                </p>
                                <p>
                                    Alipay and Wechat payment have become a fast –adapted payment method in China. Opay will implement these payment method into Canadian market and help the Canadian businesses to attract more Chinese visitors and students who travelling and staying in Canada, as Chinese consumers do not have to carry lots of cash and in- ter-banking limitations in Canada.
                                </p>
                                <p>
                                    In advance, Opay is seeking a business partnership to extend these advance payment method to non-Chinese consumers. This will add further to the value of the company and strengthen its position in Canadian money service business market.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>   


                <div style={teamContainerStyle}>
                    <div style={contentContainerStyle}>
                        <p style={Object.assign({}, centerTitleTxtStyle, titleStyle )}>OUR TEAM</p>
                        <div style={Object.assign({}, centerDivStyle, delimit )}></div>
                        <div style={teamFlexContainerStyle}>
                            <div style={teamFlexItemStyle}>
                                <img style={teamImgStyle} src="/img/feature_bg.png" />
                                <p style={Object.assign({}, boldFont, teamDescStyle )}>123</p>
                                <p style={teamDescStyle}>123</p>
                            </div>
                            <div style={teamFlexItemStyle}>
                                <img style={teamImgStyle} src="/img/feature_bg.png" />
                                <p style={Object.assign({}, boldFont, teamDescStyle )}>123</p>
                                <p style={teamDescStyle}>123</p>
                            </div>
                            <div style={teamFlexItemStyle}>
                                <img style={teamImgStyle} src="/img/feature_bg.png" />
                                <p style={Object.assign({}, boldFont, teamDescStyle )}>123</p>
                                <p style={teamDescStyle}>123</p>
                            </div>
                            <div style={teamFlexItemStyle}>
                                <img style={teamImgStyle} src="/img/feature_bg.png" />
                                <p style={Object.assign({}, boldFont, teamDescStyle )}>123</p>
                                <p style={teamDescStyle}>123</p>
                            </div>
                            <div style={teamFlexItemStyle}>
                                <img style={teamImgStyle} src="/img/feature_bg.png" />
                                <p style={Object.assign({}, boldFont, teamDescStyle )}>123</p>
                                <p style={teamDescStyle}>123</p>
                            </div>
                            <div style={teamFlexItemStyle}>
                                <img style={teamImgStyle} src="/img/feature_bg.png" />
                                <p style={Object.assign({}, boldFont, teamDescStyle )}>123</p>
                                <p style={teamDescStyle}>123</p>
                            </div>
                            <div style={teamFlexItemStyle}>
                                <img style={teamImgStyle} src="/img/feature_bg.png" />
                                <p style={Object.assign({}, boldFont, teamDescStyle )}>123</p>
                                <p style={teamDescStyle}>123</p>
                            </div>
                            <div style={teamFlexItemStyle}>
                                <img style={teamImgStyle} src="/img/feature_bg.png" />
                                <p style={Object.assign({}, boldFont, teamDescStyle )}>123</p>
                                <p style={teamDescStyle}>123</p>
                            </div>
                            <div style={teamFlexItemStyle}>
                                <img style={teamImgStyle} src="/img/feature_bg.png" />
                                <p style={Object.assign({}, boldFont, teamDescStyle )}>123</p>
                                <p style={teamDescStyle}>123</p>
                            </div>
                        </div>
                    </div>
                </div> 

                <div style={footerContainerStyle}>
                    <div style={contentContainerStyle}>
                        <div style={footerFlexContainerStyle}>
                            <div style={footerFlexItemStyle}>
                                <div style={footerDescContainerStyle}>
                                    <p style={boldFont}>OPAY INC.</p>
                                    <p>Unit304 - 3950 14TH AVE,</p>
                                    <p>MARKHAM, ON L3R 0A9</p>
                                    <p>647-931-3090</p>
                                    <p>INFO@OPAY.CA</p>
                                    <br />
                                    <p style={boldFont}>© 2017 COPYRIGHT OPAY.</p>
                                </div>
                            </div>
                            <div style={footerFlexItemStyle}>
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
                    




            </div>
        )
    }
}

const styles = {

    bannerContainerStyle : {
        position: "relative"
    },

    bannerImgStyle : {
        width: "100vw",
        height: "300px"
    },

    bannerTxtStyle : {
        position: "absolute",
        left: "0",
        bottom: "12px",
        margin: 0,
        width: "100%",
        paddingLeft: "36px",
        color: "white",
        fontSize: "36px",
        fontWeight: "bold"
    },

    contentContainerStyle : {
        maxWidth: "1080px",
        margin: "0 auto"
    },

    titleStyle : {
        fontSize: "24px",
        marginBottom: "12px"
    },

    centerTitleTxtStyle : {
        textAlign: "center"
    },

    centerDivStyle : {
        margin: "0 auto"
    },

    delimit: {
        height: "2px",
        width: "60px",
        backgroundColor: "#000",
        marginBottom: "24px"
    },

    mapContainerStyle : {
        backgroundColor: "white",
        paddingTop: "24px",
        paddingBottom: "24px"
    },

    mapImgStyle: {
        display: "block",
        width: "80%",
        margin: "0 auto"
    },

    counterContainerStyle: {
        width: "80%",
        margin: "12px auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },

    counterItemStyle: {
        width: "45%",
        minWidth: "400px",
        position: "relative",
        marginTop: 12,
        marginBottom: 12
    },

    counterBoxStyle: {
        float: "left",
        display: "inline-block",
        borderRadius: "12px",
        backgroundColor: "#343434",
        padding: "6px 12px",
        height: 60,
        width: 100
    },

    counterBgTxtStyle: {
        color: "#fff",
        margin: 0,
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center"
    }, 

    counterSmTxtStyle: {
        color: "#fff",
        margin: 0,
        textAlign: "center",
        fontSize: "16px",
    },

    counterDescContainerStyle: {
        float: "left",
        display: "inline-block",
        width: "calc(100% - 100px)",
        paddingLeft: 12,
        height: 60
    },

    counterDescWrapperStyle: {
        display: "table",
        height: 60,
        width: "80%",
    },

    counterDescStyle: {
        margin: 0,
        display: "table-cell",
        verticalAlign: "middle",
        fontSize: "16px"
    },
    
    paymentContainerStyle: {
        backgroundColor: "#EDECEC",
    },

    scenarioContainerStyle: {
        backgroundColor: "#fff",
    },

    flexDisContainerStyle: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },

    flexDisItemStyle: {
        width: "50%",
    },

    desContainerStyle:{ 
        display: "table",
        height: "100%"
    },

    desContainerWrapperStyle: {
        display: "table-cell",
        verticalAlign: "middle",
        paddingLeft: 24,
        paddingRight: 24
    },

    partnerContainerStyle:{
        backgroundColor: "#EDECEC",
        paddingTop: "24px",
        paddingBottom: "48px"
    },

    sliderContainerStyle: {
        width: "80%",
        margin: "12px auto"
    },

    sliderItemStyle: {
        height: 40,
    },

    sliderItemWrapperStyle: {
        maxWidth: 120,
        height: 40,
        margin: "0 auto",
        backgroundColor: "#D7D8D7",
        borderRadius: "6px",
        display: "table"
    },

    sliderItemImgStyle: {
        height: 30,
        width: "auto",
        display: "block",
        margin: "5px auto"
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

    footerFlexItemStyle: {
        width: "50%",
    },

    footerDescContainerStyle: {
        color: "#fff",
        paddingLeft: 24
    },

    boldFont: {
        fontWeight: "bold"
    },

    logoContainerStyle: {
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
    },

    detailContainerStyle: {
        backgroundColor: "white",
        paddingTop: "24px",
        paddingBottom: "24px"
    },

    detailFlexContainerStyle: {
        paddingLeft: 12,
        paddingRight: 12,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },

    detailFlexItemStyle: {
        width: "50%",
        minWidth: 400,
        padding: 12
    },

    teamContainerStyle: {
        backgroundColor: "#F2F1F1",
        paddingTop: "24px",
        paddingBottom: "24px"
    },

    teamFlexContainerStyle: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },

    teamFlexItemStyle: {
        width: "33.33%",
    },

    teamImgStyle: {
        display: "block",
        height: 120,
        width: 120,
        margin: "0 auto"
    },

    teamDescStyle: {
        textAlign: "center",
        margin: 0
    }
}

export default NewAboutUs;
