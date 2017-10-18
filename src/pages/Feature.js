import React, { Component } from 'react';

// libraries
import Slider from 'react-slick';


class Feature extends Component{

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
            mapContainerStyle,
            mapImgStyle,
            counterContainerStyle,
            counterItemStyle,
            counterBoxStyle,
            counterDescContainerStyle,
            counterDescWrapperStyle,
            counterDescStyle,
            counterBgTxtStyle,
            counterSmTxtStyle,
            paymentContainerStyle,
            scenarioContainerStyle,
            flexDisContainerStyle,
            flexDisItemStyle,
            desContainerStyle,
            desContainerWrapperStyle,
            partnerContainerStyle,
            sliderContainerStyle,
            sliderItemStyle,
            sliderItemWrapperStyle,
            sliderItemImgStyle,
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
                    <p style={bannerTxtStyle}>FEATURE</p>
                    <img style={bannerImgStyle} src="/img/feature_bg.png" />
                </div>

                <div style={mapContainerStyle}>
                    <div style={contentContainerStyle}>
                        <p style={Object.assign({}, centerTitleTxtStyle, titleStyle )}>Link China and Canada to expand your business</p>
                        <div style={Object.assign({}, centerDivStyle, delimit )}></div>
                        <img style={mapImgStyle} src="/img/map.png" />
                        <div style={counterContainerStyle}>
                            <div style={counterItemStyle}>
                                <div style={counterBoxStyle}>
                                    <p style={counterBgTxtStyle}>610139</p>
                                    <p style={counterSmTxtStyle}>in 2016</p>
                                </div>
                                <div style={counterDescContainerStyle}>
                                    <div style={counterDescWrapperStyle}>
                                        <p style={counterDescStyle}>Visitors to Canada From China</p>
                                    </div>
                                </div>
                            </div>
                            <div style={counterItemStyle}>
                                <div style={counterBoxStyle}>
                                    <p style={counterBgTxtStyle}>50%</p>
                                    <p style={counterSmTxtStyle}>longer</p>
                                </div>
                                <div style={counterDescContainerStyle}>
                                    <div style={counterDescWrapperStyle}>
                                        <p style={counterDescStyle}>Staying of Chinese travellers in Canada than in USA</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={paymentContainerStyle}>
                    <div style={contentContainerStyle}>
                        <div style={flexDisContainerStyle}>
                            <div style={flexDisItemStyle}>
                                <img src="/img/pos.png" />
                            </div>
                            <div style={flexDisItemStyle}>
                                <div style={desContainerStyle}>
                                    <div style={desContainerWrapperStyle}>
                                        <p style={ titleStyle }>PAYMENT SOLUTION</p>
                                        <div style={delimit}></div>
                                        <ul>
                                            <li>Canadian independen third party payment solution</li>
                                            <li>Providing convenient and efficient mobile paymnet services for the international traveler, local consumers and Merchandise</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={scenarioContainerStyle}>
                    <div style={contentContainerStyle}>
                        <div style={flexDisContainerStyle}>
                            <div style={flexDisItemStyle}>
                                <div style={desContainerStyle}>
                                    <div style={desContainerWrapperStyle}>
                                        <p style={ titleStyle }>SCENARIO</p>
                                        <div style={delimit}></div>
                                        <ul>
                                            <li>Elminate counterfeit coin</li>
                                            <li>Fast and simple processing</li>
                                            <li>Support multiple currencies</li>
                                            <li>Data analysis</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div style={flexDisItemStyle}>
                                <img src="/img/ttc.png" />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={partnerContainerStyle}>
                    <div style={contentContainerStyle}>
                        <p style={Object.assign({}, centerTitleTxtStyle, titleStyle )}>PARTNER</p>
                        <div style={Object.assign({}, centerDivStyle, delimit )}></div>
                        <div style={sliderContainerStyle}>
                            <Slider {...settings}>
                                <div style={sliderItemStyle}>
                                    <div style={sliderItemWrapperStyle}>
                                        <img style={sliderItemImgStyle} src="/img/alipay.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div style={sliderItemWrapperStyle}>
                                        <img style={sliderItemImgStyle} src="/img/wechatPay.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div style={sliderItemWrapperStyle}>
                                        <img style={sliderItemImgStyle} src="/img/td.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div style={sliderItemWrapperStyle}>
                                        <img style={sliderItemImgStyle} src="/img/visa.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div style={sliderItemWrapperStyle}>
                                        <img style={sliderItemImgStyle} src="/img/mastercard.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div style={sliderItemWrapperStyle}>
                                        <img style={sliderItemImgStyle} src="/img/bambora.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div style={sliderItemWrapperStyle}>
                                        <img style={sliderItemImgStyle} src="/img/moneris.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div style={sliderItemWrapperStyle}>
                                        <img style={sliderItemImgStyle} src="/img/wechatPay.png" />
                                    </div>
                                </div>
                            </Slider>
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
        padding: "0 12px",
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
    }

}

export default Feature;
