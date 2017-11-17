import React, { Component } from 'react';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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


export default SnackBar;