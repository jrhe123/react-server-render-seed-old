import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import {Card} from 'material-ui/Card';

// API
import { opay_url, merchant_invoice_list } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class InvoiceList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoiceList: [],
            isSettle: false,
            agentId: '',

            invoiceStatusModalOpen: false,
            merListOpenPop: [false],
            testData: [{
                month: 'januray',
                amount: 500,
                monthly_expense: 400,
                is_settle: false,
                settle_date: '02/12/2014'
            },{
                month: 'march',
                amount: 400,
                monthly_expense: 300,
                is_settle: true,
                settle_date: '02/12/2014'
            },{
                month: 'april',
                amount: 340,
                monthly_expense: 400,
                is_settle: false,
                settle_date: '02/12/2014'
            }]
        };
    }
    
    // Snack
    handleTouchTap = (msg, isSuccess) => {
        this.setState({
            open: true,
            message: msg,
            success: isSuccess
        });
    };

    componentWillMount() {
        this.setState({ agentId: this.props.merchantID })
        this.fetchInvoiceList();
    };

    fetchInvoiceList = () => {
        let search = {
            Limit: '-1',
            Offset: '',
            Extra: {

            }
        }
        apiManager.opayApi(opay_url + '/merchant/invoice_list', search).then((response) => {
            if(response.TotalRecords) {
                this.setState({ invoiceList:response.Invoices });
                console.log(response.Invoices);
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    };

    showInvoiceStatus = (idx, merchant) => {
        this.setState({ invoiceStatusModalOpen: false });
        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        updated.invoiceStatusModalOpen = true;
        updated.isSettle = merchant.is_settle;
        console.log(merchant.is_settle);
        this.setState(updated);
    };

    handleInvoiceStatusClose = () => {
        this.setState({ invoiceStatusModalOpen: false });
    };

    updateInvoiceStatusCheck = () => {
        this.setState({ isSettle: !this.state.isSettle});
    }
    
    fetchInvoiceStatus = () => {

        let params = { 
            Params: {
                MerchantUserGUID: this.state.uniqueCodeMer.UserGUID,
                isSettle: this.state.isSettle ? '1' : '0'
            }
        };
        apiManager.opayApi(opay_url + 'admin/change_service_charge_test', params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    };

    render() {
        const {
            tableCardContainer,
            tableCellStyle,
            formControl,
            uniqueFormStyle,
            btnControl,
            checkboxStyle,
            checkboxLabelStyle
        } = styles;

        return (
            <Card style={tableCardContainer}>
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={tableCellStyle}>Month</TableHeaderColumn>
                            <TableHeaderColumn style={tableCellStyle}>Amount</TableHeaderColumn>
                            <TableHeaderColumn style={tableCellStyle}>ServiceCharge</TableHeaderColumn>
                            <TableHeaderColumn style={tableCellStyle}>IsSettle</TableHeaderColumn>
                            <TableHeaderColumn style={tableCellStyle}>SettleDate</TableHeaderColumn>
                            <TableHeaderColumn style={tableCellStyle}>Action</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                        {this.state.testData.map((msg, idx)=>(
                            <TableRow key={idx} selectable={false}>
                                <TableRowColumn style={tableCellStyle}>{msg.month}</TableRowColumn>
                                <TableRowColumn style={tableCellStyle}>{msg.amount}</TableRowColumn>
                                <TableRowColumn style={tableCellStyle}>{msg.monthly_expense}</TableRowColumn>
                                <TableRowColumn style={tableCellStyle}>
                                    {msg.is_settle ? 'Yes' : 'No'}
                                </TableRowColumn>
                                <TableRowColumn style={tableCellStyle}>{msg.settle_date}</TableRowColumn>
                                <TableRowColumn className='actionBtnColn' style={tableCellStyle}>
                                    <RaisedButton
                                        className='actionBtn'
                                        onClick={() => this.showInvoiceStatus(idx, msg)}
                                        label='ACTION'
                                    />
                                
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Dialog title="Change Invoice Status" modal={false} open={this.state.invoiceStatusModalOpen}
                        onRequestClose={this.handleInvoiceStatusClose.bind(this)}>
                    <div>
                        <div style={Object.assign({}, formControl, uniqueFormStyle)}>
                            
                            <Checkbox
                                style={checkboxStyle}
                                label="is settle"
                                labelStyle={checkboxLabelStyle}
                                checked={this.state.isSettle}
                                onCheck={() => this.updateInvoiceStatusCheck()}
                                />
                            <div style={btnControl}>
                                <RaisedButton label="Update" primary={true} onClick={() => this.fetchInvoiceStatus()}/>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Card>
        )
    };
}

const styles = {
    tableCardContainer: {
        width: 'calc(100% - 48px)',
        margin: '0 auto',
        marginTop: 24
    },

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
    uniqueFormStyle: {
        overflow: 'auto',
    },
    btnControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 36,
        marginBottom: 12
    },
    checkboxStyle: {
        width: 'auto',
        margin: 'auto'
    },
    checkboxLabelStyle: {
        width: 'max-content'
    }
}

export default InvoiceList;