import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Pagination from 'material-ui-pagination';
import moment from 'moment';


// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

class MerchantTransactions extends Component{

    constructor(props) {
        super(props);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.fetchTransaction = this.fetchTransaction.bind(this);
        this.state = {
            Limit: "10",
            Offset: "0",
            totalRecords: 0,
            currentPage: 1,
            transactionList: [],
            display: 10,
        }
    }

    componentDidMount() {
        this.fetchTransaction(null);
    }

    handleChangePage = (page) => {
        this.fetchTransaction(page);
    }

    fetchTransaction = (page) => {
        if(!page){
            page = 1;
        }
        let offset = (page - 1) * parseInt(this.state.Limit);
        let params = {
            Params: {
                Limit: this.state.Limit,
                Offset: offset.toString(),
                Extra: {
                    SearchType: "",
                    SearchField: ""
                }
            }
        };

        console.log('params: ', params);

        apiManager.opayApi(opay_url+'merchant/transaction_list', params, true)
            .then((response) => {
                let res = response.data.Response;
                let { TotalRecords, Transactions } = res;

                for(let tran of Transactions){
                    tran.Amount = tran.Amount.toFixed(2);
                    tran.CreatedAt = tran.CreatedAt ? moment(tran.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    tran.UpdatedAt = tran.UpdatedAt ? moment(tran.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                }

                let updated = Object.assign({}, this.state);
                updated.totalRecords = TotalRecords;
                updated.transactionList = Transactions;
                updated.currentPage = page;
                this.setState(updated);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                browserHistory.push(`${root_page}`);
            })
    }

    render() {

        const {
            tableCellStyle
        } = styles;

        return (
            <MuiThemeProvider>
                    <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                        <Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow displayBorder={false}>
                                    <TableHeaderColumn style={tableCellStyle}>Platform</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Amount</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Type</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Currency</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>TransCurrency</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Rate</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Status</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>CreatedAt</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>UpdatedAt</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {this.state.transactionList.map((tran, idx)=>(
                                    <TableRow key={tran.GUID} selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{tran.Platform}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{tran.Currency === 'CAD' ? '$' : '¥'} {tran.Amount}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{tran.Type}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{tran.Currency}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{tran.TransCurrency}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{tran.Rate}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{tran.Status}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{tran.CreatedAt}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{tran.UpdatedAt}</TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody> 
                        </Table>

                        <Divider />

                        <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>        
                            <Pagination
                                total = { Math.ceil(this.state.totalRecords/parseInt(this.state.Limit)) }
                                current = { this.state.currentPage }
                                display = { this.state.display }
                                onChange = { currentPage => this.handleChangePage(currentPage) }
                            />
                        </div>

                    </Card>
            </MuiThemeProvider>
        )
    }
}

const styles = {

    tableCellStyle: {
        width: 'calc(100%/9)',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        padding: 0,
        textAlign: 'center'
    }

}

export default connect()(MerchantTransactions);
