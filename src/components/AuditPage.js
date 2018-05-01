import React, { Component } from 'react';

// Libraries
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Pagination from 'material-ui-pagination';
import { green400, pinkA400, red500, yellow600 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import Card from 'material-ui/Card/Card';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import ActionWatchLater from 'material-ui/svg-icons/action/watch-later';
import moment from 'moment';

// Router
import {
    root_page,
} from '../utilities/urlPath';

// Components
import AddMerchant from './AddMerchant';
import ViewMerchant from './ViewMerchant'

// API
import { opay_url } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class AuditPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

            open: false,
            message: '',
            success: false,

            isUploading: false,
            currentRecordType: null,

            recordModalOpen: false,
            aliPop: false,
            aliAnEl: null,

            showDatePicker: false,
            selectDate: null,

            showAliMode: false,
            selectAliMode: null,
            selectFile: null,

            anchorEl: null,
            transactionRecordList: [],
            Limit: "10",
            Offset: "0",
            totalRecords: 0,
            currentPage: 1,
            display: 10,

            auditModalOpen: false,
            auditTransaction: null,
        }
    }

    componentDidMount() {
        this.fetchTransactionRecord(1);
    }

    // Snack
    handleTouchTap = (msg, isSuccess) => {
        this.setState({
            open: true,
            message: msg,
            success: isSuccess
        });
    }

    handleTouchTapClose = () => {
        this.setState({
            open: false,
        });
    }

    // Fetch transaction record
    fetchTransactionRecord = (page) => {

        let offset = (page - 1) * parseInt(this.state.Limit);
        let params = {
            Params: {
                Limit: this.state.Limit,
                Offset: offset.toString(),
                Extra: {
                    SearchType: "",
                    SearchField: ""
                }
            }
        };

        apiManager.opayApi(opay_url + 'admin/audit_transaction_record', params, true)
            .then((response) => {
                let res = response.data.Response;
                let { TotalRecords, TransactionRecords } = res;
                let updated = Object.assign({}, this.state);
                updated.totalRecords = TotalRecords;
                updated.transactionRecordList = TransactionRecords;
                updated.currentPage = page;
                this.setState(updated);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                localStorage.removeItem('profileImage');
                browserHistory.push(`${root_page}`);
            })
    }

    handleChangePage = (page) => {
        this.fetchTransactionRecord(page);
    }

    handleActionOpen = (e, tran, idx) => {
        e.preventDefault();
        let anchorEl = e.currentTarget;
        let updated =  Object.assign([], this.state.transactionRecordList);
        updated[idx].IsOpen = true;
        this.setState({
            anchorEl: anchorEl,
            transactionRecordList: updated
        })
    }

    handleActionClose = (idx) => {
        let updated =  Object.assign([], this.state.transactionRecordList);
        updated[idx].IsOpen = false;
        this.setState({
            anchorEl: null,
            transactionRecordList: updated
        })
    }

    handleAuditOpen = (tran, idx) => {
        let updated =  Object.assign([], this.state.transactionRecordList);
        let updatedTran = Object.assign({}, tran);
        updated[idx].IsOpen = false;
        this.setState({
            anchorEl: null,
            transactionRecordList: updated,
            auditTransaction: updatedTran,
            auditModalOpen: true
        })
    }

    handleAuditClose = () => {
        this.fetchTransactionRecord(this.state.currentPage);
        this.setState({
            auditModalOpen: false,
            auditTransaction: null
        });
    }

    handleReasonChange = (e) => {
        let updated = Object.assign({}, this.state);
        updated.auditTransaction['Reason'] = e.target.value;
        this.setState(updated);
    }

    handleUpdateReason = () => {
        let { GUID, Platform, Reason } = this.state.auditTransaction; 
        let params = {
            Params: {
                GUID,
                Platform,
                Reason,
            }
        };
        apiManager.opayApi(opay_url + 'admin/update_transaction_record_reason', params, true)
            .then((response) => {
                this.handleTouchTap(`Reason has been updated`, true);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                localStorage.removeItem('profileImage');
                browserHistory.push(`${root_page}`);
            })
    }

    handleConfirmAduit = () => {
        let { GUID, Platform, Reason } = this.state.auditTransaction; 
        let params = {
            Params: {
                GUID,
                Platform,
                Reason,
            }
        };
        apiManager.opayApi(opay_url + 'admin/self_audit_transaction_record', params, true)
            .then((response) => {
                this.handleTouchTap(`Transaction record has been audited`, true);
                this.fetchTransactionRecord(this.state.currentPage);
                this.setState({
                    auditModalOpen: false,
                    auditTransaction: null
                });
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                localStorage.removeItem('profileImage');
                browserHistory.push(`${root_page}`);
            })
    }

    uploadRecord = () => {
        this.setState({
            recordModalOpen: true
        });
    }

    handleRecordClose = () => {
        this.setState({
            recordModalOpen: false
        });
    }

    uploadAlipay = (e) => {
        e.preventDefault();
        this.setState({
            currentRecordType: 'ALIPAY',
            aliPop: true,
            aliAnEl: e.currentTarget,
            showDatePicker: false,
        });
    }

    handleAliPopClose = () => {
        this.setState({
            aliPop: false
        });
    }

    handleOnline = (e) => {

        let file = e.target.files[0];
        let err = '';
        let size = file.size / 1000 / 1000;

        if(file.type !== "text/csv" && file.type !== "application/vnd.ms-excel"){
            this.handleTouchTap(`Please upload file *.csv`, false);
            return;
        }

        this.setState({
            showAliMode: true,
            selectAliMode: 'ONLINE',
            aliPop: false,
            selectFile: file
        })
    }

    handleOffline = (e) => {
        
        let file = e.target.files[0];
        let err = '';
        let size = file.size / 1000 / 1000;

        if(file.type !== "text/csv" && file.type !== "application/vnd.ms-excel"){
            this.handleTouchTap(`Please upload file *.csv`, false);
            return;
        }

        this.setState({
            showAliMode: true,
            selectAliMode: 'OFFLINE',
            aliPop: false,
            selectFile: file
        })
    }

    uploadWechat = () => {
        this.setState({
            showAliMode: false,
            currentRecordType: 'WECHAT',
            showDatePicker: !this.state.showDatePicker
        })
    }

    handleUploadDate = (date) => {
        this.setState({
            selectDate: date
        })
    }

    canUploadRecord = () => {

        let {
            isUploading,
            currentRecordType,
            showAliMode,
            selectAliMode,
            selectDate,
        } = this.state;

        if(isUploading){
            return false;
        }

        let status = false;
        if(currentRecordType == 'ALIPAY'
            && selectAliMode
            && (selectAliMode == 'ONLINE' || selectAliMode == 'OFFLINE')){
            status = true;
        }else if(currentRecordType == 'WECHAT'
            && selectDate
            && (moment(selectDate) < moment()) ){
            status = true;   
        }
        return status;
    }

    confirmUpload = () => {
        let {
            currentRecordType,
            showAliMode,
            selectAliMode,
            selectDate,
            selectFile,
        } = this.state;

        let status = false;
        if(currentRecordType == 'ALIPAY'
            && selectAliMode
            && (selectAliMode == 'ONLINE' || selectAliMode == 'OFFLINE')){
            status = true;
        }else if(currentRecordType == 'WECHAT'
            && selectDate
            && (moment(selectDate) < moment()) ){
            status = true;   
        }

        if(!status){
            this.handleTouchTap(`Select your record type..`, false);
            return;
        }

        this.setState({
            isUploading: true
        });
        let url;
        let formData = new FormData();
        let formattedDate;
        if(currentRecordType == 'ALIPAY'){
            if(selectAliMode == 'ONLINE'){
                url = 'admin/upload_alipay_record_v2';
            }else{
                url = 'admin/upload_alipay_record';
            }
            formData.append('File', selectFile);
            apiManager.opayFileApi(opay_url + url, formData, true)
                .then((response) => {
                    if(response.data.Confirmation === 'Success'){   
                        this.setState({
                            isUploading: false
                        });
                        this.handleTouchTap(`Records have been uploaded`, true);                 
                    }else{
                        this.setState({
                            isUploading: false
                        });
                        this.handleTouchTap(`${response.data.Message}`, false);
                    }
                })
                .catch((err) => {
                    this.handleTouchTap(`Error: upload file error`, false);
                })
        }
        if(currentRecordType == 'WECHAT'){
            url = 'admin/upload_wechat_record';
            formattedDate = moment(selectDate).format('YYYYMMDD');
            let params = {
                Params: {
                    BillDate: formattedDate
                }
            };
            apiManager.opayApi(opay_url + url, params,true)
                .then((res) => {

                    if (res.data) {
                        if (res.data.Confirmation === 'Success') {
                            this.setState({
                                isUploading: false
                            });
                            this.handleTouchTap(`Records have been uploaded`, true);
                        }else{
                            this.setState({
                                isUploading: false
                            });
                            this.handleTouchTap(`Error: ${res.data.Message}`, false);
                        }
                    }
                })
                .catch((err) => {
                    this.handleTouchTap(`Error: ${err}`, false);
                });
        }
    }


    render() {

        const {
            uploadBtnContainerStyle,
            titleStyle,
            subtitleStyle,
            txtareaFormControl,
            formControl,
            btnControl,
            uploadBtnStyle,
            confirmBtnContainer,
            infoContainer,
            infoWrapper,
            infoStyle,
            tableCellStyle,
            platformImgStyle,
            msgContainer,
            msgTitleStyle,
            inlineBtnStyle,
        } = styles;

        return (
            <div>
                <div style={uploadBtnContainerStyle}>
                    <RaisedButton 
                        onClick={(e) => this.uploadRecord(e)}
                        primary={true} 
                        label='Upload'
                    />
                </div>

                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>

                    {
                        this.state.transactionRecordList.length > 0 ?

                        (<Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow displayBorder={false}>
                                    <TableHeaderColumn style={tableCellStyle}>Platform</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>PartnerTransactionID</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Amount</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>IsAudit</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>IsAuditPass</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Timestamp</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Reason</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Action</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            
                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                    {this.state.transactionRecordList.map((tran, idx)=>(
                                        <TableRow key={tran.GUID} selectable={false}>
                                            <TableRowColumn style={tableCellStyle}>
                                                {
                                                    tran.Platform === 'ALIPAY' ?
                                                    (<img style={platformImgStyle} src="/img/ali_r.png" />)
                                                    :
                                                    (<img style={platformImgStyle} src="/img/wechat_r.png" />)
                                                }
                                            </TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.PartnerTransactionID}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>${tran.GrossAmount}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.IsAudit ? <ActionCheckCircle style={{color: green400}} /> : <ActionWatchLater style={{color: yellow600}} />}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.IsAuditPass ? <ActionCheckCircle style={{color: green400}} /> : <ActionWatchLater style={{color: yellow600}} />}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.Time}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.Reason}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>
                                                <FlatButton
                                                    onClick={(e) => this.handleActionOpen(e, tran, idx)}
                                                    icon={<ActionSettings />}
                                                />
                                                <div style={{textAlign: 'center'}}>
                                                    <Popover
                                                        onRequestClose={(e) => this.handleActionClose(idx)}
                                                        open={tran.IsOpen}
                                                        anchorEl={this.state.anchorEl}
                                                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                        animation={PopoverAnimationVertical}>
                                                        <Menu>
                                                            <MenuItem primaryText="Self Audit" onClick={() => this.handleAuditOpen(tran, idx)}/>
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
                                <p style={infoStyle}>No Pending Records Found</p>
                            </div>
                        </div>)
                    }

                    <Divider />

                    <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>        
                        <Pagination
                            total = { Math.ceil(this.state.totalRecords/parseInt(this.state.Limit)) }
                            current = { this.state.currentPage }
                            display = { this.state.display }
                            onChange = { currentPage => this.handleChangePage(currentPage) }
                        />
                    </div>
                </Card>

                <Dialog 
                    title="Upload Records" 
                    modal={false} 
                    open={this.state.recordModalOpen} 
                    autoScrollBodyContent={true}
                    onRequestClose={this.handleRecordClose.bind(this)}>
                    <div style={formControl}>
                        <div style={btnControl}>    

                            <p style={titleStyle}>Type: {this.state.currentRecordType}</p>                        
                            
                            <RaisedButton 
                                style={uploadBtnStyle}
                                label="Alipay" 
                                primary={true} 
                                onClick={this.uploadAlipay}
                            />
                            <Popover
                                className="upload-btn-pop"
                                onRequestClose={(e) => this.handleAliPopClose()}
                                open={this.state.aliPop}
                                anchorEl={this.state.aliAnEl}
                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                animation={PopoverAnimationVertical}>
                                <Menu 
                                    style={{width: 90}}>
                                    <div>
                                        <RaisedButton containerElement='label' label='Online'>
                                            <div><input type="file" style={{ display: 'none' }} onChange={(e) => this.handleOnline(e)} /></div>
                                        </RaisedButton>
                                    </div>
                                    <div>
                                        <RaisedButton containerElement='label' label='Offline'>
                                            <div><input type="file" style={{ display: 'none' }} onChange={(e) => this.handleOffline(e)} /></div>
                                        </RaisedButton>
                                    </div>
                                </Menu>
                            </Popover>

                            <RaisedButton 
                                style={uploadBtnStyle}
                                label="Wechat" 
                                primary={true} 
                                onClick={this.uploadWechat}
                            />

                            {
                                this.state.showDatePicker ?
                                <DatePicker 
                                value={this.state.selectDate ? this.state.selectDate : {}}
                                style={{marginTop: 24}}
                                hintText="Date" 
                                container="inline"
                                autoOk={true}
                                onChange={(event, date) => this.handleUploadDate(date)} />
                                :
                                null
                            }
                            {
                                this.state.showAliMode ?
                                <p style={subtitleStyle}>
                                    Alipay mode: {this.state.selectAliMode}<br/>
                                    File path: {this.state.selectFile.name}
                                </p>
                                :
                                null
                            }
                            
                            <div style={confirmBtnContainer}>
                                <RaisedButton 
                                    disabled={!this.canUploadRecord()}
                                    label="Confirm" 
                                    primary={true} 
                                    onClick={() => this.confirmUpload()}
                                />
                            </div>
                            
                        </div>
                    </div>  
                </Dialog>

                <Dialog
                    title="Self Audit"
                    modal={false}
                    open={this.state.auditModalOpen}
                    onRequestClose={this.handleAuditClose.bind(this)}
                >
                    <p style={Object.assign({}, msgTitleStyle, txtareaFormControl)}>
                        Reason:
                    </p>
                    <div style={txtareaFormControl}>
                        <textarea 
                        onChange={(e) => this.handleReasonChange(e)}
                        value={this.state.auditTransaction ? this.state.auditTransaction.Reason : ""}
                        placeholder="Please enter your reason.."
                        style={msgContainer} />       
                    </div>
                    <div style={btnControl}>
                        <div style={inlineBtnStyle}>
                            <RaisedButton 
                                disabled={false}
                                label="Update" 
                                primary={true} 
                                onClick={() => this.handleUpdateReason()}
                            />
                        </div>
                        <div style={inlineBtnStyle}>
                            <RaisedButton 
                                disabled={false}
                                label="Audit" 
                                primary={true} 
                                onClick={() => this.handleConfirmAduit()}
                            />
                        </div>
                    </div>           
                </Dialog>            
                <Snackbar 
                    open={this.state.open} 
                    message={this.state.message}
                    autoHideDuration={3000} 
                    onRequestClose={this.handleTouchTapClose}
                    bodyStyle={{backgroundColor: this.state.success ? green400 : pinkA400, textAlign: 'center' }}
                    />
            </div>
        )
    }
}

const styles = {

    uploadBtnContainerStyle: {
        marginTop: 24,
        textAlign: 'right'
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 24
    },
    subtitleStyle: {
        fontSize: 18,
        marginTop: 24,
        marginBottom: 0
    },
    formControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 12,
        marginBottom: 6
    },
    txtareaFormControl: {
        textAlign: 'left',
        paddingHorizontal: 24,
        marginTop: 12,
        marginBottom: 6
    },
    btnControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 24,
    },
    uploadBtnStyle: {
        marginLeft: 12,
        marginRight: 12
    },
    confirmBtnContainer: {
        marginTop: 36
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
    tableCellStyle: {
        width: 'calc(100%/9)',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        padding: 0,
        textAlign: 'center'
    },
    platformImgStyle:{
        display: 'block',
        width: 36,
        height: 36,
        margin: '0 auto'
    },
    msgContainer: {
        width: '60%',
        height: 100,
        padding: 12
    },
    msgTitleStyle: {
        marginTop: 0,
        fontSize: 16,
        color: '#000000'
    },
    inlineBtnStyle: {
        display: 'inline-block',
        marginLeft: 12,
        marginRight: 12,
    },

}


export default AuditPage;