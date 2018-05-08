import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import {Card} from 'material-ui/Card';

// API
import { opay_url, merchant_invoice_list } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class MerchantServiceCharges extends Component {

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
        let agentID = localStorage.getItem('agentID');
        this.setState({ agentId: agentID })
        this.fetchInvoiceList();
    };

    fetchInvoiceList = () => {
        // apiManager.opayApi(opay_url + merchant_invoice_list, {}, true).then((response) => {
        //     this.setState({ invoiceList:response.data })
        // }).catch((err) => {
        //     this.handleTouchTap(`Error: ${err}`);
        // });
    };

    render() {
        const {
            tableCardContainer,
            tableCellStyle,
            formControl,
            uniqueFormStyle,
            btnControl,
            checkboxStyle
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
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                        {this.state.testData.map((msg, idx)=>(
                            <TableRow key={idx} selectable={false}>
                                <TableRowColumn style={tableCellStyle}>{msg.month}</TableRowColumn>
                                <TableRowColumn style={tableCellStyle}>{'$' + (msg.amount)}</TableRowColumn>
                                <TableRowColumn style={tableCellStyle}>{msg.monthly_expense}</TableRowColumn>
                                <TableRowColumn style={tableCellStyle}>
                                    {msg.is_settle ? 'Yes' : 'No'}
                                </TableRowColumn>
                                <TableRowColumn style={tableCellStyle}>{msg.settle_date}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
        width: '60%',
        margin: 'auto'
    }
}

export default MerchantServiceCharges;