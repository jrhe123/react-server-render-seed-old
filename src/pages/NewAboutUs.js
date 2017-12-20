import React, { Component } from 'react';

// libraries
import Slider from 'react-slick';

// components
import Logo from '../components/Logo/Logo';
import Footer from '../components/Footer';
import Header from '../components/Header';

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

            boldFont,
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

                <div>
                    <Header pathname={this.props.location.pathname}/>
                </div>

                <div>
                    <div style={bannerContainerStyle}>
                        <p className="txt-1" style={bannerTxtStyle}>ABOUT US</p>
                        <img className="banner-img" style={bannerImgStyle} src="/img/bw_3.png" />
                    </div>

                    <div style={detailContainerStyle}>
                        <div className="relative-block" style={contentContainerStyle}>
                            <img src="/img/codeiconorange1.png" className="code-1" />
                            <img src="/img/codeiconorange2.png" className="code-2" />
                            <div style={detailFlexContainerStyle}>
                                <div style={detailFlexItemStyle}>
                                    <p className="txt-3 m-l m-r">
                                        OPAY Inc. established in Toronto and incorporated under the Canadian Federal Government. OPAY is the subsidiary of Open Decisions Inc. which has extensive experience with banking and Telco system deployment, IT architecture and production operations. Most of the executive directors come from leading computer and networking companies with a lot of system design and management experiences. Open Decisions has established a strong clientele base comprising major players in the Financial and Telco industries. Our major clientele include well-known banks such as Bank of China, China Construction Bank, Industrial and Commercial Bank of China, etc.
                                    </p>
                                </div>
                                <div style={detailFlexItemStyle}>
                                    <p className="txt-3 m-l m-r">
                                        Registered as a money service business (MSB) by FINTRAC, OPAY is planning to take the next strategic step. The company plans to utilize its advantages by enriching its mobile payment platform and expanding its global presence.
                                    </p>
                                    <p className="txt-3 m-l m-r">
                                        Alipay and Wechat payment have become the most adapted payment methods for Chinese consumers. OPAY will integrate these payment methods into Canadian market with our secure and flexible payment options to help the Canadian businesses gaining more sales from Chinese visitors and students while they are travelling and staying in Canada.
                                    </p>
                                    <p className="txt-3 m-l m-r">
                                        In addition, OPAY is seeking a business partnership to extend these advance payment method to local Canadian consumers. This will add further to the value of the company and strengthen its position in Canadian money service business market.
                                    </p>
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
                                    <img style={teamImgStyle} src="/img/benjamin.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Benjamin Liang</p>
                                    <p className="txt-4" style={teamDescStyle}>CEO, President, Founder</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/sophia.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Sophia Zhang</p>
                                    <p className="txt-4" style={teamDescStyle}>COO</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/xueren.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Xueren Dai</p>
                                    <p className="txt-4" style={teamDescStyle}>Board Advisor</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/xiaogu.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Xiaogu Jiang</p>
                                    <p className="txt-4" style={teamDescStyle}>Board Advisor</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/nick.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Nick Ning</p>
                                    <p className="txt-4" style={teamDescStyle}>Sales Director</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/tyler.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Tyler Liu</p>
                                    <p className="txt-4" style={teamDescStyle}>Account Manager</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/jason.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Jason Yeh</p>
                                    <p className="txt-4" style={teamDescStyle}>Account Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Footer />

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

    boldFont: {
        fontWeight: "bold"
    },

    detailContainerStyle: {
        backgroundColor: "white",
        paddingTop: "24px",
        paddingBottom: "24px",
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
        backgroundColor: "#FFF",
        paddingTop: "24px",
        paddingBottom: "24px"
    },

    teamFlexContainerStyle: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start"
    },
    
    teamImgStyle: {
        display: "block",
        height: 150,
        width: 150,
        margin: "0 auto"
    },

    teamDescStyle: {
        textAlign: "center",
        margin: 0
    },

    numberContainerStyle:{
        backgroundColor: "#F2F1F1",
        paddingTop: "24px",
        paddingBottom: "24px"
    },


}

export default NewAboutUs;

/*    <div style={numberContainerStyle}>
    <div style={contentContainerStyle}>
        <div className="p-l-md p-r-md number-wrapper">
            <div className="m-b-lg">
                <p className="txt-2 m-b text-center">OPAY <span className="bold">IN NUMBERS</span></p>
                <div style={Object.assign({}, centerDivStyle, delimit )}></div>
            </div>
            <div className="number-flex-container">
                <div className="number-flex-item">
                    <p className="txt-4">MERCHANDISES</p>
                    <p className="txt-0 counter-txt">2</p>
                </div>
                <div className="number-flex-item">
                    <p className="txt-4">CITIES IN SERVICES</p>
                    <p className="txt-0 counter-txt">1</p>
                </div>
                <div className="number-flex-item">
                    <p className="txt-4">PROJECT IN 2017</p>
                    <p className="txt-0 counter-txt">16</p>
                </div>
                <div className="number-flex-item">
                    <p className="txt-4">TRANSACTIONS</p>
                    <p className="txt-0 counter-txt">86</p>
                </div>
                <div className="number-flex-item">
                    <p className="txt-4">YEARS IN BUSINESS</p>
                    <p className="txt-0 counter-txt">1</p>
                </div>
                <div className="number-flex-item">
                    <p className="txt-4">TEAM MEMBERS</p>
                    <p className="txt-0 counter-txt">12</p>
                </div>
            </div>
        </div>
    </div>
</div> */

/*
<div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/tyler.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Tyler Liu</p>
                                    <p className="txt-4" style={teamDescStyle}>Account Manager</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/jason.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Jason Yeh</p>
                                    <p className="txt-4" style={teamDescStyle}>Account Manager</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/yina.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Yina Gong</p>
                                    <p className="txt-4" style={teamDescStyle}>Executive Assistant</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/jiamin.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Jiamin Ning</p>
                                    <p className="txt-4" style={teamDescStyle}>Software Engineer</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/roy.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Roy He</p>
                                    <p className="txt-4" style={teamDescStyle}>Software Engineer</p>
                                </div>
                                <div className="team-flex-item">
                                    <img style={teamImgStyle} src="/img/yifu.png" />
                                    <p className="txt-4" style={Object.assign({}, boldFont, teamDescStyle )}>Yifu Ye</p>
                                    <p className="txt-4" style={teamDescStyle}>System Engineer</p>
                                </div>
* */
