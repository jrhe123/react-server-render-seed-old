// Libraries
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { opay_url,
         admin_report } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class AdminReport extends Component{

    constructor(props) {
        super(props);
        this.state = {
          agentIDEr: '',
          agentID: '',
          start: '',
          end: ''
        };
        this.dailyReport = this.dailyReport.bind(this);
        this.midChange = this.midChange.bind(this);
        this.changeDate = this.changeDate.bind(this);
    }

    midChange = (e, which) => {
        if (which === 'AgentID')  {
            this.setState({ agentID: e.target.value, agentIDEr: '' });
        }
    }

    changeDate = (n, date, which) => {
        if (which === 'start') {
            let new_date = JSON.stringify(date).substring(1,11) + ' 00:00:00';
            this.setState({ start: new_date });
        } else if (which === 'end') {
            let new_date = JSON.stringify(date).substring(1,11) + ' 23:59:59';
            this.setState({ end: new_date });
        }
    }


    dailyReport = () => {

        if (!this.state.agentID) {
            this.setState({ agentIDEr: 'This field is required' });
            return;
        }

        let params = {
            "Params": {
                "Limit": "-1",
                "Offset": "0",
                "Extra": {
                    "SearchType": "TIMERANGE",
                    "SearchField": this.state.start + "|" + this.state.end,
                    "AgentID": this.state.agentID
                }
            }
        };

        apiManager.opayApi(opay_url + admin_report, params, true).then((response) => {
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
                            <DatePicker hintText="Start Date" onChange={(n,date)=>this.changeDate(n,date,'start')} /><br />
                            <DatePicker hintText="End Date" onChange={(n,date)=>this.changeDate(n,date,'end')} /><br />
                            <TextField floatingLabelText="AgentID" onChange={(e, newString) => this.midChange(e,'AgentID')} errorText={this.state.agentIDEr} /><br />
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