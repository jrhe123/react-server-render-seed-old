import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Close from 'material-ui/svg-icons/navigation/close';
import FormatAlignJustify from 'material-ui/svg-icons/editor/format-align-justify';
import { grey200, orangeA400, grey50 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { root_page } from '../utilities/urlPath'
import { Link } from 'react-router';
import { bubble as Menu } from 'react-burger-menu'

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bg: 'transparent',
            zdepth: 0,
            fontColor: grey50,
            logoPath: '/img/Logo_White.png',
            openMenu: false,
            rightIconMarginTop: window.innerWidth >= 414 ? 5 : -8,
            largeScreen: window.innerWidth >= 414
        }
        this.refactor = this.refactor.bind(this);
        this.scrollEvent = this.scrollEvent.bind(this);
        this.gotoHome = this.gotoHome.bind(this);
        this.gotoFeature = this.gotoFeature.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
       // this.scrollTo = this.scrollTo.bind(this);
    }

    closeMenu = () => {
        this.setState({ openMenu: false });
    }

    gotoHome = () => {
        this.scrollTo(0, 10)
    }

    gotoFeature = () => {
        let second_section = ReactDOM.findDOMNode(this.refs.second_section);
        let offset = this.props.section_y.second_section.offset
        let height = this.props.section_y.second_section.height
        this.scrollTo(offset, height)
    }

    scrollEvent = () => {

        let isScrll = window.scrollY > 0;

        if(isScrll) {
            this.setState({ bg: grey200, zdepth: 1, fontColor: orangeA400, logoPath: '/img/Logo_Orange.png' });
        } else {
            this.setState({ bg: 'transparent', zdepth: 0, fontColor: grey50, logoPath: '/img/Logo_White.png' });
        }
    }

    refactor = () => {
        const width = window.innerWidth;

        if (width <= 414) {
            this.setState({ largeScreen: false, rightIconMarginTop: -8 })
        } else {
            this.setState({ largeScreen: true, rightIconMarginTop: 5 })
        }

    }

    componentDidMount() {
        this.setState({ 
            user: sessionStorage.getItem('user'), 
            //rightIconMarginTop: window.innerWidth >= 414 ? 5 : -8,
            //largeScreen: window.innerWidth >= 414
        });
        window.addEventListener('resize', this.refactor);
        window.addEventListener('scroll', this.scrollEvent);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.refactor);
        window.removeEventListener('scroll', this.scrollEvent);
    }

    render() {

        const labelStyle = {
            color: this.state.fontColor,
            fontWeight: 'bold',
            fontSize: '18px'
        };

        const smallScreenLabelMargin = {
            marginLeft: '20px'
        };

        const barWrapper = {
            width: "100%",
            position: 'relative',
        };

        const closeIconRightTop = {
            position: "absolute",
            top: -24,
            right: 10
        }

        let iconStyleRight = {
            position: 'relative',
            top: this.state.rightIconMarginTop,
            right: 35
        };

        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        style={{ width: '100vw', opacity:'0.8', fontWeight: 'bold', backgroundColor: this.state.bg, transition: 'background-color 1.3s' }}
                        title={
                            <div><img style={{  margin: '5px', width: '38px', height: '50px' }} src={this.state.logoPath} /></div>
                        }
                        titleStyle={ {marginLeft: '30px'} }
                        zDepth={this.state.zdepth}
                        showMenuIconButton={false}
                        onTitleTouchTap={(e) => browserHistory.push(`${root_page}`)}
                        iconElementRight={
                            this.state.largeScreen ? <div>
                                <Link to={`${root_page}`}><FlatButton key={1} label="Home" labelStyle={labelStyle} /></Link>
                                <Link to={`${root_page}feature`}><FlatButton key={2} label="Features" labelStyle={labelStyle} /></Link>
                                <Link to={`${root_page}about`}><FlatButton key={3} label="About Us" labelStyle={labelStyle} /></Link>
                            </div> : <div id="outer-container">
                                <Menu right pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } isOpen={ this.state.openMenu }>
                                    <div style={barWrapper}>
                                        <div style={closeIconRightTop}><FloatingActionButton mini={true} backgroundColor={"transparent"} onClick={() => this.closeMenu()}><Close /></FloatingActionButton></div>
                                        <div className="m-t-lg">
                                            <div style={smallScreenLabelMargin}><Link to={`${root_page}`}><FlatButton key={1} label="Home" labelStyle={labelStyle} onClick={() => this.closeMenu()} /></Link></div>
                                            <div style={smallScreenLabelMargin}><Link to={`${root_page}feature`}><FlatButton key={2} label="Features" labelStyle={labelStyle} onClick={() => this.closeMenu()} /></Link></div>
                                            <div style={smallScreenLabelMargin}><Link to={`${root_page}about`}><FlatButton key={3} label="About Us" labelStyle={labelStyle} onClick={() => this.closeMenu()} /></Link></div>
                                        </div>
                                    </div>
                                </Menu>
                                <main id="page-wrap">
                                    <div><FormatAlignJustify style={{ marginTop:'14px' }} color={this.state.fontColor}/></div>
                                </main>
                            </div>
                        }
                        iconStyleRight={iconStyleRight}
                    />
                </div>
            </MuiThemeProvider>
        )
    }
}

function mapStateToProps(state) {
    return {
        section_y: state.layout_reducer.section_y
    };
}

export default connect(mapStateToProps)(Header);


/*
scrollTo = (node_offset, node_height) => {

        let settings = {
            duration: 1000,
            easing: {
                outQuint: function (x, t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                }
            }
        }

        let timer = null;
        let percentage = 0;
        let startTime = Date.now();
        let nodeTop = node_offset
        let nodeHeight = node_height
        let body = document.body;
        let html = document.documentElement;
        let height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        )
        let offset = window.pageYOffset;
      //  let delta = (offset - nodeTop) / 20;
      //  let i = 1;
        let delta = nodeTop - offset;
        let bottomScrollableY = height - window.innerHeight;
        let targetY = (bottomScrollableY < delta) ?
            bottomScrollableY - (height - nodeTop - nodeHeight + offset):
            delta;

        if(timer) clearTimeout(timer);

        function step() {
            let yScroll;
            let elapsed = Date.now() - startTime;

         //   if((i === 21) || (elapsed > settings.duration)) {
            if(elapsed > settings.duration) {
                clearTimeout(timer)
            }

            percentage = elapsed / settings.duration;

          //  if ((i===21) || (percentage > 1)) {
            if (percentage > 1) {
                clearTimeout(timer);
            } else {
                yScroll = settings.easing.outQuint(0, elapsed, offset, targetY, settings.duration);
                window.scrollTo(0, yScroll);
                timer = setTimeout(step, 10)
            }
        }

        timer = setTimeout(step, 10)
    }
* */