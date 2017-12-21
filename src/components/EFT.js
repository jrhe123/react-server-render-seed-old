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
            tableField: ['#', 'Serial', 'Status', 'CreatedAt', 'UpdatedAt'],
            posList: [],
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
        let UserGUID = this.state.UserGUID;

        let params = { Params: {
            UserGUID: UserGUID,
            Limit: limit,
            Offset: offset.toString(),
            Extra: { SearchType: '', SearchField: '' } }
        };// Limit: -1 means return all results

        apiManager.opayApi(opay_url + merchant_pos_machines, params,true).then((res) => {

            if (res.data) {

                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {
                    let posList = res.data.Response.PosMachines;
                    for(let pos of posList){
                        pos.CreatedAt = pos.CreatedAt ? moment(pos.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                        pos.UpdatedAt = pos.UpdatedAt ? moment(pos.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    }
                    this.setState({ currentPage: page, posList: posList, totalRecords: res.data.Response.TotalRecords });
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    onFieldChange = (e, value) => {
        this.setState({ serial: value })
    }

    handleClose = () => {
        this.setState({modalOpen: false});
    }

    componentDidMount() {
        this.getPosList();
    }

    backToList = () => {
        this.props.OnBack();
    }

    render() {

        const {
            tableCellStyle,
            formControl,
            btnControl,
            backBtn
        } = styles;

        return (
            <MuiThemeProvider>
                <div>
                    <div>
                        <Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    {this.state.tableField.map((item) => (
                                        <TableHeaderColumn style={tableCellStyle}>{item}</TableHeaderColumn>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {this.state.posList.map((pos, idx)=>(
                                    <TableRow key={pos.PosGUID} selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{idx + 1}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{pos.Serial}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{pos.Status}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{pos.CreatedAt}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{pos.UpdatedAt}</TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>
                        <Pagination
                            total = { Math.ceil(this.state.totalRecords/parseInt(this.state.Limit)) }
                            current = { this.state.currentPage }
                            display = { this.state.display }
                            onChange = { currentPage => this.handleChangePage(currentPage) }
                        />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <RaisedButton label="Add POS" primary={true} onClick={this.openDialog} /><br/>
                        <a style={backBtn} onClick={() => this.backToList()}>Back</a>
                    </div>

                    <Dialog title="Add POS" modal={false} open={this.state.modalOpen}
                            onRequestClose={this.handleClose.bind(this)}
                    >
                        <div>
                            <div style={formControl}>
                                <TextField floatingLabelText="Serial Number"
                                           onChange={(e, value) => this.onFieldChange(e,value)} />
                            </div>
                            <div style={btnControl}>
                                <RaisedButton label="Add" primary={true} onClick={this.addPos} />
                            </div>
                        </div>
                    </Dialog>

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
    }
}

export default EFT;