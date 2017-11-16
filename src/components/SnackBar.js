import React, { Component } from 'react';
import { connect } from 'react-redux';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { showSnackbar }  from '../actions/layout_action';

class SnackBar extends Component {

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
        this.props.dispatch(showSnackbar('', this.props.success));
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.msg) {
            this.setState({ open: true });
        }
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <MuiThemeProvider>
                    <Snackbar
                              open={this.state.open}
                              message={this.props.msg}
                              autoHideDuration={3000}
                              bodyStyle={{ backgroundColor: this.props.success ? green400 : pinkA400 }}
                              onRequestClose={this.handleRequestClose}
                    />
                </MuiThemeProvider>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { msg: state.snackbar_reducer.msg, success: state.snackbar_reducer.success };
}

export default connect(mapStateToProps)(SnackBar);