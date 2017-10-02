import React, { Component } from 'react';
import { connect } from 'react-redux';
import { green400 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { showSnackbar }  from '../actions/layout_action';

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
        this.props.dispatch(showSnackbar(''));
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.msg) {
            this.setState({ open: true });
        }
    }

    render() {
        return (
                <div style={{ textAlign: 'center' }}>
                    <hr className="footer-line"/>
                    <MuiThemeProvider>
                        <Snackbar
                            open={this.state.open}
                            message={this.props.msg}
                            autoHideDuration={3000}
                            bodyStyle={{ backgroundColor: green400 }}
                            onRequestClose={this.handleRequestClose}
                        />
                    </MuiThemeProvider>
                    <div>
                        <p> <strong>@Copyright - Opay</strong></p>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    return { msg: state.snackbar_reducer.msg };
}

export default connect(mapStateToProps)(Footer);