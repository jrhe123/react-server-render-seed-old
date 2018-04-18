import React, { Component } from 'react';

// Libraries
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Pagination from 'material-ui-pagination';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import moment from 'moment';
import {Card} from 'material-ui/Card';

// Router
import {
    root_page,
    admin_page
} from '../utilities/urlPath'

// Components
import Snackbar from 'material-ui/Snackbar';

// API
import { opay_url, merchant_pos_machines, admin_create_pos } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class EFT extends Component {

    constructor(props) {
        super(props);
        this.state = {

            open: false,
            message: '',
            success: false,

            UserGUID: props.UserGUID,
            Limit: "10",
            Offset: "0",
            serial: '',
            totalRecords: 0,
            currentPage: 1,
            tableField: ['#', 'FileName', 'DateTime', 'Action'],
            eftFileList: [],
            display: 10,
            modalOpen: false,
        }
        this.openDialog = this.openDialog.bind(this);
        this.getEFTList = this.getEFTList.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    // Snack
    handleTouchTap = (msg, isSuccess) => {
        this.setState({
            open: true,
            message: msg,
            success: isSuccess
        });
    }

    handleTouchTapClose = () => {
        this.setState({
            open: false,
        });
    }

    openDialog = () => {
        this.setState({ modalOpen: true });
    }

    handleChangePage = (page) => {
        this.getEFTList(page);
    }

    getEFTList = (page) => {

        if(!page){
            page = 1;
        }
        let offset = (page - 1) * parseInt(this.state.Limit);
        let limit = this.state.Limit;

        let params = { Params: {
            Limit: limit,
            Offset: offset.toString(),
            Extra: { SearchType: '', SearchField: '' } }
        };// Limit: -1 means return all results

        apiManager.opayApi(opay_url + 'admin/view_eft_list', params, true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {
                    
                    let outputArr = [];
                    let dateArr = res.data.FileArr;
                    for(let date of dateArr){
                        for (var prop in date) {
                            if(!date.hasOwnProperty(prop)) continue;
                            
                            let datetime = prop;
                            let fileArr = date[prop];
                            for(let file of fileArr){
                                let item = {
                                    Date: moment(datetime).format('YYYY-MM-DD'),
                                    DateTime: datetime,
                                    FileName: file
                                };
                                outputArr.push(item);
                            }
                        }
                    }

                    outputArr.sort(function(a, b){
                        if (a.Date < b.Date)
                            return 1 
                        if (a.Date > b.Date)
                            return -1
                        return 0
                    })
                    this.setState({
                        eftFileList: outputArr
                    })
                }
            }
        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    handleDownload = (e, idx) => {
        e.preventDefault();
        let file = this.state.eftFileList[idx];
        let url = `${opay_url}${file.DateTime}/${file.FileName}`;

        apiManager.get(url, null)
            .then((response) => {
                let txtString = response.data;
                var blob = new Blob([txtString]);
                if (window.navigator.msSaveOrOpenBlob)  
                    window.navigator.mßsSaveBlob(blob, file.FileName);
                else{
                    var a = window.document.createElement("a");
                    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
                    a.download = file.FileName;
                    document.body.appendChild(a);
                    a.click(); 
                    document.body.removeChild(a);
                }
            })
            .catch((err) => {
                console.log('err: ', err);
            })  
    }

    handleClose = () => {
        this.setState({modalOpen: false});
    }

    componentDidMount() {
        this.getEFTList();
    }

    render() {

        const {
            tableCellStyle,
            formControl,
            btnControl,
            backBtn,
            tableCardContainer,
        } = styles;

        return (
            <MuiThemeProvider>
                <div>
                    <Card style={tableCardContainer}>
                        <Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    {this.state.tableField.map((item) => (
                                        <TableHeaderColumn style={tableCellStyle}>{item}</TableHeaderColumn>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {this.state.eftFileList.map((file, idx)=>(
                                    <TableRow key={idx} selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{idx + 1}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{file.FileName}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{file.Date}</TableRowColumn>
                                        <TableRowColumn className='actionBtnColn' style={tableCellStyle}>
                                            <RaisedButton
                                                className='actionBtn' onClick={(e) => this.handleDownload(e, idx)}
                                                secondary={true}
                                                label='Download'
                                            />
                                        </TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>
                        <Pagination
                            total = { Math.ceil(this.state.totalRecords/parseInt(this.state.Limit)) }
                            current = { this.state.currentPage }
                            display = { this.state.display }
                            onChange = { currentPage => this.handleChangePage(currentPage) }
                        />
                    </div>
                </div>
                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    autoHideDuration={3000}
                    onRequestClose={this.handleTouchTapClose}
                    bodyStyle={{backgroundColor: this.state.success ? green400 : pinkA400, textAlign: 'center' }}
                />
            </MuiThemeProvider>
        )
    }
}

const styles = {

    tableCellStyle: {
        width: '12.8%',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        textAlign: 'center'
    },

    formControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 12,
        marginBottom: 12
    },

    btnControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 36,
        marginBottom: 12
    },

    backBtn: {
        display: 'block',
        marginTop: 12,
        fontSize: 14,
        cursor: 'pointer',
        textDecoration: 'underline'
    },

    tableCardContainer: {
        width: 'calc(100% - 48px)',
        margin: '0 auto',
        marginTop: 24
    },
}

export default EFT;