import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import axio from '../constants/axio';


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
                <div style={{ zIndex: '2000', position:'fixed' }}>
                    <Header pathname={this.props.location.pathname}/>
                </div>
                <div className="main_page">
                    <div>{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export default connect()(Layout);