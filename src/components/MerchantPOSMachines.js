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

class MerchantPOSMachines extends Component{

    constructor(props) {
        super(props);
        this.state = {
            posMachinesList: []
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

        apiManager.opayApi(opay_url+'merchant/pos_machine_list', params, true)
            .then((response) => {
                let res = response.data.Response;
                let { PosMachines } = res;
                for(let pos of PosMachines){
                    pos.CreatedAt = pos.CreatedAt ? moment(pos.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    pos.UpdatedAt = pos.UpdatedAt ? moment(pos.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                }
                
                let updated = Object.assign({}, this.state);
                updated.posMachinesList = PosMachines;
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
                        this.state.posMachinesList.length > 0 ?

                        (<Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow displayBorder={false}>
                                    <TableHeaderColumn style={tableCellStyle}>#</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Serial No.</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>IP Addr</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Status</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Timestamp</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
    
                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {this.state.posMachinesList.map((pos, idx)=>(
                                    <TableRow key={pos.PosGUID} selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{idx + 1}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{pos.Serial}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{pos.IP}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{pos.Status}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{pos.CreatedAt}</TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>         
                                                       
                        </Table>)
                        :
                        (<div style={infoContainer}>
                            <div style={infoWrapper}>
                                <p style={infoStyle}>No POS Machine Found</p>
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

export default connect()(MerchantPOSMachines);