import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import moment from 'moment';

// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';

// Component
import Snackbar from 'material-ui/Snackbar';

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

            open: false,
            message: '',
            success: false,

            addresses: [],
            anchorEl: null,

            addrModalOpen: false,
            addressLine1: '',
            addressLine2: '',
            city: '',
            province: '',
            countryCode: 'CA',
            postalCode: '',

            updateAddrModalOpen: false,
            updateAddrIdx: null,
            updateAddr: {
                AddressGUID: '',
                AddressLine1: '',
                AddressLine2: '',
                City: '',
                Province: '',
                CountryCode: 'CA',
                PostalCode: '',
            },
            
            deleteAddrModalOpen: false,
            deleteAddr: null,
            deleteAddrIdx: null,
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
                    addr.IsOpen = false;
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

     // Snack
     handleTouchTap = (msg, isSuccess) => {
        this.setState({
            open: true,
            message: msg,
            success: isSuccess
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    // Add addr Modal
    handleOpen = () => {
        this.setState({addrModalOpen: true});
    };

    handleClose = () => {
        this.setState({addrModalOpen: false});
    };

    onFieldChange = (e, value, field) => {
        let updated = Object.assign({}, this.state);
        updated[field] = value;
        this.setState(updated);
    }

    addAddr = () => {
        if(!this.state.addressLine1){
            this.handleTouchTap('Please enter address line 1', false);
            return;
        }
        if(!this.state.addressLine2){
            this.handleTouchTap('Please enter address line 2', false);
            return;
        }
        if(!this.state.city){
            this.handleTouchTap('Please enter city', false);
            return;
        }
        if(!this.state.province){
            this.handleTouchTap('Please enter province', false);
            return;
        }
        if(!this.state.postalCode){
            this.handleTouchTap('Please enter postal code', false);
            return;
        }
        
        let { addressLine1, addressLine2, city, province, postalCode } = this.state;
        let params = {
            Params: {
                AddressLine1: addressLine1,
                AddressLine2: addressLine2,
                City: city,
                Province: province,
                Country: "CA",
                PostalCode: postalCode
            }
        };

        apiManager.opayApi(opay_url+'merchant/create_address', params, true)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){
                    
                    let addr = response.data.Response;
                    addr.IsOpen = false;
                    let updated = Object.assign([], this.state.addresses);
                    updated.push(addr);
                    this.setState({
                        addresses: updated
                    })
                    this.handleTouchTap(`Address has been added`, true);
                    this.handleClose();
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
            })
            .catch((error) => {
                this.handleTouchTap(`Error: ${error}`, false);
            })
    }

    // Action 
    handleActionOpen = (e, addr, idx) => {
        e.preventDefault();
        let anchorEl = e.currentTarget;
        let updated = Object.assign({}, this.state);
        updated.anchorEl = anchorEl;
        updated.addresses[idx].IsOpen = true;
        this.setState(updated);
    }

    handleActionClose = (idx) => {
        let updated = Object.assign({}, this.state);
        updated.anchorEl = null;
        updated.addresses[idx].IsOpen = false;
        this.setState(updated);
    }

    handleSetDefault = (addr, idx) => {

        let { AddressGUID } = addr;
        let params = {
            Params: {
                AddressGUID
            }
        };
        apiManager.opayApi(opay_url+'merchant/set_default_address', params, true)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){
                    
                    let updated = Object.assign({}, this.state);
                    updated.anchorEl = null;
                    updated.addresses[idx].IsOpen = false;
            
                    for(let address of updated.addresses){
                        if(address.AddressGUID != addr.AddressGUID){
                            address.IsDefault = 0;
                        }else{
                            address.IsDefault = 1;
                        }
                    }
                    this.setState(updated);
                    this.handleTouchTap(`Address has been set to default`, true);
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
            })
            .catch((error) => {
                this.handleTouchTap(`Error: ${error}`, false);
            })        
    }

    handleAddrUpdateOpen = (addr, idx) => {
        let updated = Object.assign({}, this.state);
        updated.anchorEl = null;
        updated.addresses[idx].IsOpen = false;
        updated.updateAddr = addr;
        updated.updateAddrIdx = idx;
        updated.updateAddrModalOpen = true;
        this.setState(updated);
    }

    handleUpdateClose = () => {
        let updated = Object.assign({}, this.state);
        updated.updateAddrModalOpen = false;
        this.setState(updated);
    }

    onUpdateFieldChange = (e, value, field) => {
        let updated = Object.assign({}, this.state);
        updated.updateAddr[field] = value;
        this.setState(updated);
    }

    updateAddr = () => {
        if(!this.state.updateAddr.AddressLine1){
            this.handleTouchTap('Please enter address line 1', false);
            return;
        }
        if(!this.state.updateAddr.AddressLine2){
            this.handleTouchTap('Please enter address line 2', false);
            return;
        }
        if(!this.state.updateAddr.City){
            this.handleTouchTap('Please enter city', false);
            return;
        }
        if(!this.state.updateAddr.Province){
            this.handleTouchTap('Please enter province', false);
            return;
        }
        if(!this.state.updateAddr.PostalCode){
            this.handleTouchTap('Please enter postal code', false);
            return;
        }
        
        let { AddressGUID, AddressLine1, AddressLine2, City, Province, Country, PostalCode } = this.state.updateAddr;
        let params = {
            Params: {
                AddressGUID,
                AddressLine1,
                AddressLine2,
                City,
                Province,
                Country,
                PostalCode
            }
        };

        apiManager.opayApi(opay_url+'merchant/update_address', params, true)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){

                    let addr = response.data.Response;
                    addr.IsOpen = false;
                    let updated = Object.assign([], this.state.addresses);
                    updated[this.state.updateAddrIdx] = addr;
                    this.setState({
                        addresses: updated
                    })
                    this.handleTouchTap(`Address has been updated`, true);
                    this.handleUpdateClose();
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
            })
            .catch((error) => {
                this.handleTouchTap(`Error: ${error}`, false);
            })
    }

    handleAddrDeleteOpen = (addr, idx) => {
        let updated = Object.assign({}, this.state);
        updated.deleteAddrModalOpen = true;
        updated.deleteAddr = addr;
        updated.deleteAddrIdx = idx;
        updated.addresses[idx].IsOpen = false;
        this.setState(updated);
    }

    handleAddrDeleteClose = () => {
        this.setState({
            deleteAddrModalOpen: false
        });
    };

    deleteAddr = () => {
        let { AddressGUID } = this.state.deleteAddr;
        let params = {
            Params: {
                AddressGUID,
            }
        };
        apiManager.opayApi(opay_url+'merchant/delete_address', params, true)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){

                    let updated = Object.assign([], this.state.addresses);
                    updated.splice(this.state.deleteAddrIdx, 1);
                    this.setState({
                        addresses: updated
                    })
                    this.handleTouchTap(`Address has been deleted`, true);
                    this.handleAddrDeleteClose();
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
            })
            .catch((error) => {
                this.handleTouchTap(`Error: ${error}`, false);
            })
    }

    render() {

        const {
            topControlContainer,
            addAddrBtn,
            tableCellStyle,
            infoContainer,
            infoWrapper,
            infoStyle,
            formControl,
            btnControl,
        } = styles;

        const deleteActions = [
            <FlatButton
                label="YES, DELETE IT"
                primary={true}
                onClick={() => this.deleteAddr()}
            />,
            <FlatButton
                label="NO, KEEP IT"
                primary={true}
                onClick={() => this.handleAddrDeleteClose()}
            />,
        ];

        return (
            <MuiThemeProvider>
                <div style={topControlContainer}>
                    <RaisedButton label="Add" 
                                    primary={true} 
                                    style={Object.assign({}, addAddrBtn)}
                                    onClick={() => this.handleOpen()} />
                </div>                    
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
                                    <TableHeaderColumn style={tableCellStyle}>Action</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
    
                            <TableBody displayRowCheckbox={false}>
                                {this.state.addresses.map((addr, idx)=>(
                                    <TableRow key={addr.AddressGUID} selectable={false} style={(addr.IsDefault == 1 ? {backgroundColor: '#c9c9c9'} : null)}>
                                        <TableRowColumn style={tableCellStyle}>{idx + 1}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.AddressLine1}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.AddressLine2}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.City}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.Province}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{addr.PostalCode}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>
                                            <FlatButton
                                                    onClick={(e) => this.handleActionOpen(e, addr, idx)}
                                                    icon={<ActionSettings />}
                                                />
                                                <div style={{textAlign: 'center'}}>
                                                <Popover
                                                    onRequestClose={(e) => this.handleActionClose(idx)}
                                                    open={addr.IsOpen}
                                                    anchorEl={this.state.anchorEl}
                                                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                    animation={PopoverAnimationVertical}>
                                                    <Menu>
                                                        <MenuItem primaryText="Set Default" onClick={() => this.handleSetDefault(addr, idx)}/>
                                                        <MenuItem primaryText="Update" onClick={() => this.handleAddrUpdateOpen(addr, idx)}/>
                                                        <MenuItem primaryText="Delete" onClick={() => this.handleAddrDeleteOpen(addr, idx)}/>
                                                    </Menu>
                                                </Popover> 
                                            </div>
                                        </TableRowColumn>
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


                <Dialog
                        title="Address"
                        modal={false}
                        open={this.state.addrModalOpen}
                        onRequestClose={this.handleClose.bind(this)}
                    >
                            <div style={formControl}>
                                <TextField floatingLabelText="Address Line 1" 
                                    onChange={(e, value) => this.onFieldChange(e,value,'addressLine1')}
                                    />
                            </div>
                            <div style={formControl}>
                                <TextField floatingLabelText="Address Line 2" 
                                    onChange={(e, value) => this.onFieldChange(e,value,'addressLine2')}
                                    />
                            </div> 
                            <div style={formControl}>
                                <TextField floatingLabelText="City" 
                                    onChange={(e, value) => this.onFieldChange(e,value,'city')}
                                    />
                            </div>   
                            <div style={formControl}>
                                <TextField floatingLabelText="Province" 
                                    onChange={(e, value) => this.onFieldChange(e,value,'province')}
                                    />
                            </div>  
                            <div style={formControl}>
                                <TextField floatingLabelText="PostalCode" 
                                    onChange={(e, value) => this.onFieldChange(e,value,'postalCode')}
                                    />
                            </div>
                            <div style={btnControl}>       
                                <RaisedButton label="Add" 
                                            primary={true}
                                            onClick={() => this.addAddr()} />
                            </div> 
                    </Dialog>


                    <Dialog
                        title="Address"
                        modal={false}
                        open={this.state.updateAddrModalOpen}
                        onRequestClose={this.handleUpdateClose.bind(this)}
                    >
                            <div style={formControl}>
                                <TextField floatingLabelText="Address Line 1" 
                                    value={this.state.updateAddr.AddressLine1}
                                    onChange={(e, value) => this.onUpdateFieldChange(e,value,'AddressLine1')}
                                    />
                            </div>
                            <div style={formControl}>
                                <TextField floatingLabelText="Address Line 2" 
                                    value={this.state.updateAddr.AddressLine2}
                                    onChange={(e, value) => this.onUpdateFieldChange(e,value,'AddressLine2')}
                                    />
                            </div> 
                            <div style={formControl}>
                                <TextField floatingLabelText="City" 
                                    value={this.state.updateAddr.City}
                                    onChange={(e, value) => this.onUpdateFieldChange(e,value,'City')}
                                    />
                            </div>   
                            <div style={formControl}>
                                <TextField floatingLabelText="Province" 
                                    value={this.state.updateAddr.Province}
                                    onChange={(e, value) => this.onUpdateFieldChange(e,value,'Province')}
                                    />
                            </div>  
                            <div style={formControl}>
                                <TextField floatingLabelText="PostalCode" 
                                    value={this.state.updateAddr.PostalCode}
                                    onChange={(e, value) => this.onUpdateFieldChange(e,value,'PostalCode')}
                                    />
                            </div>
                            <div style={btnControl}>       
                                <RaisedButton label="Update" 
                                            primary={true}
                                            onClick={() => this.updateAddr()} />
                            </div> 
                    </Dialog>

                    <Dialog
                        title="Delete Address"
                        actions={deleteActions}
                        modal={true}
                        open={this.state.deleteAddrModalOpen}
                        >
                        Are you sure you want to delete this address?
                    </Dialog>

                    <Snackbar
                        open={this.state.open}
                        message={this.state.message}
                        autoHideDuration={3000}
                        onRequestClose={this.handleRequestClose}
                        bodyStyle={{backgroundColor: this.state.success ? green400 : pinkA400, textAlign: 'center' }}
                        />

            </MuiThemeProvider>
        )
    }
}

const styles = {

    topControlContainer: {
        marginTop: 24,
        marginBottom: 36,
        height: 30
    },
    addAddrBtn: {
        float: 'right'
    },
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
    },

}

export default connect()(MerchantAddresses);