import React, { Component } from 'react';

// Libraries
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Pagination from 'material-ui-pagination';

// Router
import { root_page } from '../utilities/urlPath'

// API
import { opay_url, merchant_pos_machines } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class PosList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UserGUID: props.UserGUID,
            Limit: "10",
            Offset: "0",
            totalRecords: 0,
            currentPage: 1,
            tableField: ['PosGUID', 'MerchantIndustry', 'Serial', 'Status', 'CreatedAt', 'UpdatedAt'],
            posList: [],
            display: 10,
        }
        this.addPos = this.addPos.bind(this);
        this.getPosList = this.getPosList.bind(this);

    }

    addPos = () => {

    }

    getPosList = () => {

        let offset = this.state.Offset;
        let limit = this.state.Limit
        let UserGUID = this.state.UserGUID

        let params = { Params: { UserGUID: UserGUID, Limit: limit, Offset: offset,  Extra: { SearchType: '', SearchField: '' } } };// Limit: -1 means return all results

        apiManager.opayApi(opay_url + merchant_pos_machines, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {

                }
                console.log(res.data);
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    componentDidMount() {
        this.getPosList();
    }


    render() {

        const {
            tableCellStyle
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
                                    <TableRow selectable={false}>
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

                    <div style={{ textAlign: 'center' }}>
                        <RaisedButton label="Add POS" primary={true} onClick={this.addPos} />
                    </div>
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

}

export default PosList;