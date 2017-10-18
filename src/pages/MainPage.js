import React from 'react';
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import { blueGrey50, orange400, grey50, blueGrey600 } from 'material-ui/styles/colors'
import { CSSTransitionGroup } from 'react-transition-group'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MarkImage from '../components/MarkImage';
import { mainPageMoveToSection }  from '../actions/layout_action';
import Logo from '../components/Logo/Logo';

class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            parallax: null,
            second_section: null,
            third_section: null,
            second_section_opacity:'1',
            third_section_opacity:'0',
            mapTransform: 'scale(0.1)',
            posImgTransform: 'translate(-1000px,0)',
            text: ['Canadian independent third party payment solution','Providing convenient and efficient mobile payment services for the international traveler, local consumers and Merchandise'],
            transportText: ['Eliminate counterfeit coin', 'Fast and simple processing', 'Support multiple currencies', 'Data analysis']
        };
        this.scrollEvent = this.scrollEvent.bind(this);
    }


    scrollEvent = () => {

        let scrolledHeight= window.pageYOffset;
        if(this.state.second_section.getBoundingClientRect().top <= window.innerHeight) {
            this.setState({ mapTransform: 'scale(1)', posImgTransform: 'translate(0,0)' })
        }

        if(this.state.third_section.getBoundingClientRect().top <= window.innerHeight) {
            this.setState({third_section_opacity: '1'})
        }

        [].slice.call(this.state.parallax).forEach(function(el,i){
            //let limit= el.offsetTop+ el.offsetHeight;
            // if(scrolledHeight > (el.offsetTop - document.body.clientHeight) && scrolledHeight <= limit) {
            if((el.getBoundingClientRect().top <= window.innerHeight)){
                let diff = scrolledHeight - el.offsetTop;
                el.style.backgroundPositionY= (diff) / 1.5+ "px";
            }
            else {
                el.style.backgroundPositionY= "0";
            }
        });
    }

    componentDidMount() {
        let para = document.querySelectorAll(".parallax");
        let second_section = ReactDOM.findDOMNode(this.refs.second_section)
        let third_section = ReactDOM.findDOMNode(this.refs.third_section)
        this.props.dispatch(mainPageMoveToSection({ second_section: {offset: second_section.getBoundingClientRect().top, height: second_section.offsetHeight} }))
        this.setState({ parallax: para, second_section: second_section, third_section: third_section });
        window.addEventListener('scroll', this.scrollEvent);
    }

    render() {

        const cardStyle = {
            height: 250,
            width: '27vw',
            margin: 10,
            textAlign: 'center',
            borderRadius: '10px',
            display: 'inline-block',
        };

        const bulletStyle = {
            color: blueGrey600,
            fontSize: '27px',
        };

        const mapImgStyle = {
            display: 'inline-block',
            height:'240',
            width: '300',
        }

        const iconStyle = {
            display: 'inline-block',
            margin: 15,
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
                                <h1>Life is a journey, pay as you go</h1>
                                <h2>The integrated payment system for dynamic consumer base</h2>
                            </div>
                        </section>
                    </CSSTransitionGroup>
                    
                    <section ref="second_section" style={{ opacity: this.state.second_section_opacity, transition: 'opacity 3.9s', marginBottom: '10' }}>
                        <div>
                            <div style={{ textAlign: 'center', paddingTop:'17px' }}>
                                <h1>Link China and Canada to expand your business </h1>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '30px', transform: this.state.mapTransform, transition: 'transform 1.9s ease-in-out'}}>
                                <img id="china" src="/img/china.png" style={Object.assign({}, mapImgStyle, { marginRight: '15vw' })} />
                                <img id="canada" src="/img/canada.png" style={Object.assign({}, mapImgStyle )} />
                            </div>
                            <div id="one_row_two_col_grid">
                                <div style={bulletStyle}>visitors to Canada from China reach 610139 in 2016</div>
                                <div style={bulletStyle}>Chinese travellers stay 50% longer in Canada than in USA</div>
                            </div>
                        </div>
                        <div>
                            <div style={{ textAlign: 'center', paddingTop:'17px' }}>
                                <h1>Opay Solution</h1>
                            </div>
                            <div id="one_row_two_col_grid">
                                <div>
                                    <img id="pos" src="/img/pos.png" style={{ width:400, height:420, marginTop: 20, marginLeft: 90, transform: this.state.posImgTransform, transition: 'transform 2.2s ease-in-out' }} />
                                </div>
                                <div id="three_row_one_col_grid">
                                    <div>
                                        <ul style={bulletStyle}>
                                            {this.state.text.map((item,i) => (
                                                <li key={i.toString()} style={{ margin: '10px' }} >{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={{ textAlign: 'center', paddingTop:'17px' }}>
                                <h1>Scenario</h1>
                            </div>
                            <div id="one_row_two_col_grid">
                                <div>
                                    <img id="pos" src="/img/ttc.jpg" style={{ width:500, height:220, marginTop: 20, marginLeft: 90, transform: this.state.posImgTransform, transition: 'transform 2.2s ease-in-out' }} />
                                </div>
                                <div id="three_row_one_col_grid">
                                    <div>
                                        <ul style={bulletStyle}>
                                            {this.state.transportText.map((item,i) => (
                                                <li key={i.toString()} style={{ margin: '10px' }} >{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>

                    <section ref="third_section" style={{ opacity: this.state.third_section_opacity, transition: 'opacity 3.9s', marginBottom: '10' }}>
                        <div style={{ background: blueGrey50 }}>
                            <div style={{ textAlign: 'center', paddingTop:'17px' }}>
                                <h2>Our partners</h2>
                            </div>
                            <div style={{ textAlign: 'center', paddingTop:'17px' }}>
                                <div style={iconStyle}><MarkImage src="/img/bank_of_china.png" /></div>
                                <div style={iconStyle}><MarkImage src="/img/Alipay.png" /></div>
                                <div style={iconStyle}><MarkImage src="/img/first_data.png" /></div>
                                <div style={iconStyle}><MarkImage src="/img/unionpay.png" /></div>
                                <div style={iconStyle}><MarkImage src="/img/td.jpg" /></div>
                                <div style={iconStyle}><MarkImage src="/img/wechat.png" /></div>
                            </div>
                        </div>
                    </section>

                </div>
            </MuiThemeProvider>
        );
    }
}

export default connect()(MainPage);


