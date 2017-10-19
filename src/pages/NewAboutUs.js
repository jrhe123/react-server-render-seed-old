import React, { Component } from 'react';

// libraries
import Slider from 'react-slick';

// components
import Logo from '../components/Logo/Logo';

class NewAboutUs extends Component{

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

            numberContainerStyle,

            teamContainerStyle,
            teamFlexContainerStyle,
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

        return(

            <div>
                <div style={bannerContainerStyle}>
                    <p className="txt-1" style={bannerTxtStyle}>ABOUT US</p>
                    <img className="banner-img" style={bannerImgStyle} src="/img/about_us.png" />
                </div>

                <div style={detailContainerStyle}>
                    <div style={contentContainerStyle}>
                        <div style={detailFlexContainerStyle}>
                            <div style={detailFlexItemStyle}>
                                <p className="txt-3 m-l m-r">
                                    Opay Inc. established in Toronto and incorporated under the Canadian Federal Government. OPay is the subsidiary of Open Decisions Inc. which has extensive experience with banking and Telco system deploy- ment, IT architecture and production operations. Most of the executive directors come from leading com- puter and networking companies with a lot of system design and management experiences. Open Decisions has established a strong customer base comprising major players in the  nancial and Telco industries. Our major customers include well-known banks such as Bank of China, China Construction Bank, Industrial and Commercial Bank of China, etc.
                                </p>
                            </div>
                            <div style={detailFlexItemStyle}>
                                <p className="txt-3 m-l m-r">
                                    Registered as a money service business (MSB) by FINTRAC, Opay is planning to take the next strategic step. The company plans to utilize its advantages by enriching its mobile payment platform and expanding its global presence.
                                </p>
                                <p className="txt-3 m-l m-r">
                                    Alipay and Wechat payment have become a fast –adapted payment method in China. Opay will implement these payment method into Canadian market and help the Canadian businesses to attract more Chinese visitors and students who travelling and staying in Canada, as Chinese consumers do not have to carry lots of cash and in- ter-banking limitations in Canada.
                                </p>
                                <p className="txt-3 m-l m-r">
                                    In advance, Opay is seeking a business partnership to extend these advance payment method to non-Chinese consumers. This will add further to the value of the company and strengthen its position in Canadian money service business market.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>   

                <div style={numberContainerStyle}>
                    <div style={contentContainerStyle}>
                        <div className="p-l-md p-r-md number-wrapper">
                            <p className="txt-2 m-b">OPAY <span className="bold">IN NUMBERS</span></p>
                            <div style={delimit}></div>
                            <div className="number-flex-container">
                                <div className="number-flex-item">
                                    <p className="txt-4">MERCHANDISES</p>
                                    <p className="txt-0 counter-txt">2,000</p>
                                </div>
                                <div className="number-flex-item">
                                    <p className="txt-4">PROJECTS DONE IN 2016</p>
                                    <p className="txt-0 counter-txt">152</p>
                                </div>
                                <div className="number-flex-item">
                                    <p className="txt-4">NEW PROJECT IN 2017</p>
                                    <p className="txt-0 counter-txt">176</p>
                                </div>
                                <div className="number-flex-item">
                                    <p className="txt-4">TRANSACTIONS</p>
                                    <p className="txt-0 counter-txt">1,756</p>
                                </div>
                                <div className="number-flex-item">
                                    <p className="txt-4">YEARS IN BUSINESS</p>
                                    <p className="txt-0 counter-txt">20</p>
                                </div>
                                <div className="number-flex-item">
                                    <p className="txt-4">TEAM MEMBERS</p>
                                    <p className="txt-0 counter-txt">12</p>
                                </div>
                            </div>  
                        </div>              
                    </div>
                </div>

                <div style={teamContainerStyle}>
                    <div style={contentContainerStyle}>
                        <p className="txt-2" style={Object.assign({}, centerTitleTxtStyle, titleStyle )}>OUR TEAM</p>
                        <div style={Object.assign({}, centerDivStyle, delimit )}></div>
                        <div style={teamFlexContainerStyle}>
                            <div className="team-flex-item">
                                <img style={teamImgStyle} src="/img/profile_icon.png" />
                                <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Benjamin Liang</p>
                                <p className="txt-4" style={teamDescStyle}>CEO, President</p>
                            </div>
                            <div className="team-flex-item">
                                <img style={teamImgStyle} src="/img/profile_icon.png" />
                                <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Sophia Zhang</p>
                                <p className="txt-4" style={teamDescStyle}>COO, Co-founder</p>
                            </div>
                            <div className="team-flex-item">
                                <img style={teamImgStyle} src="/img/profile_icon.png" />
                                <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Nick Ning</p>
                                <p className="txt-4" style={teamDescStyle}>Sales Director</p>
                            </div>
                            <div className="team-flex-item">
                                <img style={teamImgStyle} src="/img/profile_icon.png" />
                                <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Yina Gong</p>
                                <p className="txt-4" style={teamDescStyle}>Executive Assistant</p>
                            </div>
                            <div className="team-flex-item">
                                <img style={teamImgStyle} src="/img/profile_icon.png" />
                                <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Jiamin Ning</p>
                                <p className="txt-4" style={teamDescStyle}>Software Engineer</p>
                            </div>
                            <div className="team-flex-item">
                                <img style={teamImgStyle} src="/img/profile_icon.png" />
                                <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Roy He</p>
                                <p className="txt-4" style={teamDescStyle}>Roy He</p>
                            </div>
                            <div className="team-flex-item">
                                <img style={teamImgStyle} src="/img/profile_icon.png" />
                                <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Yifu Ye</p>
                                <p className="txt-4" style={teamDescStyle}>System Engineer</p>
                            </div>
                            <div className="team-flex-item">
                                <img style={teamImgStyle} src="/img/profile_icon.png" />
                                <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Who</p>
                                <p className="txt-4" style={teamDescStyle}>Position Title</p>
                            </div>
                            <div className="team-flex-item">
                                <img style={teamImgStyle} src="/img/profile_icon.png" />
                                <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Who</p>
                                <p className="txt-4" style={teamDescStyle}>Position Title</p>
                            </div>
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
        paddingLeft: "36px",
        color: "white",
        fontWeight: "bold"
    },

    contentContainerStyle : {
        maxWidth: "1080px",
        margin: "0 auto"
    },

    titleStyle : {
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
        marginRight: 12,
        cursor: "pointer"
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
        minWidth: 384,
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
    
    teamImgStyle: {
        display: "block",
        height: 120,
        width: 120,
        margin: "0 auto"
    },

    teamDescStyle: {
        textAlign: "center",
        margin: 0
    },

    numberContainerStyle:{
        backgroundColor: "#fff",
        paddingTop: "24px",
        paddingBottom: "24px"
    },


}

export default NewAboutUs;
