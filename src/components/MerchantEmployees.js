import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import moment from 'moment';

// Redux
import { connect } from 'react-redux';
import { 
    fetch_employee_list,
    create_merchant_employee, 
}  from '../actions/merchant_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// Component
import Snackbar from 'material-ui/Snackbar';

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

class MerchantEmplyees extends Component{

    constructor(props) {
        super(props);
        this.state = {
            empModalOpen: false,
            open: false,
            message: '',
            success: true,

            newEmp: {
                assignUserTypeGUID: '',
                assignUserType: '',
                firstName: '',
                lastName: ''
            },
            isFetchUserType: false,
            userTypeList: [],

        }
        this.onFieldChange = this.onFieldChange.bind(this);
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

        apiManager.opayApi(opay_url+'user_role/merchant_child_list', params, true)
            .then((response) => {
                
                if(response.data.Confirmation === 'Success'){
                    let employeeList = response.data.Response.EmployeeList;
                    for(let emp of employeeList){
                        emp.CreatedAt = emp.CreatedAt ? moment(emp.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                        emp.UpdatedAt = emp.UpdatedAt ? moment(emp.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    }
                    this.props.fetch_employee_list(employeeList);
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
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

    // Modal
    handleOpen = () => {
        if(!this.state.isFetchUserType){
            this.fetchUserTypeList();
        }
        this.setState({empModalOpen: true});
    };

    handleClose = () => {
        this.setState({empModalOpen: false});
    };

    fetchUserTypeList = () => {

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
        apiManager.opayApi(opay_url+'user_role/merchant_user_type_list', params, true)
            .then((response) => {
                
                if(response.data.Confirmation === 'Success'){
                    let userTypeList = response.data.Response.UserTypeList;
                    let updated = Object.assign({}, this.state);
                    updated.userTypeList = userTypeList;
                    updated.isFetchUserType = true;
                    this.setState(updated);
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                browserHistory.push(`${root_page}`);
            })
    }

    onFieldChange = (e, value, field) => {
        let updated = Object.assign({}, this.state);
        updated.newEmp[field] = value;
        this.setState(updated);
    }

    handleUserTypeChange = (idx) => {
        let selectedUserType = this.state.userTypeList[idx];
        if(selectedUserType){
            let assignUserTypeGUID = selectedUserType.UserTypeGUID;
            let assignUserType = selectedUserType.UserType;

            let updated = Object.assign({}, this.state);
            updated.newEmp['assignUserType'] = assignUserType;
            updated.newEmp['assignUserTypeGUID'] = assignUserTypeGUID;
            this.setState(updated);
        }
    }

    addEmp = () => {

        let params = {
            Params: {
                FirstName: this.state.newEmp.firstName,
                LastName: this.state.newEmp.lastName,
                AssignUserTypeGUID: this.state.newEmp.assignUserTypeGUID
            }
        };

        apiManager.opayApi(opay_url+'user_role/merchant_create_child', params, true)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){
                    let newEmployee = response.data.Response;
                    newEmployee.CreatedAt = newEmployee.CreatedAt ? moment(newEmployee.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    newEmployee.UpdatedAt = newEmployee.UpdatedAt ? moment(newEmployee.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    this.props.create_merchant_employee(newEmployee);
                    this.handleClose();
                    this.handleTouchTap(`Employee has been created`, true);
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
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
            addEmpContainer,
            addEmpBtn,
            tableCellStyle,
            infoContainer,
            infoWrapper,
            infoStyle,
            formControl,
            btnControl,
        } = styles;

        if(!this.props.employeeList){
            return null;
        }

        return (
            <MuiThemeProvider>
                <div style={addEmpContainer}>
                    <RaisedButton label="Add" 
                                    primary={true} 
                                    style={addEmpBtn}
                                    onClick={() => this.handleOpen()} />  
                </div>
                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>

                    {
                        this.props.employeeList.length > 0 ?

                        (<Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow displayBorder={false}>
                                    <TableHeaderColumn style={tableCellStyle}>#</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>FirstName</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>LastName</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>UserType</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>CreatedAt</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>UpdatedAt</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
    
                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {this.props.employeeList.map((emp, idx)=>(
                                    <TableRow key={emp.UserGUID} selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{idx + 1}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{emp.FirstName}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{emp.LastName}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{emp.UserTypeID === 5 ? 'Manager' : 'Employee'}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{emp.CreatedAt}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{emp.UpdatedAt}</TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>         
                                                       
                        </Table>)
                        :
                        (<div style={infoContainer}>
                            <div style={infoWrapper}>
                                <p style={infoStyle}>No Employee Found</p>
                            </div>
                        </div>)
                    }

                    <Dialog
                            title="Employee"
                            modal={false}
                            open={this.state.empModalOpen}
                            onRequestClose={this.handleClose.bind(this)}
                        >
                            <div style={formControl}>
                                <SelectField
                                    style={{textAlign: 'left'}}
                                    floatingLabelText="Type"
                                    value={this.state.newEmp.assignUserType}
                                    onChange={(e, value) => this.handleUserTypeChange(value)}
                                    >
                                    {this.state.userTypeList.map((item, index) => (
                                        <MenuItem value={item.UserType} key={index} primaryText={item.UserType}  />
                                    ))}
                                </SelectField>
                            </div>
                            <div style={formControl}>
                                <TextField floatingLabelText="FirstName" 
                                    onChange={(e, value) => this.onFieldChange(e,value,'firstName')}
                                    />
                            </div>
                            <div style={formControl}>
                                <TextField floatingLabelText="LastName" 
                                    onChange={(e, value) => this.onFieldChange(e,value,'lastName')}
                                    />
                            </div>    
                            <div style={btnControl}>       
                                <RaisedButton label="Create" 
                                            primary={true}
                                            onClick={() => this.addEmp()} />
                            </div> 
                    </Dialog>

                    <Snackbar
                        open={this.state.open}
                        message={this.state.message}
                        autoHideDuration={3000}
                        onRequestClose={this.handleRequestClose}
                        bodyStyle={{backgroundColor: this.state.success ? green400 : pinkA400, textAlign: 'center' }}
                        />
                    
                </Card>

            </MuiThemeProvider>
        )
    }
}

const styles = {
    addEmpContainer: {
        marginTop: 20,
        height: 30
    },
    addEmpBtn: {
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

const stateToProps = (state) => {

	return {
		employeeList: state.merchant_reducer.employeeList,
	}
}

const dispatchToProps = (dispatch) => {

	return {
        fetch_employee_list: (employeeList) => dispatch(fetch_employee_list(employeeList)),
        create_merchant_employee: (newEmployee) => dispatch(create_merchant_employee(newEmployee))
	}
}

export default connect(stateToProps, dispatchToProps)(MerchantEmplyees);