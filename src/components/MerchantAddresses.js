import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
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

class MerchantAddresses extends Component{

    constructor(props) {
        super(props);
        this.state = {
            addresses: []
        }
    }

    componentDidMount(){
        let params = {
            Params: {
                Limit: "-1",
                Offset: "0",
                Extra: {
                    SearchType: "",
                    SearchField: ""
                }
            }
        };

        apiManager.opayApi(opay_url+'merchant/address_list', params, true)
            .then((response) => {
                let res = response.data.Response;
                let { Addresses } = res;
                for(let addr of Addresses){
                    addr.CreatedAt = addr.CreatedAt ? moment(addr.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    addr.UpdatedAt = addr.UpdatedAt ? moment(addr.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                }
                
                let updated = Object.assign({}, this.state);
                updated.addresses = Addresses;
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
            tableCellStyle,
            infoContainer,
            infoWrapper,
            infoStyle,
        } = styles;

        return (
            <MuiThemeProvider>
                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>

                    {
                        this.state.addresses.length > 0 ?

                        (<Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow displayBorder={false}>
                                    <TableHeaderColumn style={tableCellStyle}>#</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>AddressLine 1</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>AddressLine 2</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>City</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Province</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Postal Code</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
    
                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {this.state.addresses.map((addr, idx)=>(
                                    <TableRow key={addr.AddressGUID} selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{idx + 1}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.AddressLine1}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.AddressLine2}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.City}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.Province}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.PostalCode}</TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>         
                                                       
                        </Table>)
                        :
                        (<div style={infoContainer}>
                            <div style={infoWrapper}>
                                <p style={infoStyle}>No Address Found</p>
                            </div>
                        </div>)
                    }

                    
                </Card>  
            </MuiThemeProvider>
        )
    }
}

const styles = {

    tableCellStyle: {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        padding: 0,
        textAlign: 'center'
    },
    infoContainer:{
        margin: '0 auto',
        height: 200,
        width: 400,
        display: 'table'
    },
    infoWrapper: {
        width: 400,
        display: 'table-cell',
        verticalAlign: 'middle',
    },
    infoStyle:{
        margin: '0 auto',
        textAlign: 'center',
        fontSize: 19,
        fontWeight: 'bold',
        wordWrap: 'break-word'
    }

}

export default connect()(MerchantAddresses);