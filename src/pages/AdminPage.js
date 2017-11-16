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

import { hideHeader }  from '../actions/layout_action';
import { root_page } from '../utilities/urlPath'

class AdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            merListOpenPop: [false, false, false],
            merListAnEl: [null,null,null],
            merList: [{ UserGuID: 'aaaaaaaaaaaaaaaaaaaa', AgentID: 'aaaaaaaaaaaaaaaaaaaa', Name: 'aaaaaaaaaaaaaaaaaaaa', Email: 'aaaaaaaaaaaaaaaaaaaa', Phone: 'aaaaaaaaaaaaaaaaaaaa', Platform: 'aaaaaaaaaaaaaaaaaaaa', status:'aaaaaaaaaaaaaaaaaaaa' },
                { UserGuID: 'aaaaaaaaaaaaaaaaaaaa', AgentID: 'aaaaaaaaaaaaaaaaaaaa', Name: 'aaaaaaaaaaaaaaaaaaaa', Email: 'aaaaaaaaaaaaaaaaaaaa', Phone: 'aaaaaaaaaaaaaaaaaaaa', Platform: 'aaaaaaaaaaaaaaaaaaaa', status:'aaaaaaaaaaaaaaaaaaaa' },
                { UserGuID: 'aaaaaaaaaaaaaaaaaaaa', AgentID: 'aaaaaaaaaaaaaaaaaaaa', Name: 'aaaaaaaaaaaaaaaaaaaa', Email: 'aaaaaaaaaaaaaaaaaaaa', Phone: 'aaaaaaaaaaaaaaaaaaaa', Platform: 'aaaaaaaaaaaaaaaaaaaa', status:'aaaaaaaaaaaaaaaaaaaa' }]
        }

        this.props.dispatch(hideHeader(true));
        this.logout = this.logout.bind(this);
        this.getMerList = this.getMerList.bind(this);
    }

    getMerList = () => {

    }

    logout = () => {
        browserHistory.push(`${root_page}`);
    }

    handleAction = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        let merListOpenPop = [];
        let merListAnEl = [];

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
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
                        <Drawer open={true} width={160}>
                            <MenuItem primaryText="Merchants" />
                            <MenuItem primaryText="Log out" onClick={this.logout} />
                        </Drawer>
                    </div>

                    <div style={{ marginLeft: '170px', marginRight: '10px' }}>
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
                                                onClick={this.handleAction}
                                                label="Action"
                                            />
                                            <Popover
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