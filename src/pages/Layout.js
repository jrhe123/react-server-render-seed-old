import React from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';
import SnackBar from '../components/SnackBar';


class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.refactor = this.refactor.bind(this);
    }

    refactor = () => {
        const width = window.innerWidth;
        if(width < 768) {
            this.setState({ refactor: true });
        }
        else {
            this.setState({ refactor: false });
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.refactor);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.refactor);
    }

    render() {
        
        return (
            <div className="root-content">
                { this.props.hide_header ? '' :<div style={{ zIndex: '2000', position:'fixed' }}>
                    <Header pathname={this.props.location.pathname}/>
                  </div> }
                <div className="main_page">
                    <div>{this.props.children}</div>
                </div>
                <div>
                    <SnackBar />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { hide_header: state.layout_reducer.hide_header };
}

export default connect(mapStateToProps)(Layout);