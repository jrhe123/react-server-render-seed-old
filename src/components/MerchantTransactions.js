import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';


// Redux
import { connect } from 'react-redux';
import { hideHeader, showSnackbar }  from '../actions/layout_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

class MerchantTransactions extends Component{

    constructor(props) {
        super(props);
        this.state = {
            transactionList: []
        }
    }

    componentDidMount(){
        let params = {
            Params: {
                Limit: "-1",
                Offset: "0",
                Extra: {
                    SearchType: "DATE",
                    SearchField: "TODAY"
                }
            }
        };
        apiManager.opayApi(opay_url+'merchant/transaction_list', params, true)
            .then((response) => {
                
            })
            .catch((error) => {
                browserHistory.push(`${root_page}`);
            })
    }

    render() {

        const {
            mainContainer,
            tableCellStyle
        } = styles;

        return (
            <MuiThemeProvider>
                <div style={mainContainer}>
                    <Table >
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn style={tableCellStyle}>Platform</TableHeaderColumn>
                                <TableHeaderColumn style={tableCellStyle}>Amount</TableHeaderColumn>
                                <TableHeaderColumn style={tableCellStyle}>Type</TableHeaderColumn>
                                <TableHeaderColumn style={tableCellStyle}>Currency</TableHeaderColumn>
                                <TableHeaderColumn style={tableCellStyle}>TransCurrency</TableHeaderColumn>
                                <TableHeaderColumn style={tableCellStyle}>Rate</TableHeaderColumn>
                                <TableHeaderColumn style={tableCellStyle}>Status</TableHeaderColumn>
                                <TableHeaderColumn style={tableCellStyle}>CreatedAt</TableHeaderColumn>
                                <TableHeaderColumn style={tableCellStyle}>UpdatedAt</TableHeaderColumn>
                                <TableHeaderColumn style={tableCellStyle}>Action</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {this.state.transactionList.map((tran, idx)=>(
                                <TableRow selectable={false}>
                                    <TableRowColumn style={tableCellStyle}>{tran.AgentID}</TableRowColumn>
                                    <TableRowColumn style={tableCellStyle}>{tran.Name}</TableRowColumn>
                                    <TableRowColumn style={tableCellStyle}>{tran.Email}</TableRowColumn>
                                    <TableRowColumn style={tableCellStyle}>{tran.Phone}</TableRowColumn>
                                    <TableRowColumn style={tableCellStyle}>{tran.Platform}</TableRowColumn>
                                    <TableRowColumn style={tableCellStyle}>{tran.status}</TableRowColumn>
                                    <TableRowColumn style={tableCellStyle}>{tran.status}</TableRowColumn>
                                    <TableRowColumn style={tableCellStyle}>{tran.status}</TableRowColumn>
                                    <TableRowColumn style={tableCellStyle}>{tran.status}</TableRowColumn>
                                    <TableRowColumn style={tableCellStyle}>
                                        <div style={{textAlign: 'center'}}>
                                            <RaisedButton
                                                onClick={msg.status === 'ACTIVE' ? (e) => this.handleAction(e, idx) : () => this.active}
                                                secondary={msg.status !== 'ACTIVE'}
                                                label={msg.status === 'ACTIVE' ? 'ACTION' : 'ACTIVE'}
                                            />
                                            { msg.status === 'INACTIVE' ? '' : 
                                                <Popover
                                                    onRequestClose={(e, idx) => this.handleRequestClose(idx)}
                                                    open={this.state.merListOpenPop[idx]}
                                                    anchorEl={this.state.merListAnEl[idx]}
                                                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                    animation={PopoverAnimationVertical}>
                                                    <Menu>
                                                        <MenuItem primaryText="Active" />
                                                        <MenuItem primaryText="Set" />
                                                    </Menu>
                                                </Popover> 
                                            }
                                        </div>
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody> 
                        
                    </Table>
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {

    mainContainer: {
        width: '100%',
        height: '100%',
    },
    tableCellStyle: {
        width: '10%',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        padding: 0,
        textAlign: 'center'
    }

}

export default connect()(MerchantTransactions);
