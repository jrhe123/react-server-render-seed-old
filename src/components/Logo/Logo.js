import React, { Component } from 'react';

// import './logo.css';

class Logo extends Component {

    render(){

        return (
            <div className="logo-container" style={{width:this.props.containerWidth, height:this.props.containerHeight}}>
                <div className="logo logo1" style={{width:this.props.logoWidth, height:this.props.logoHeight1, lineHeight: this.props.logoHeight1+"px", borderRadius:this.props.borderRadius, color:this.props.textColor}}>O</div>
                <div className="logo logo2" style={{width:this.props.logoWidth, height:this.props.logoHeight2, lineHeight: this.props.logoHeight2+"px", borderRadius:this.props.borderRadius, color:this.props.textColor}}>P</div>
                <div className="logo logo3" style={{width:this.props.logoWidth, height:this.props.logoHeight3, lineHeight: this.props.logoHeight3+"px", borderRadius:this.props.borderRadius, color:this.props.textColor}}>A</div>
                <div className="logo logo4" style={{width:this.props.logoWidth, height:this.props.logoHeight4, lineHeight: this.props.logoHeight4+"px", borderRadius:this.props.borderRadius, color:this.props.textColor}}>Y</div>
            </div>
        )
    }
}

export default Logo;



{/* <Logo 
                        containerWidth={200}
                        containerHeight={200}
                        logoWidth={15}
                        logoHeight1={60}
                        logoHeight2={80}
                        logoHeight3={100}
                        logoHeight4={70}
                        borderRadius={12}
                        textColor={"white"} /> */}