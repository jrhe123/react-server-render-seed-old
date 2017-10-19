import React, { Component } from 'react';

// libraries
import Slider from 'react-slick';

// components
import Logo from '../components/Logo/Logo';

class Feature extends Component{

    constructor(props) {
        super(props);
        this.state = {
            posting: true
        }
    }

    componentDidMount(){
        setTimeout(() => {
    		this.setState({posting: false}); }, 1500
        );
    }

    render(){

        if(this.state.posting){
            return (
                <div className="logo-wrapper">
                    <div className="logo-container">
                        <Logo 
                            containerWidth={80}
                            containerHeight={180}
                            logoWidth={15}
                            logoHeight1={60}
                            logoHeight2={80}
                            logoHeight3={100}
                            logoHeight4={70}
                            borderRadius={12}
                            textColor={"white"} />
                    </div>    
                </div>
            )
        }

        const {
            bannerContainerStyle,
            bannerImgStyle,
            bannerTxtStyle,
            contentContainerStyle,
            centerTitleTxtStyle,
            centerDivStyle,
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
            dots: false,
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
                    <p className="txt-1" style={bannerTxtStyle}>SERVICE</p>
                    <img className="banner-img" style={bannerImgStyle} src="/img/bw_1.png" />
                </div>

                <div style={mapContainerStyle}>
                    <div style={contentContainerStyle}>
                        <p className="txt-2 m-b p-l p-r" style={centerTitleTxtStyle}>Link China and Canada to expand your business</p>
                        <div style={Object.assign({}, centerDivStyle, delimit )}></div>
                        <img style={mapImgStyle} src="/img/map.png" />
                        <div className="counter-container" style={counterContainerStyle}>
                            <div className="flex-item-2" style={counterItemStyle}>
                                <div className="counter-box" style={counterBoxStyle}>
                                    <p className="txt-3" style={counterBgTxtStyle}>610139</p>
                                    <p className="txt-4" style={counterSmTxtStyle}>in 2016</p>
                                </div>
                                <div className="counter-desc-container" style={counterDescContainerStyle}>
                                    <div className="counter-desc-wrapper" style={counterDescWrapperStyle}>
                                        <p className="txt-4" style={counterDescStyle}>Visitors to Canada From China</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-item-2" style={counterItemStyle}>
                                <div className="counter-box" style={counterBoxStyle}>
                                    <p className="txt-3" style={counterBgTxtStyle}>50%</p>
                                    <p className="txt-4" style={counterSmTxtStyle}>longer</p>
                                </div>
                                <div className="counter-desc-container" style={counterDescContainerStyle}>
                                    <div className="counter-desc-wrapper" style={counterDescWrapperStyle}>
                                        <p className="txt-4" style={counterDescStyle}>Staying of Chinese travellers in Canada than in USA</p>
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
                                        <p className="txt-2 m-b">PAYMENT SOLUTION</p>
                                        <div style={delimit}></div>
                                        <ul>
                                            <li className="txt-3">Canadian independen third party payment solution</li>
                                            <li className="txt-3">Providing convenient and efficient mobile paymnet services for the international traveler, local consumers and Merchandise</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={scenarioContainerStyle}>
                    <div style={contentContainerStyle}>
                        <div className="m-t-md" style={flexDisContainerStyle}>
                            <div style={flexDisItemStyle}>
                                <div style={desContainerStyle}>
                                    <div style={desContainerWrapperStyle}>
                                        <p className="txt-2 m-b">SCENARIO - (Public Transit)</p>
                                        <div style={delimit}></div>
                                        <ul>
                                            <li className="txt-3">Elminate counterfeit coin</li>
                                            <li className="txt-3">Fast and simple processing</li>
                                            <li className="txt-3">Support multiple currencies</li>
                                            <li className="txt-3">Data analysis</li>
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
                        <p className="txt-2 m-b p-l p-r" style={centerTitleTxtStyle}>PARTNER</p>
                        <div style={Object.assign({}, centerDivStyle, delimit )}></div>
                        <div style={sliderContainerStyle}>
                            <Slider {...settings}>
                                <div style={sliderItemStyle}>
                                    <div className="slider-item-wrapper" style={sliderItemWrapperStyle}>
                                        <img className="slider-item-img" style={sliderItemImgStyle} src="/img/p_1.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div className="slider-item-wrapper" style={sliderItemWrapperStyle}>
                                        <img className="slider-item-img" style={sliderItemImgStyle} src="/img/p_2.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div className="slider-item-wrapper" style={sliderItemWrapperStyle}>
                                        <img className="slider-item-img" style={sliderItemImgStyle} src="/img/p_3.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div className="slider-item-wrapper" style={sliderItemWrapperStyle}>
                                        <img className="slider-item-img" style={sliderItemImgStyle} src="/img/p_4.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div className="slider-item-wrapper" style={sliderItemWrapperStyle}>
                                        <img className="slider-item-img" style={sliderItemImgStyle} src="/img/p_5.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div className="slider-item-wrapper" style={sliderItemWrapperStyle}>
                                        <img className="slider-item-img" style={sliderItemImgStyle} src="/img/p_6.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div className="slider-item-wrapper" style={sliderItemWrapperStyle}>
                                        <img className="slider-item-img" style={sliderItemImgStyle} src="/img/p_7.png" />
                                    </div>
                                </div>
                                <div style={sliderItemStyle}>
                                    <div className="slider-item-wrapper" style={sliderItemWrapperStyle}>
                                        <img className="slider-item-img" style={sliderItemImgStyle} src="/img/p_8.png" />
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
                                    <p className="txt-4" style={boldFont}>OPAY INC.</p>
                                    <p className="txt-4">Unit304 - 3950 14TH AVE,</p>
                                    <p className="txt-4">MARKHAM, ON L3R 0A9</p>
                                    <p className="txt-4">647-931-3090</p>
                                    <p className="txt-4">INFO@OPAY.CA</p>
                                    <br />
                                    <p className="txt-4" style={boldFont}>© 2017 COPYRIGHT OPAY.</p>
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
    },

    bannerTxtStyle : {
        position: "absolute",
        left: "0",
        bottom: "12px",
        margin: 0,
        width: "100%",
        paddingLeft: "24px",
        color: "white",
        fontWeight: "bold"
    },

    contentContainerStyle : {
        maxWidth: "1080px",
        margin: "0 auto"
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
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        margin: "0 auto"
    },

    counterItemStyle: {
        position: "relative",
    },

    counterBoxStyle: {
        float: "left",
        display: "inline-block",
        backgroundColor: "#343434",
    },

    counterBgTxtStyle: {
        color: "#fff",
        margin: 0,
        fontWeight: "bold",
        textAlign: "center"
    }, 

    counterSmTxtStyle: {
        color: "#fff",
        margin: 0,
        textAlign: "center",
    },

    counterDescContainerStyle: {
        float: "left",
        display: "inline-block",
    },

    counterDescWrapperStyle: {
        display: "table",
        width: "80%",
    },

    counterDescStyle: {
        margin: 0,
        display: "table-cell",
        verticalAlign: "middle",
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
        minWidth: "360px",
        marginBottom: 24
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
        height: 80,
    },

    sliderItemWrapperStyle: {
        maxWidth: 120,
        height: 80,
        display: "table"
    },

    sliderItemImgStyle: {
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
        marginRight: 12,
        cursor: "pointer"
    },

    logoImgStyle: {
        width: 24,
        height: 24,
        display: "block"
    }

}

export default Feature;
