import React, { Component } from 'react';

// Libraries
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Pagination from 'material-ui-pagination';

// Router
import { root_page } from '../utilities/urlPath'

// API
import { opay_url, merchant_pos_machines, admin_create_pos } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class PosList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UserGUID: props.UserGUID,
            Limit: "10",
            Offset: "0",
            serial: '',
            totalRecords: 0,
            currentPage: 1,
            tableField: ['PosGUID', 'Industry', 'Serial', 'Status', 'CreatedAt', 'UpdatedAt'],
            posList: [],
            display: 10,
            modalOpen: false,
        }
        this.openDialog = this.openDialog.bind(this);
        this.getPosList = this.getPosList.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.addPos = this.addPos.bind(this);
    }

    openDialog = () => {
        this.setState({ modalOpen: true });
    }

    handleChangePage = (page) => {
        this.getPosList(page);
    }

    addPos = () => {

        let UserGUID = this.state.UserGUID;
        let serial = this.state.serial;

        let params = { Params: {
                UserGUID: UserGUID,
                Serial: serial
            }
        };

        apiManager.opayApi(opay_url + admin_create_pos, params,true).then((res) => {

            if (res.data) {
                console.log(res.data)
                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {
                    this.setState({ modalOpen: false });
                    this.getPosList(this.state.page);// may have problem when the current page contains 10 item
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });

    }

    getPosList = (page) => {

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
                    this.setState({ currentPage: page, posList: res.data.Response.PosMachines, totalRecords: res.data.Response.totalRecords });
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

    render() {

        const {
            tableCellStyle,
            formControl,
            btnControl
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
                                        <TableRowColumn style={tableCellStyle}>{pos.PosGUID}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{pos.MerchantIndustry}</TableRowColumn>
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
                        <RaisedButton label="Add POS" primary={true} onClick={this.openDialog} />
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
            </MuiThemeProvider>
        )

    }

}

const styles = {

    tableCellStyle: {
        width: '12.8%',
        whiteSpace: 'normal',
        wordWrap: 'break-word'
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
    }
}

export default PosList;