// Libraries
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { opay_url,
         admin_daily_report } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';


class AdminReport extends Component{

    constructor(props) {
        super(props);
        this.state = {
          midEr: '',
          mid: '',
          start: '',
          end: ''
        };
        this.dailyReport = this.dailyReport.bind(this);
        this.midChange = this.midChange.bind(this);
    }

    midChange = (e, newString) => {
        this.setState({ mid: newString, midEr: '' });
    }

    dailyReport = () => {

        apiManager.opayApi(opay_url + admin_daily_report, null, true).then((response) => {
               if (response.data) {
                   let csvString = response.data;
                   var blob = new Blob([csvString]);
                   if (window.navigator.msSaveOrOpenBlob)
                       window.navigator.msSaveBlob(blob, "report.csv");
                   else{
                       var a = window.document.createElement("a");
                       a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
                       a.download = "report.csv";
                       document.body.appendChild(a);
                       a.click();
                       document.body.removeChild(a);
                   }
               }else{
                   this.handleTouchTap(`Error: ${response.data.Message}`, false);
               }
           }).catch((err) => {
               this.handleTouchTap(`Error: ${err}`);
           });
    }

    render() {

        const {
            CardContainer,
            paperStyle,
            verticalCenter,
            reportBtn
        } = styles;

        return (
            <MuiThemeProvider>
                <div style={CardContainer}>
                    <Paper zDepth={3} style={paperStyle}>
                        <div style={verticalCenter}>

                            <DatePicker hintText="Weekends Disabled" />
                            <DatePicker hintText="Random Dates Disabled" />
                            <RaisedButton label="Get Report" primary={true} style={reportBtn} onClick={() => this.dailyReport()}/>
                        </div>
                    </Paper>
                </div>
            </MuiThemeProvider>
        )
    }

}

const styles = {

    CardContainer: {
        width: 'calc(100% - 48px)',
        margin: '0 auto',
        marginTop: 24
    },

    paperStyle: {
        position: 'fixed',
        top: '50%',
        left: '55%',
        transform: 'translateX(-50%) translateY(-50%)',
        textAlign: 'center',
        height: '60%',
        width: '60%'
    },

    verticalCenter: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)'
    },

    reportBtn: {
        marginTop: '15px',
    },
}

export default AdminReport;