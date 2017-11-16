import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

import { hideHeader, showSnackbar }  from '../actions/layout_action';
import { root_page } from '../utilities/urlPath'
import { opayApi } from  '../helpers/apiManager';


class AdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            merListOpenPop: [false, false, false],
            merListAnEl: [null,null,null],
            merList: [{ UserGuID: 'aaaaaaaaaaaaaaaaaaaa', AgentID: 'aaaaaaaaaaaaaaaaaaaa', Name: 'aaaaaaaaaaaaaaaaaaaa', Email: 'aaaaaaaaaaaaaaaaaaaa', Phone: 'aaaaaaaaaaaaaaaaaaaa', Platform: 'aaaaaaaaaaaaaaaaaaaa', status:'ACTIVE' },
                { UserGuID: 'aaaaaaaaaaaaaaaaaaaa', AgentID: 'aaaaaaaaaaaaaaaaaaaa', Name: 'aaaaaaaaaaaaaaaaaaaa', Email: 'aaaaaaaaaaaaaaaaaaaa', Phone: 'aaaaaaaaaaaaaaaaaaaa', Platform: 'aaaaaaaaaaaaaaaaaaaa', status:'INACTIVE' },
                { UserGuID: 'aaaaaaaaaaaaaaaaaaaa', AgentID: 'aaaaaaaaaaaaaaaaaaaa', Name: 'aaaaaaaaaaaaaaaaaaaa', Email: 'aaaaaaaaaaaaaaaaaaaa', Phone: 'aaaaaaaaaaaaaaaaaaaa', Platform: 'aaaaaaaaaaaaaaaaaaaa', status:'ACTIVE' }]
        }

        this.props.dispatch(hideHeader(true));
        this.logout = this.logout.bind(this);
        this.getMerList = this.getMerList.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.active = this.active.bind(this);
    }

    getMerList = () => {

    }

    logout = () => {
        browserHistory.push(`${root_page}`);
    }

    active = () => {

    }

    handleRequestClose = (idx) => {

        let merListOpenPop = [];

        for (let i = 0;i < this.state.merListOpenPop.length;i++) {
            merListOpenPop[i] = false;
        }

        merListOpenPop[idx] = false;

        this.setState({
            merListOpenPop: merListOpenPop
        })
    }

    handleAction = (event,idx) => {
        // This prevents ghost click.
        event.preventDefault();

        let merListOpenPop = [];
        let merListAnEl = [];

        //this.props.dispatch(showSnackbar('good', false));

        for (let i = 0;i < this.state.merListOpenPop.length;i++) {
            merListOpenPop[i] = this.state.merListOpenPop[i];
        }

        for (let i = 0;i < this.state.merListAnEl.length;i++) {
            merListAnEl[i] = this.state.merListAnEl[i];
        }

        merListOpenPop[idx] = true;
        merListAnEl[idx] = event.currentTarget;

        this.setState({
            merListOpenPop: merListOpenPop,
            merListAnEl: merListAnEl,
        });
    }


    render() {

        const {
            mainPageStyle,
            tableCellStyle
        } = styles;

        return (
            <MuiThemeProvider>
                <div style={mainPageStyle}>

                    <div>
                        <Drawer open={true} width={150}>
                            <MenuItem primaryText="Merchants" />
                            <MenuItem primaryText="Log out" onClick={this.logout} />
                        </Drawer>
                    </div>

                    <div style={{ marginLeft: '160px', marginRight: '10px' }}>
                        <Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    <TableHeaderColumn style={tableCellStyle}>UserGUID</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>AgentID</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Name</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Email</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Phone</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Platform</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Status</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Action</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {this.state.merList.map((msg, idx)=>(
                                    <TableRow selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{msg.UserGuID}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.AgentID}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.Name}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.Email}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.Phone}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.Platform}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.status}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}><div style={{textAlign: 'center'}}>
                                            <RaisedButton
                                                onClick={msg.status === 'ACTIVE' ? (e) => this.handleAction(e, idx) : () => this.active}
                                                secondary={msg.status !== 'ACTIVE'}
                                                label={msg.status === 'ACTIVE' ? 'ACTION' : 'ACTIVE'}
                                            />
                                            { msg.status === 'INACTIVE' ? '' : <Popover
                                                onRequestClose={(e, idx) => this.handleRequestClose(idx)}
                                                open={this.state.merListOpenPop[idx]}
                                                anchorEl={this.state.merListAnEl[idx]}
                                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                animation={PopoverAnimationVertical}>
                                                <Menu>
                                                    <MenuItem primaryText="Add POS" />
                                                    <MenuItem primaryText="Set" />
                                                </Menu>
                                            </Popover> }
                                        </div></TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {

    mainPageStyle: {
        width: '100vw',
        height: '100vh',
    },

    tableCellStyle: {
        width: '12.5%',
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    }

}

export default connect()(AdminPage);