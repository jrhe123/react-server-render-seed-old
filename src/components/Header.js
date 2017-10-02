import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { blue300 } from 'material-ui/styles/colors';
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
        }
        this.refactor = this.refactor.bind(this);
        this.scrollEvent = this.scrollEvent.bind(this);
        this.gotoHome = this.gotoHome.bind(this);
        this.gotoFeature = this.gotoFeature.bind(this);
        this.scrollTo = this.scrollTo.bind(this);
    }

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
              /*  offset -= delta
                yScroll = offset
                i++;*/
                window.scrollTo(0, yScroll);
                timer = setTimeout(step, 10)
            }
        }

        timer = setTimeout(step, 10)
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
            this.setState({ bg: blue300, zdepth: 1 });
        } else {
            this.setState({ bg: 'transparent', zdepth: 0 });
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
            color: '#FFFFFF',
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
                        style={{ width: '100vw', opacity:'0.8', backgroundColor: this.state.bg, transition: 'background-color 1.3s' }}
                        title="Opay"
                        zDepth={this.state.zdepth}
                        titleStyle={{ paddingLeft: '40px', fontSize: this.state.smallFont }}
                        showMenuIconButton={false}
                        onTitleTouchTap={(e) => browserHistory.push(`${root_page}`)}
                        iconElementRight={
                            <div>
                                <FlatButton key={1} label="Home" labelStyle={labelStyle} onClick={this.gotoHome} />
                                <FlatButton key={2} label="Features" labelStyle={labelStyle} onClick={this.gotoFeature} />
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