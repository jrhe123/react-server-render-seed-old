import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransitionGroup } from 'react-transition-group'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AboutUs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            parallax: null,
        };
        this.scrollEvent = this.scrollEvent.bind(this);
    }

    scrollEvent = () => {

        let scrolledHeight= window.pageYOffset;

        [].slice.call(this.state.parallax).forEach(function(el,i){
            if((el.getBoundingClientRect().top <= window.innerHeight)){
                let diff = scrolledHeight - el.offsetTop;
                el.style.backgroundPositionY= (diff) / 1.5 + "px";
            }
            else {
                el.style.backgroundPositionY= "0";
            }
        });
    }

    componentDidMount() {
        let para = document.querySelectorAll(".parallax");
        this.setState({ parallax: para})
        window.addEventListener('scroll', this.scrollEvent);
    }

    render() {

        const pStyle = {
            fontSize: '15px'
        }

        return (
            <MuiThemeProvider>
                <div>
                    <CSSTransitionGroup
                        transitionName="first_section"
                        transitionAppear={true}
                        transitionEnter={true}
                        transitionLeave={true}
                        transitionAppearTimeout={1200}
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        <section className="module parallax parallax-1">
                            <div>
                                <h1>Who is Opay</h1>
                            </div>
                        </section>
                    </CSSTransitionGroup>
                    <section style={{ padding: '20px' }}>
                        <p style={pStyle}>Opay Inc. established in Toronto and incorporated under the Canadian Federal Government. OPay is the subsidiary of Open Decisions Inc. which has extensive experience with banking and Telco system deployment, IT architecture and production operations. Most of the executive directors come from leading computer and networking companies with a lot of system design and management experiences. Open Decisions has established a strong customer base comprising major players in the financial and Telco industries. Our major customers include well-known banks such as Bank of China, China Construction Bank, Industrial and Commercial Bank of China, etc.</p>
                        <p style={pStyle}>Registered as a money service business (MSB) by FINTRAC, Opay is planning to take the next strategic step. The company plans to utilize its advantages by enriching its mobile payment platform and expanding its global presence.</p>
                        <p style={pStyle}>Alipay and Wechat payment have become a fast –adapted payment method in China. Opay will implement these payment method into Canadian market and help the Canadian businesses to attract more Chinese visitors and students who travelling and staying in Canada, as Chinese consumers do not have to carry lots of cash and inter-banking limitations in Canada.</p>
                        <p style={pStyle}>In advance, Opay is seeking a business partnership to extend these advance payment method to non-Chinese consumers. This will add further to the value of the company and strengthen its position in Canadian money service business market.</p>
                    </section>

                    <section style={{ paddingLeft: '20px' }}>
                        <h2>Contact Us</h2>
                        <div style={{ textAlign: 'right', paddingRight: '30px' }}>
                            <p style={pStyle}>3950 14th Avenue, Unit 304</p>
                            <p style={pStyle}>Markham, ON. L3R-0A9</p>
                            <p style={pStyle}></p>
                            <p style={pStyle}>Phone: (647) 931-3090</p>
                        </div>
                    </section>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default AboutUs