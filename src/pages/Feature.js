import React, { Component } from 'react';

// libraries
import Slider from 'react-slick';

// components
import Logo from '../components/Logo/Logo';
import Footer from '../components/Footer';
import Header from '../components/Header';


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
            delimit2,
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
            solutionContainerStyle,
            scenarioContainerStyle,
            scenarioRetailContainerStyle,
            flexDisContainerStyle,
            flexDisItemStyle,
            desContainerStyle,
            desContainerWrapperStyle,
            partnerContainerStyle,
            sliderContainerStyle,
            sliderItemStyle,
            sliderItemWrapperStyle,
            sliderItemImgStyle,
            profitContainerStyle,
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

                <div>
                    <Header pathname={this.props.location.pathname}/>
                </div>

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

                    <div className="p-t p-b" style={paymentContainerStyle}>
                        <div style={contentContainerStyle}>
                            <p className="txt-2 m-b p-l p-r m-t-md" style={centerTitleTxtStyle}>Payment Solution</p>
                            <div style={Object.assign({}, centerDivStyle, delimit2 )}></div>
                            <img src="/img/payment-method.gif" />
                        </div>
                    </div>

                    <div className="p-t p-b" style={solutionContainerStyle}>
                        <div style={contentContainerStyle}>
                            <p className="txt-2 m-b p-l p-r m-t-md" style={centerTitleTxtStyle}>API Solution</p>
                            <div style={Object.assign({}, centerDivStyle, delimit2 )}></div>
                            <div className="solution-wrapper">
                                <img src="/img/api_solution.png" />
                                <p className="txt-5 text-center m-t-lg solution-desc">OPAY Integration <span className="bold">APIs</span> provide easy to use interfaces to fulfill all kinds of online payment needs. </p>
                                <p className="txt-5 text-center solution-desc">OPAY supports Alipay, WeChat Pay, and all kinds of Credit Card products.</p>
                            </div>
                        </div>
                    </div>

                    <div style={scenarioContainerStyle}>
                        <div style={contentContainerStyle}>
                            <div className="m-t-md" style={flexDisContainerStyle}>
                                <div style={flexDisItemStyle}>
                                    <div style={desContainerStyle}>
                                        <div style={desContainerWrapperStyle}>
                                            <p className="txt-2 m-b m-t-md">SCENARIO - (Public Transit)</p>
                                            <div style={delimit}></div>
                                            <ul>
                                                <li className="txt-3">Eliminate counterfeit coin</li>
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

                    <div style={scenarioRetailContainerStyle}>
                        <div style={contentContainerStyle}>
                            <div className="m-t-md" style={flexDisContainerStyle}>
                                <div style={flexDisItemStyle}>
                                    <img src="/img/outletsnew.png" />
                                </div>
                                <div style={flexDisItemStyle}>
                                    <div style={desContainerStyle}>
                                        <div style={desContainerWrapperStyle}>
                                            <p className="txt-2 m-b">SCENARIO - (Retail)</p>
                                            <div style={delimit}></div>
                                            <ul>
                                                <li className="txt-3">Spot-checkout system</li>
                                                <li className="txt-3">Standalone</li>
                                                <li className="txt-3"> Integrate seamlessly into existing POS flow</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-t p-b" style={profitContainerStyle}>
                        <div style={contentContainerStyle}>
                            <div className="p-l p-r m-t-lg m-b-lg profit-detail-wrapper">
                                <p className="txt-2 m-b p-l p-r" style={centerTitleTxtStyle}>SERVICE MODE</p>
                                <div style={Object.assign({}, centerDivStyle, delimit )}></div>
                                <div className="profit-container">
                                    <div className="profit-item">
                                        <img className="profit-icon" src="/img/profit2.png" />
                                        <p className="bold txt-5 text-center m-b">OPAY POS & API Trading Service</p>
                                    </div>
                                    <div className="profit-item">
                                        <img className="profit-icon" src="/img/profit5.png" />
                                        <p className="bold txt-5 text-center m-b">OPAY Wallet</p>
                                    </div>
                                    <div className="profit-item">
                                        <img className="profit-icon" src="/img/profit3.png" />
                                        <p className="bold txt-5 text-center m-b">OPAY Technology</p>
                                    </div>
                                    <div className="profit-item">
                                        <img className="profit-icon" src="/img/profit6.png" />
                                        <p className="bold txt-5 text-center m-b">OPAY HuaBei</p>
                                    </div>
                                    <div className="profit-item">
                                        <img className="profit-icon" src="/img/profit4.png" />
                                        <p className="bold txt-5 text-center m-b">OPAY APP</p>
                                    </div>
                                    <div className="profit-item">
                                        <img className="profit-icon" src="/img/profit1.png" />
                                        <p className="bold txt-5 text-center m-b">Synchronous</p>
                                    </div>
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
                                            <img className="slider-item-img" style={sliderItemImgStyle} src="/img/p_8.png" />
                                        </div>
                                    </div>
                                </Slider>
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

    delimit2: {
        height: "2px",
        width: "60px",
        backgroundColor: "#000",
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
        backgroundColor: "#EDECEC",
    },

    scenarioRetailContainerStyle: {
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
        backgroundColor: "#fff",
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

    profitContainerStyle: {
        backgroundColor: "#EDECEC"
    },

    solutionContainerStyle: {
        backgroundColor: "#fff"
    }

}

export default Feature;
