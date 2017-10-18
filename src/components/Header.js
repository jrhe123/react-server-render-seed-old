import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { grey200, orangeA400, grey50 } from 'material-ui/styles/colors';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import { toggleMenu }  from '../actions/layout_action';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { root_page } from '../utilities/urlPath'
import { Link } from 'react-router';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bg: 'transparent',
            zdepth: 0,
            fontColor: grey50,
            logoPath: '/img/Logo_Orange.png'
        }
        this.refactor = this.refactor.bind(this);
        this.scrollEvent = this.scrollEvent.bind(this);
        this.gotoHome = this.gotoHome.bind(this);
        this.gotoFeature = this.gotoFeature.bind(this);
       // this.scrollTo = this.scrollTo.bind(this);
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

    }

    componentDidMount() {
        this.setState({ user: sessionStorage.getItem('user')});
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


        const iconStyleRight = {
            position: 'relative',
            top: 5,
            right: 50
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
                            <div>
                                <Link to={`${root_page}`}><FlatButton key={1} label="Home" labelStyle={labelStyle} /></Link>
                                <Link to={`${root_page}feature`}><FlatButton key={2} label="Features" labelStyle={labelStyle} /></Link>
                                <Link to={`${root_page}about`}><FlatButton key={3} label="About Us" labelStyle={labelStyle} /></Link>
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