// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import isDecimal from 'validator/lib/isDecimal';
import isNumeric from 'validator/lib/isNumeric';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import moment from 'moment';
import Pagination from 'material-ui-pagination';
import SelectField from 'material-ui/SelectField';
import {Card} from 'material-ui/Card';
import InputMask from 'react-input-mask';
import validator from 'validator';


// helper
import * as formattor from '../helpers/formattor';

// Router
import { root_page } from '../utilities/urlPath'

// API
import { opay_url,
         merchant_category_list,
         admin_merchantlist,
         admin_logout,
         admin_active_merchant,
         admin_upate_merchant_rate,
         admin_view_merchant_bank_account,
         admin_create_merchant_bank_account,
         admin_update_merchant_bank_account,
         admin_create_address,
         admin_update_address,
         admin_get_merchant_default_address,
         admin_daily_report,
         admin_assign_service_account } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

// Component
import Snackbar from 'material-ui/Snackbar';
import PosList from '../components/PosList';
import SalesList from '../components/SalesList';
import Loading from '../components/Loading';
import EFT from '../components/EFT';
import Franchise from '../components/Franchise'
import AdminReport from '../components/AdminReport';


class AdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {

            addMerchantModal: false,
            website: '',
            merchantName: '',
            merchantNameErrorText: '',
            legalName: '',
            legalNameErrorText: '',
            phone: '',
            phoneErrorText:'',
            email: '',
            emailErrorText: '',
            merchantCategory: [],
            incorporation: {},
            identification: {},
            photographs: {},
            check: {},
            incorporationErr: '',
            identificationErr: '',
            photographsErr: '',
            checkErr: '',
            categoryValue: '',
            categoryGUID: '',

            docModalOpen: false,
            viewMerchant: {},
            docList: [],

            emailModalOpen: false,
            emailMerchant: {},
            msgContent: '',

            rate: '',
            rateModalOpen: false,
            rateMer: '',
            rateErr: '',

            hst: '',
            hstModalOpen: false,
            hstMer: '',
            hstErr: '',

            timeZoneModalOpen: false,
            timeZoneMer: null,
            timeZoneList: ['EST', 'PST'],
            selectedTimeZone: '',
            selectedTimeZoneMerIdx: null,

            widModalOpen: false, 
            widMer: null, 
            selectedWidMerIdx: null,
            selecctedWID: null,

            addressModalOpen: false,
            addrIdx: '',
            addrline1: '',
            addrline2: '',
            city: '',
            postal: '',
            province: '',
            country: '',
            addrline1Err: '',
            addrline2Err: '',
            cityErr: '',
            postalErr: '',
            provinceErr: '',
            countryErr: '',

            bankModalOpen: false,
            bankMer: '',
            Account: '',
            AccountErr: '',
            AccountName: '',
            AccountNameErr: '',
            Transit: '',
            TransitErr: '',
            Institution: '',
            InstitutionErr: '',
            InstitutionName: '',
            InstitutionNameErr: '',
            MerchantBankAccountGUID: '',
            addOrUpdate: 'Add',

            salesModalOpen: false,
            salesList: [],
            assignMerchant: {},
            selectedSales: {},

            open: false,
            message: '',
            success: false,
            UserTypeID: 6,
            currentPage: 1,
            display: 10,

            Limit: "10",
            Offset: "0",
            serial: '',
            totalRecords: 0,

            hideFirstAndLastPageLinks: false, hideEllipsis: false,
            merListOpenPop: [false],
            merListAnEl: [null],
            merListTitle: ['AgentID', 'Merchant', 'Email', 'Phone', 'Status', 'Sales', 'Rate(%)', 'HST#', 'Action'],
            salesListTitle: ['Name', 'Phone','Email','Status','Action'],
            merList: [],
            UserGUID: '',
            isLoading: true,
            tab: 0,
        }

        this.logout = this.logout.bind(this);
        this.getMerList = this.getMerList.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.active = this.active.bind(this);
        this.onPageChangeFromPagination = this.onPageChangeFromPagination.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.addPos = this.addPos.bind(this);
        this.renderTab = this.renderTab.bind(this);
        this.adminMain = this.adminMain.bind(this);
        this.salesMain = this.salesMain.bind(this);
        this.assignToSales = this.assignToSales.bind(this);
        this.updateRate = this.updateRate.bind(this);
        this.dailyReport = this.dailyReport.bind(this);
        this.rateChange = this.rateChange.bind(this);
        this.setBankAccountInfo = this.setBankAccountInfo.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.closeAllModal = this.closeAllModal.bind(this);
        this.EFT = this.EFT.bind(this);
        this.Franchise = this.Franchise.bind(this);
        this.setMerchantTimeZone = this.setMerchantTimeZone.bind(this);
        this.openAddressSetting = this.openAddressSetting.bind(this);
        this.handleAddressClose = this.handleAddressClose.bind(this);
        this.setAddressInfo = this.setAddressInfo.bind(this);
    }

    closeAllModal = () => {
        this.setState({
            docModalOpen: false,
            emailModalOpen: false,
            rateModalOpen: false,
            bankModalOpen: false,
            salesModalOpen: false,
            hstModalOpen: false,
            addressModalOpen: false,
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

    handleChangePage = (page) => {
        this.getMerList(page);
    }

    handleTouchTapClose = () => {
        this.setState({
            open: false,
        });
    };

    EFT = () => {
        this.setState({ tab: 3 })
    }

    adminMain = () => {
        this.setState({ tab: 0 })
    }

    salesMain = () => {
        this.setState({ tab: 2 })
    }

    addPos = (idx) => {
        this.setState({ 
            tab: 1, 
            UserGUID: this.state.merList[idx].UserGUID,
            merListOpenPop: [false],
            merListAnEl: [null],
        });
    }

    Franchise = () => {
        this.setState({ tab: 5 });
    }

    getMerList = (page) => {

        if (!page) {
            page = 1;
        }
        let offset = (page - 1) * parseInt(this.state.Limit);
        let limit = this.state.Limit;
        let params = { Params: { Limit: limit, Offset: offset.toString(), Extra: {} } };// Limit: -1 means return all results
        apiManager.opayApi(opay_url + admin_merchantlist, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {

                    let list = res.data.Response.Merchants;
                    for(let merchant of list){
                        merchant.PhoneNumber = merchant.PhoneNumber ? formattor.addFormatPhoneNumber(merchant.PhoneNumber.toString()) : null;                        
                        merchant.CreatedAt = merchant.CreatedAt ? moment(merchant.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                        merchant.UpdatedAt = merchant.UpdatedAt ? moment(merchant.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    }
                    this.setState({
                        currentPage: page,
                        merList: list,
                        totalRecords: res.data.Response.TotalRecords
                    })
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    onPageChangeFromPagination = (newPage) => {

        let start = (newPage-1)*10;
        let end = newPage * 10;
        end = end >= this.state.merList.length ? this.state.merList.length : end;

        let showMerList = this.state.merList.slice(start, end);
        this.setState({ currentPage: newPage, showMerList: showMerList, start: start, end: end });
    }

    logout = () => {

        apiManager.opayApi(opay_url + admin_logout, {}, true).then((res) => {

            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    active = (idx) => {

        let updatedPop = Object.assign([], this.state.merListOpenPop);
        updatedPop[idx] = false;
        this.setState({
            merListOpenPop: updatedPop            
        });

        let params = { Params: { UserGUID: this.state.merList[idx].UserGUID } };
        apiManager.opayApi(opay_url + admin_active_merchant, params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    let updated = Object.assign({}, this.state);
                    for (let i = 0;i < this.state.merList.length;i++) {
                        updated.merList[idx].AgentID = res.data.Response.AgentID;
                        updated.merList[idx].Status = 'ACTIVE';
                    }
                    this.setState(updated);
                    this.handleTouchTap(`Merchant has been updated`, true);
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
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

        event.preventDefault();

        let merListOpenPop = [];
        let merListAnEl = [];

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

    componentDidMount() {
        this.getMerList(this.state.currentPage);
        let token = localStorage.getItem('token');
        let userTypeId = localStorage.getItem('userTypeID');
        this.setState({ UserTypeID: userTypeId });
        setTimeout(() => {
            if(!token){
                browserHistory.push(`${root_page}`);
            }else{
                this.setState({
                    isLoading: false,
                })
            }
        }, 1000);
    }

    viewDocuments = (idx, merchant) => {

        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        this.setState(updated);
        this.closeAllModal();

        let params = { Params: { UserGUID: merchant.UserGUID } };
        apiManager.opayApi(opay_url+'admin/view_document_list', params, true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    
                    let updated = Object.assign({}, this.state);
                    updated.merListOpenPop[idx] = false;
                    updated.viewMerchant = merchant;
                    updated.docModalOpen = true;
                    updated.docList = res.data.Response;
                    this.setState(updated);
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    }

    handleDocClose = () => {
        this.setState({ docModalOpen: false, rateMer: '' });
    }

    viewFile = (doc) => {
        let file = this.state.viewMerchant.UserGUID + '/' + doc;
        window.open(`${opay_url}${file}`);
    }

    handleBackToList = () => {
        this.setState({
            tab: 0,
        })
    }

    onFieldChange = (e, value, field) => {

        if(field === 'New Rate') {
            if(!isDecimal(value)) this.setState({ rate: value, rateErr: 'Rate must be decimal' })
            else this.setState({ rate: value, rateErr: '' })
        } else if(field === 'Account Name') {
            this.setState({ AccountName: value, AccountNameErr: '' });
        } else if(field === 'Account') {
            if (!isNumeric(value)) { this.setState({ Account: value, AccountErr: 'please input valid account' }) }
            else this.setState({ Account: value, AccountErr: '' });
        } else if(field === 'Transit') {
            if (!isNumeric(value)) { this.setState({ Transit: value, TransitErr: 'please input valid transit' }) }
            else if (value.length !== 5) { this.setState({ Transit: value, TransitErr: 'The length of Transit Number should be 5' }) }
            else this.setState({ Transit: value, TransitErr: '' });
        } else if(field === 'Institution Name') {
            this.setState({ InstitutionName: value, InstitutionNameErr: '' });
        } else if(field === 'Institution') {
            if (!isNumeric(value)) { this.setState({ Institution: value, InstitutionErr: 'please input valid institution' }) }
            else if(value.length !== 3) { this.setState({ Institution: value, InstitutionErr: 'The length of Institution Number should be 3' }) }
            else this.setState({ Institution: value, InstitutionErr: '' });
        } else if(field === 'WID'){
            this.setState({ selecctedWID: value });
        } else if(field === 'HST'){
            this.setState({ hst: value });
        } else if(field === 'addrline1') {
            this.setState({ addrline1: value, addrline1Err: '' })
        } else if(field === 'addrline2') {
            this.setState({ addrline2: value, addrline2Err: '' })
        } else if(field === 'city') {
            this.setState({ city: value, cityErr: '' })
        } else if(field === 'province') {
            this.setState({ province: value, provinceErr: '' })
        } else if(field === 'country') {
            this.setState({ country: value, countryErr: '' })
        } else if(field === 'postal') {
            this.setState({ postal: value, postalErr: '' })
        } else {
            let updated = Object.assign({}, this.state);
            let value = e.target.value;
            if(field === 'phone'){
                value = value.replace(/\D/g,'').trim();
            } 
            updated[field] = value;
            this.setState(updated);
        }
    }

    assignToSales = (idx, merchant) => {

        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        this.setState(updated);
        this.closeAllModal();
        
        let params = { 
            "Params": {
                "Limit": "-1",
                "Offset": "0",
                "Extra": {
                    
                }           
            }
        };
        apiManager.opayApi(opay_url + 'admin/sales_list', params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    let salesList = res.data.Response.SalesList;
                    this.setState({
                        salesList: salesList,
                        assignMerchant: merchant,
                        salesModalOpen: true
                    })
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    }

    dailyReport = () => {

        this.setState({ tab: 4 })

     /*   apiManager.opayApi(opay_url + admin_daily_report, null, true).then((response) => {
            if (response.data) {
                let csvString = response.data;
                var blob = new Blob([csvString]);
                if (window.navigator.msSaveOrOpenBlob)  
                    window.navigator.msSaveBlob(blob, "report.csv");
                else{
                    var a = window.document.createElement("a");
                    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
                    a.download = "report.csv";
                    document.body.appendChild(a);
                    a.click(); 
                    document.body.removeChild(a);
                }
            }else{
                this.handleTouchTap(`Error: ${res.data.Message}`, false);
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        }); */
    }

    sendEmail = (idx, merchant) => {

        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        updated.emailModalOpen = true;
        updated.emailMerchant = merchant;
        this.closeAllModal();
        this.setState(updated);
        
        let defaultMsg = `Hi ${merchant.FirstName},\n\n\n\n`
                        + `Opay Inc.\n ${moment().format('YYYY-MM-DD')}`;
        updated.msgContent = defaultMsg;
    }

    sendServiceAccount = (idx) => {

        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        this.setState(updated);

        let merchantUserGUID = this.state.merList[idx].UserGUID;
        if(!merchantUserGUID){
            this.handleTouchTap(`Error: merchant UserGUID cannot be empty`, false);
        }

        let params = {
            Params: {
                MerchantUserGUID: merchantUserGUID
            }
        };
        apiManager.opayApi(opay_url + admin_assign_service_account, params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    this.handleTouchTap(`${res.data.Message}`, true);
                }else{
                    this.handleTouchTap(`${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    }

    openAddressSetting = (idx, merchant) => {

        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        this.setState(updated);
        this.closeAllModal();
        this.setState({ addressModalOpen: true, addrIdx: idx })

        let params = {
            Params: {
                AgentID: this.state.merList[idx].AgentID,
            }
        };


        apiManager.opayApi(opay_url + admin_get_merchant_default_address, params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    let updated = Object.assign({}, this.state);
                    if (res.data.Response.AddressLine1) {
                        updated.addrline1 = res.data.Response.AddressLine1;
                        updated.addrline2 = res.data.Response.AddressLine2;
                        updated.city = res.data.Response.City;
                        updated.postal = res.data.Response.PostalCode;
                        updated.country = res.data.Response.Country;
                        updated.province = res.data.Response.Province;
                        updated.addOrUpdate = 'Update'
                    } else {
                        updated.addrline1 = '';
                        updated.addrline2 = '';
                        updated.city = '';
                        updated.postal = '';
                        updated.country = '';
                        updated.province = '';
                        updated.addOrUpdate = 'Add'
                    }
                    updated.addrline1Err = '';
                    updated.addrline2Err = '';
                    updated.cityErr = '';
                    updated.postalErr = '';
                    updated.countryErr = '';
                    updated.provinceErr = '';
                    this.setState(updated);
                }else{
                    this.handleTouchTap(`${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });

    }

    handleAddressClose = () => {
        this.setState({ addressModalOpen: false })
    }

    setAddressInfo = () => {

        let url = '';
        let addrline1 = this.state.addrline1;
        let addrline2 = this.state.addrline2
        let city = this.state.city;
        let province = this.state.province;
        let postal = this.state.postal;
        let country = this.state.country;

        let addrline1Err = this.state.addrline1Err;
        let addrline2Err = this.state.addrline2Err;
        let cityErr = this.state.cityErr;
        let provinceErr = this.state.provinceErr;
        let postalErr = this.state.postalErr;
        let countryErr = this.state.countryErr;

        if (addrline1Err || addrline2Err || cityErr || provinceErr || countryErr || postalErr) return;

        if ((!addrline1) || (!city) || (!province) || (!postal) || (!country)) {

            if (!addrline1) { this.setState({ addrline1Err: 'Address line 1 is required' }) }
            if (!city) { this.setState({ cityErr: 'city is required' }) }
            if (!province) { this.setState({ provinceErr: 'province is required' }) }
            if (!postal) { this.setState({ postalErr: 'postal code is required' }) }
            if (!country) { this.setState({ countryErr: 'country is required' }) }

            return;
        }

        if ( this.state.addOrUpdate === 'Add' ) {
            url = admin_create_address;
        } else if (this.state.addOrUpdate === 'Update') {
            url = admin_update_address;
        }

        let params = {
            Params: {
                AgentID: this.state.merList[this.state.addrIdx].AgentID,
                AddressLine1: addrline1,
                AddressLine2: addrline2,
                City: city,
                Province: province,
                Country: country,
                PostalCode: postal
            }
        };

        apiManager.opayApi(opay_url + url, params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    let updated = Object.assign({}, this.state);
                    updated.addrline1Err = '';
                    updated.addrline2Err = '';
                    updated.cityErr = '';
                    updated.postalErr = '';
                    updated.countryErr = '';
                    updated.provinceErr = '';
                    this.setState(updated);
                }else{
                    this.handleTouchTap(`${res.data.Message}`, false);
                }
                this.closeAllModal();
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });

    }

    openWIDSetting = (idx, merchant) => {

        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        this.setState(updated);
        this.closeAllModal();
        this.setState({ widModalOpen: true, widMer: merchant, selectedWidMerIdx: idx })
    }

    handleWidClose = () => {
        this.setState({
            widModalOpen: false,
            widMer: null,
            selectedWidMerIdx: null,
            selecctedWID: null,
        });
    }

    setMerchantWID = () => {
        
        let merchantUserGUID = this.state.widMer.UserGUID;
        let selecctedWID = this.state.selecctedWID;
        if(!selecctedWID){
            selecctedWID = this.state.widMer.WID;
        }
        
        if(!merchantUserGUID){
            this.handleTouchTap(`Error: merchant UserGUID cannot be empty`, false);
            return;
        }
        if(!selecctedWID){
            this.handleTouchTap(`Error: wechat id cannot be empty`, false);
            return;
        }
       
        let params = {
            Params: {
                UserGUID: merchantUserGUID,
                WID: selecctedWID
            }
        };

        apiManager.opayApi(opay_url + 'admin/update_wechat_id', params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {

                    this.handleTouchTap(`${res.data.Message}`, true);
                    let updated = Object.assign({}, this.state);                    
                    updated.merList[this.state.selectedWidMerIdx].WID = selecctedWID;
                    this.setState(updated);
                    this.handleWidClose();
                }else{
                    this.handleTouchTap(`${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    }

    openTimeZoneSetting = (idx, merchant) => {

        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        this.setState(updated);
        this.closeAllModal();
        this.setState({ timeZoneModalOpen: true, timeZoneMer: merchant, selectedTimeZoneMerIdx: idx })
    }

    handleTimeZoneClose = () => {
        this.setState({
            timeZoneModalOpen: false,
            timeZoneMer: null,
            selectedTimeZone: null
        });
    }

    handleTimeZoneChange = (idx) => {
        let selectedTimeZone = this.state.timeZoneList[idx];
        if(selectedTimeZone){
            let updated = Object.assign({}, this.state);
            updated.selectedTimeZone = selectedTimeZone;
            this.setState(updated);
        }
    }

    setMerchantTimeZone = () => {

        let merchantUserGUID = this.state.timeZoneMer.UserGUID;
        let selectedTimeZone = this.state.selectedTimeZone;
        if(selectedTimeZone != 'EST' &&
            selectedTimeZone != 'PST'){
            
            selectedTimeZone = this.state.timeZoneMer.ZoneType;
        }
        
        if(!merchantUserGUID){
            this.handleTouchTap(`Error: merchant UserGUID cannot be empty`, false);
            return;
        }
        if(selectedTimeZone != 'EST'
            && selectedTimeZone != 'PST'){
            this.handleTouchTap(`Error: time zone must be EST or PST`, false);
            return;
        }
       
        let params = {
            Params: {
                UserGUID: merchantUserGUID,
                ZoneType: selectedTimeZone
            }
        };
        apiManager.opayApi(opay_url + 'admin/update_merchant_zone_type', params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {

                    this.handleTouchTap(`${res.data.Message}`, true);
                    let updated = Object.assign({}, this.state);                    
                    updated.merList[this.state.selectedTimeZoneMerIdx].ZoneType = selectedTimeZone;
                    this.setState(updated);
                    this.handleTimeZoneClose();
                }else{
                    this.handleTouchTap(`${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    }

    handleBankSettingClose = () => {
        this.setState({
            bankModalOpen: false,
            bankMer: '',
            Account: '',
            AccountErr: '',
            AccountName: '',
            AccountNameErr: '',
            Transit: '',
            TransitErr: '',
            Institution: '',
            InstitutionErr: '',
            InstitutionName: '',
            InstitutionNameErr: '',
            MerchantBankAccountGUID: '',
            addOrUpdate: 'Add'
        });
    }

    openBankSetting = (idx, merchant) => {

        let params = {
            Params: {
                MerchantUserGUID: merchant.UserGUID,
            }
        };

        apiManager.opayApi(opay_url + admin_view_merchant_bank_account, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    let bankInfo = res.data.Response.MerchantBankAccountList[0];
                    if (res.data.Response.TotalRecords > 0) {
                        this.setState({
                            Account: bankInfo.AccountNumber,
                            AccountName: bankInfo.AccountName,
                            Transit: bankInfo.TransitNumber,
                            Institution: bankInfo.InstitutionNumber,
                            InstitutionName: bankInfo.InstitutionName,
                            MerchantBankAccountGUID: bankInfo.MerchantBankAccountGUID,
                            addOrUpdate: 'Update',
                        })
                    }
                } else { }
            }
        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });

        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        this.setState(updated);
        this.closeAllModal();
        this.setState({ bankModalOpen: true, bankMer: merchant })
    }

    setBankAccountInfo = () => {

        if(this.state.AccountErr || this.state.AccountNameErr || this.state.TransitErr || this.state.InstitutionErr || this.state.InstitutionNameErr)
            return;

        if(!this.state.Account || !this.state.AccountName || !this.state.Transit || !this.state.Institution || !this.state.InstitutionName) {
            if(!this.state.Account) this.setState({ AccountErr: 'Acount is required' });
            if(!this.state.AccountName) this.setState({ AccountNameErr: 'AccountName is required' });
            if(!this.state.Transit) this.setState({ TransitErr: 'Transit is required' });
            if(!this.state.Institution) this.setState({ InstitutionErr: 'Institution is required' });
            if(!this.state.InstitutionName) this.setState({ InstitutionNameErr: 'InstitutionName is required' });
            return;
        }


        let params = {};
        let updateOrAdd = '';

        if (this.state.addOrUpdate === 'Add') {
            params = {
                Params: {
                    MerchantUserGUID: this.state.bankMer.UserGUID,
                    InstitutionName: this.state.InstitutionName,
                    AccountName: this.state.AccountName,
                    AccountNumber: this.state.Account,
                    TransitNumber: this.state.Transit,
                    InstitutionNumber: this.state.Institution
                }
            };
            updateOrAdd = admin_create_merchant_bank_account
        } else {
            params = {
                Params: {
                    MerchantBankAccountGUID: this.state.MerchantBankAccountGUID,
                    InstitutionName: this.state.InstitutionName,
                    AccountName: this.state.AccountName,
                    AccountNumber: this.state.Account,
                    TransitNumber: this.state.Transit,
                    InstitutionNumber: this.state.Institution
                }
            };
            updateOrAdd = admin_update_merchant_bank_account
        }

        apiManager.opayApi(opay_url + updateOrAdd, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    this.handleTouchTap(`Success`, true);
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });

        this.setState({
            bankModalOpen: false,
            bankMer: '',
            Account: '',
            AccountErr: '',
            AccountName: '',
            AccountNameErr: '',
            Transit: '',
            TransitErr: '',
            Institution: '',
            InstitutionErr: '',
            InstitutionName: '',
            InstitutionNameErr: '',
            MerchantBankAccountGUID: '',
            addOrUpdate: 'Add'
        });
    }


    updateRate = (idx, merchant) => {
        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        this.setState(updated);
        this.closeAllModal();
        this.setState({ rateModalOpen: true, rateMer: merchant });
    }

    handleRateClose = (e) => {
        this.setState({ rateModalOpen: false, rateMer: '', rate: '', rateErr: '' })
    }

    rateChange = () => {

        if(this.state.rateErr) {
            return;
        } else if (!this.state.rate) {
            this.setState({ rateErr: 'Rate must be decimal' });
            return
        } else if(parseFloat(this.state.rate) <= 0.0) {
            this.setState({ rateErr: 'Rate must be positive' });
            return
        }

        this.setState({ rateModalOpen: false });

        let converRate = parseFloat(this.state.rate).toFixed(2) / 100.00;

        let params = {
            Params: {
                UserGUID: this.state.rateMer.UserGUID,
                MerchantRate: converRate
            }
        };

        apiManager.opayApi(opay_url + admin_upate_merchant_rate, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    this.getMerList(this.state.currentPage);
                    this.handleTouchTap(`Success`, true);
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    updateHST = (idx, merchant) => {
        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        this.setState(updated);
        this.closeAllModal();
        this.setState({ hstModalOpen: true, hstMer: merchant });
    }

    handleHSTClose = (e) => {
        this.setState({ hstModalOpen: false, hstMer: '', hst: '', hstErr: '' })
    }

    hstChange = () => {

        if (!this.state.hst) {
            this.setState({ hstErr: 'HSTNumber is required' });
            return
        }
        let params = {
            Params: {
                UserGUID: this.state.hstMer.UserGUID,
                HSTNumber: this.state.hst
            }
        };
        apiManager.opayApi(opay_url + 'admin/update_merchant_hst', params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    this.getMerList(this.state.currentPage);
                    this.handleTouchTap(`Success`, true);
                    this.handleHSTClose();
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    handleSalesClose = () => {
        this.setState({ salesModalOpen: false })
    }

    handleSalesChange = (idx) => {
        let selectedSales = this.state.salesList[idx];
        if(selectedSales){
            let updated = Object.assign({}, this.state);
            updated.selectedSales = selectedSales;
            this.setState(updated);
        }
    }

    assignSales = () => {

        let { selectedSales, assignMerchant } = this.state;
        
        let MerchantUserGUID = assignMerchant.UserGUID;
        let SalesUserGUID = selectedSales.UserGUID;

        if(!MerchantUserGUID){
            this.handleTouchTap(`Error`, false);
            return;
        }
        if(!SalesUserGUID){
            this.handleTouchTap(`Please select a sales`, false);
            return;
        }
        
        let params = { 
            "Params": {
                "MerchantUserGUID": MerchantUserGUID,
                "SalesUserGUID": SalesUserGUID        
            }
        };
        apiManager.opayApi(opay_url + 'admin/assign_merchant_to_sales', params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    this.handleTouchTap(`Merchant has been assigned to sales`, true);
                    this.setState({
                        assignMerchant: {},
                        selectedSales: {},
                        salesModalOpen: false,
                    });
                    this.getMerList(this.state.currentPage);
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    }

    handleEmailChange = (e) => {
        let updated = Object.assign({}, this.state.emailMerchant);
        updated.Email = e.target.value;
        this.setState({
            emailMerchant: updated
        })
    }

    handleMsgChange = (e) => {
        this.setState({
            msgContent: e.target.value
        });
    }

    handleEmailClose = () => {
        this.setState({
            emailModalOpen: false
        });
    }

    sendMessage = () => {
        let email = this.state.emailMerchant.Email;
        let content = this.state.msgContent;
        if(!validateEmail(email)){
            this.handleTouchTap(`Email address is invalid`, false);
            return;
        }
        if(!content){
            this.handleTouchTap(`Content cannot be empty`, false);
            return;
        }

        let params = { 
            Params: { 
                Email: email,
                Content: content 
            } 
        };
        apiManager.opayApi(opay_url+'admin/send_email', params, true)
            .then((res) => {
                if (res.data) {
                    if (res.data.Confirmation === 'Success') {
                        this.handleEmailClose();
                        this.handleTouchTap(`Email has been sent`, true);
                    }else{
                        this.handleTouchTap(`Error: ${res.data.Message}`, false);
                    }
                }
            })
            .catch((err) => {
                this.handleTouchTap(`Error: ${err}`);
            });
    }

    openAddMerchantDialog = () => {
        this.setState({
            addMerchantModal: true
        })
        let params = {
            Params: {
                Limit: '-1',
                Offset: '0',
                Extra: { SearchType: '', SearchField: '' }
            }
        };
        apiManager.opayApi(opay_url + merchant_category_list, params, false)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){
                    this.setState({
                        addMerchantModal: true,
                        merchantCategory: response.data.Response.MerchantCategories
                    }) 
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    handleAddMerchantClose = () => {
        this.setState({
            addMerchantModal: false
        })
    }

    onFieldBlur = (field, e) => {

        let value = e.target.value;
        if(field === 'merchantName'){
            if(!value){
                let updated = Object.assign({}, this.state);
                updated['merchantNameErrorText'] = "Merchant name is required.";
                this.setState(updated);
            }else{
                let updated = Object.assign({}, this.state);
                updated['merchantNameErrorText'] = '';
                this.setState(updated);
            }
        } else if(field === 'legalName') {
            if(!value){
                let updated = Object.assign({}, this.state);
                updated['legalNameErrorText'] = "Legal name is required.";
                this.setState(updated);
            }else{
                let updated = Object.assign({}, this.state);
                updated['legalNameErrorText'] = '';
                this.setState(updated);
            }

        } else if(field === 'phone') {
            let updated = Object.assign({}, this.state);
            let phoneValue = updated['phone'];
            if(!phoneValue){
                let updated = Object.assign({}, this.state);
                updated['phoneErrorText'] = "Phone is required.";
                this.setState(updated);
            } else if(phoneValue.length < 10) {
                let updated = Object.assign({}, this.state);
                updated['phoneErrorText'] = "Your phone is invalid. Please enter a valid phone.";
                this.setState(updated);
            } else {
                let updated = Object.assign({}, this.state);
                updated['phoneErrorText'] = '';
                this.setState(updated);
            }
        } else if(field === 'email'){
            if(value){          
                if(!validator.isEmail(value)){
                    let updated = Object.assign({}, this.state);
                    updated['emailErrorText'] = "Your email address is invalid. Please enter a valid address.";
                    updated['isValidEmail'] = false;
                    this.setState(updated);
                }else{
                    let updated = Object.assign({}, this.state);
                    updated['emailErrorText'] = '';
                    updated['isValidEmail'] = true;
                    this.setState(updated);
                }
            }else{
                let updated = Object.assign({}, this.state);
                updated['emailErrorText'] = "Email address is required.";
                updated['isValidEmail'] = false;
                this.setState(updated);
            }
        }
    }

    uploadFile = (field, e) => {

        let file = e.target.files[0];
        let err = '';
        let size = file.size / 1000 / 1000;

        if(size > 2.5) {
            file = {};
            err = 'File size must smaller than 2.5 Mb';
        } else if((file.type.substr(0,5) !== 'image') 
            && (file.type !== 'application/pdf')) {
            file = {};
            err = 'only image and pdf filles are accepted';
        }

        if (field === 'incorporation') {
            this.setState({ incorporation: file, incorporationErr: err });
        } else if (field === 'identification') {
            this.setState({ identification: file, identificationErr: err });
        } else if (field === 'photographs') {
            this.setState({ photographs: file, photographsErr: err });
        } else if (field === 'check') {
            this.setState({ check: file, checkErr: err });
        }
    }

    handleCategoryChange = (value) => {
        let selectedCategory = this.state.merchantCategory[value];
        console.log('m1',selectedCategory.MerchantCategoryGUID)
        console.log('m2',selectedCategory.MerchantCategoryGUID.replace(/(\r\n|\n|\r)/gm,""))
        this.setState({
            categoryValue: selectedCategory.CategoryName,
            categoryGUID: selectedCategory.MerchantCategoryGUID.replace(/(\r\n|\n|\r)/gm,"")
        });
    }

    handleAddMerchant = () => {

        if (!this.state.merchantName) {
            this.handleTouchTap('Please enter your merchant name', false);
        } else if(!this.state.legalName) {
            this.handleTouchTap('Please enter your legal name', false);
        } else if(!this.state.phone) {
            this.handleTouchTap('Please enter your phone number', false);
        } else if(this.state.phone.length < 10) {
            this.handleTouchTap('Invalid phone number', false);
        } else if(!this.state.email) {
            this.handleTouchTap('Please enter your email', false);
        } else if(!validateEmail(this.state.email)) {
            this.handleTouchTap('Invalid email address', false);
        } else if(!this.state.categoryGUID) {
            this.handleTouchTap('Please select a merchant category', false);
        } else if(!this.state.incorporation.name){
            this.handleTouchTap('Please upload incorporation file', false);
        } else if(!this.state.identification.name){
            this.handleTouchTap('Please upload identification file', false);
        } else if(!this.state.photographs.name){
            this.handleTouchTap('Please upload photographs file', false);
        } else if(!this.state.check.name){
            this.handleTouchTap('Please upload check file', false);
        } else{
            
            let formData = new FormData();
            formData.append('MerchantName', this.state.merchantName);
            formData.append('MerchantWebsite', this.state.website);
            formData.append('LegalName', this.state.legalName);
            formData.append('PhoneNumber', this.state.phone);
            formData.append('Email', this.state.email);
            formData.append('MerchantCategoryGUID', this.state.categoryGUID);
            formData.append('File_incorporation', this.state.incorporation);
            formData.append('File_identification', this.state.identification);
            formData.append('File_photographs', this.state.photographs);
            formData.append('File_check', this.state.check);

            apiManager.opayFileApi(opay_url + 'sales/create_merchant', formData, true)
                .then((response) => {
                    if(response.data.Confirmation === 'Success'){   
                        this.setState({
                            addMerchantModal: false
                        })    
                        this.handleTouchTap(`Merchant has been created`, true);                 
                        this.getMerList(this.state.currentPage);
                    }else{
                        this.handleTouchTap(`${response.data.Message}`, false);
                    }
                })
                .catch((err) => {
                    this.handleTouchTap(`Error: ${error}`, false);
                })
        }
    }

    renderTab(tab) {

        const {
            tableCellStyle,
            docLink,
            msgContainer,
            btnControl,
            formControl,
            sideBtnContainer,
            addMerchantBtn,
            tableCardContainer,
            uploadDescriptionContainer,
            uploadDescriptionStyle,
        } = styles;

        switch(tab) {
            case 1:
                return (
                    <PosList UserGUID={this.state.UserGUID} OnBack={() => this.handleBackToList()} />
                );
            case 2:
                return (
                    <SalesList OnBack={() => this.handleBackToList()} />
                )
            case 3:
                return (
                    <EFT />
                )
            case 4:
                return (
                    <AdminReport />
                )
            case 5:
                return (
                    <Franchise OnBack={() => this.handleBackToList()} />
                )
            default:
                return (

                        <div>

                            {
                                this.state.UserTypeID == 6 ?
                                (
                                    <div style={sideBtnContainer}>
                                        <div style={addMerchantBtn}>
                                            <RaisedButton label="Add" primary={true} onClick={() => this.openAddMerchantDialog()}/><br/>
                                        </div>
                                    </div>
                                )
                                :
                                (null)
                            }

                            <Card style={tableCardContainer}>
                                <Table>
                                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                        <TableRow>
                                            {this.state.merListTitle.map((item) => (
                                                <TableHeaderColumn style={tableCellStyle}>{item}</TableHeaderColumn>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                                        {this.state.merList.slice(this.state.start,this.state.end).map((msg, idx)=>(
                                            <TableRow key={idx} selectable={false}>
                                                <TableRowColumn style={tableCellStyle}>{msg.AgentID ? msg.AgentID : 'PENDING'}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{msg.FirstName}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{msg.Email}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{msg.PhoneNumber}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{msg.Status === 'ACTIVE' ? 'ACTIVE' : 'PENDING'}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{(msg.SalesFirstName ? msg.SalesFirstName : '') + ' ' + (msg.SalesLastName ? msg.SalesLastName : '')}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{(parseFloat(msg.MerchantRate) * 100.0).toFixed(2)}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{msg.HSTNumber}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}><div style={{textAlign: 'center'}}>
                                                    <RaisedButton
                                                        onClick={(e) => this.handleAction(e, idx)}
                                                        secondary={msg.Status !== 'ACTIVE'}
                                                        label='ACTION'
                                                    />
                                                    <Popover
                                                        onRequestClose={(e, idx) => this.handleRequestClose(idx)}
                                                        open={this.state.merListOpenPop[idx]}
                                                        anchorEl={this.state.merListAnEl[idx]}
                                                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                        animation={PopoverAnimationVertical}>
                                                        <Menu>
                                                            {
                                                                (msg.Status === 'ACTIVE') ?
                                                                (
                                                                    this.state.UserTypeID == 1 ?
                                                                    (
                                                                        <div>
                                                                            <MenuItem primaryText="POS Machine" onClick={() => this.addPos(idx)}/>
                                                                            <MenuItem primaryText="Service Account" onClick={() => this.sendServiceAccount(idx)}/>
                                                                        </div>
                                                                    )
                                                                    :
                                                                    (null)
                                                                )
                                                                :
                                                                (
                                                                    this.state.UserTypeID == 1 ?
                                                                    (
                                                                        <MenuItem primaryText="Active" onClick={() => this.active(idx)}/>
                                                                    )
                                                                    :
                                                                    (null)                                                                    
                                                                )
                                                            }
                                                            <MenuItem primaryText="Bank Account" onClick={() => this.openBankSetting(idx, msg)}/>
                                                            { this.state.UserTypeID === '1' ? <MenuItem primaryText="Update Rate" onClick={() => this.updateRate(idx, msg)}/> : '' }
                                                            { this.state.UserTypeID === '1' ? <MenuItem primaryText="Update HST" onClick={() => this.updateHST(idx, msg)}/> : '' }
                                                            { this.state.UserTypeID === '1' ? <MenuItem primaryText="Assign To Sales" onClick={() => this.assignToSales(idx, msg)}/> : ''}
                                                            <MenuItem primaryText="Update Address" onClick={() => this.openAddressSetting(idx, msg)}/>
                                                            <MenuItem primaryText="Wechat ID" onClick={() => this.openWIDSetting(idx, msg)}/>
                                                            <MenuItem primaryText="TimeZone" onClick={() => this.openTimeZoneSetting(idx, msg)}/>
                                                            <MenuItem primaryText="Documents" onClick={() => this.viewDocuments(idx, msg)}/>
                                                            <MenuItem primaryText="Email" onClick={() => this.sendEmail(idx, msg)}/>
                                                        </Menu>
                                                    </Popover>
                                                </div></TableRowColumn>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>

                            <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>
                                <Pagination
                                    total={Math.ceil(this.state.totalRecords / parseInt(this.state.Limit))}
                                    current={this.state.currentPage}
                                    display={this.state.display}
                                    onChange={currentPage => this.handleChangePage(currentPage)}
                                />
                            </div>

                            <Dialog title="Add Merchant" 
                                className="add-merchant-modal"
                                modal={false} 
                                open={this.state.addMerchantModal}
                                onRequestClose={this.handleAddMerchantClose.bind(this)}
                                >
                                <div style={{marginBottom: 24}}>
                                    <div style={formControl}>   
                                        <TextField floatingLabelText="Merchant name"
                                                value={this.state.merchantName}
                                                onBlur={this.onFieldBlur.bind(this, 'merchantName')}
                                                errorText={this.state.merchantNameErrorText}
                                                onChange={(e, value) => this.onFieldChange(e, value, 'merchantName')} />
                                    </div>  
                                    <div style={formControl}>  
                                        <TextField floatingLabelText="Website (optional)"
                                                value={this.state.website}
                                                onChange={(e, value) => this.onFieldChange(e, value, 'website')} />
                                    </div>    
                                    <div style={formControl}>         
                                        <TextField floatingLabelText="Legal Name"
                                                value={this.state.legalName}
                                                onBlur={this.onFieldBlur.bind(this, 'legalName')}
                                                errorText={this.state.legalNameErrorText}
                                                onChange={(e, value) => this.onFieldChange(e, value, 'legalName')} />
                                    </div>
                                    <div style={formControl}>
                                        <TextField floatingLabelText="Phone"
                                                value={this.state.phone}
                                                onBlur={this.onFieldBlur.bind(this, 'phone')}
                                                errorText={this.state.phoneErrorText}>
                                            <InputMask mask="(999)999-9999"
                                                    maskChar=" "
                                                    defaultValue={this.state.phone}
                                                    value={this.state.phone}
                                                    onChange={(e, value) => this.onFieldChange(e, value, 'phone')} />
                                        </TextField>
                                    </div>   
                                    <div style={formControl}> 
                                        <TextField floatingLabelText="Email"
                                                value={this.state.email}
                                                onBlur={this.onFieldBlur.bind(this, 'email')}
                                                errorText={this.state.emailErrorText}
                                                onChange={(e, value) => this.onFieldChange(e, value, 'email')} />
                                    </div>    
                                    <div style={formControl}> 
                                        <SelectField
                                            style={{textAlign: 'left'}}
                                            floatingLabelText="Select a merchant type.."
                                            value={this.state.categoryValue}
                                            onChange={(e, value) => this.handleCategoryChange(value)}
                                        >
                                            {this.state.merchantCategory.map((item, index) => (
                                                <MenuItem value={item.CategoryName} key={index} primaryText={item.CategoryName}  />
                                            ))}
                                        </SelectField>
                                    </div>    
                                    
                                    <div style={Object.assign({}, formControl, {marginTop: 48})}>
                                        <p style={uploadDescriptionStyle}>1. A Copy of Certificate of incorporation</p>
                                        <RaisedButton primary={true} containerElement='label' label='Upload'>
                                            <div><input type="file" style={{ display: 'none' }} onChange={(e) => this.uploadFile('incorporation',e)} /></div>
                                        </RaisedButton>
                                        <p style={{ color: this.state.incorporationErr ? pinkA400 : green400, marginTop: 6 }}>{this.state.incorporationErr.length > 0 ? this.state.incorporationErr : this.state.incorporation.name}</p>
                                    </div>

                                    <div style={formControl}>
                                        <p style={uploadDescriptionStyle}>2. A Copy of OWNER/OFFICER’s valid government-issued identification</p>
                                        <RaisedButton primary={true} containerElement='label' label='Upload'>
                                            <div><input type="file" style={{ display: 'none' }} onChange={(e) => this.uploadFile('identification',e)} /></div>
                                        </RaisedButton>
                                        <p style={{ color: this.state.identificationErr ? pinkA400 : green400, marginTop: 6 }}>{this.state.identificationErr.length > 0 ? this.state.identificationErr : this.state.identification.name}</p>
                                    </div>

                                    <div style={formControl}>
                                        <p style={uploadDescriptionStyle}>3. Representative photographs of the interior and exterior of merchant’s retail
                                            location, including the merchant’s logo/branding</p>
                                        <RaisedButton primary={true} containerElement='label' label='Upload'>
                                            <div><input type="file" style={{ display: 'none' }} onChange={(e) => this.uploadFile('photographs',e)} /></div>
                                        </RaisedButton>
                                        <p style={{ color: this.state.photographsErr ? pinkA400 : green400, marginTop: 6 }}>{this.state.photographsErr.length > 0 ? this.state.photographsErr : this.state.photographs.name}</p>
                                    </div>

                                    <div style={formControl}>
                                        <p style={uploadDescriptionStyle}>4. One of the following is required:
                                            1. A voided copy of a permanent check (not a starter or
                                            handwritten check). OR
                                            If the voided check is not yet available, a letter is required from your financial institution typed
                                            on the banks letterhead and signed by an officer of the bank. The letter must include: your
                                            merchant name, account number, transit number, institution number and the contact details
                                            (including phone number) of the bank representative who signs the letter.</p>
                                        <RaisedButton primary={true} containerElement='label' label='Upload'>
                                            <div><input type="file" style={{ display: 'none' }} onChange={(e) => this.uploadFile('check',e)} /></div>
                                        </RaisedButton>
                                        <p style={{ color: this.state.checkErr ? pinkA400 : green400, marginTop: 6 }}>{this.state.checkErr.length > 0 ? this.state.checkErr : this.state.check.name}</p>
                                    </div>

                                    <div style={btnControl}>
                                        <RaisedButton label="Confirm" primary={true} onClick={() => this.handleAddMerchant()}/>
                                    </div>    
                                </div>
                            </Dialog>


                            <Dialog title="Address Info" modal={false} open={this.state.addressModalOpen}
                                    onRequestClose={this.handleAddressClose.bind(this)}>
                                <div>
                                    <div style={formControl}>
                                        <TextField floatingLabelText="AddressLine1" errorText={this.state.addrline1Err}
                                                   value={this.state.addrline1} onChange={(e, value) => this.onFieldChange(e, value, 'addrline1')}/><br/>
                                        <TextField floatingLabelText="AddressLine2" errorText={this.state.addrline2Err}
                                                   value={this.state.addrline2} onChange={(e, value) => this.onFieldChange(e, value, 'addrline2')}/><br/>
                                        <TextField floatingLabelText="City" errorText={this.state.cityErr}
                                                   value={this.state.city} onChange={(e, value) => this.onFieldChange(e, value, 'city')}/><br/>
                                        <TextField floatingLabelText="Province" errorText={this.state.provinceErr}
                                                   value={this.state.province} onChange={(e, value) => this.onFieldChange(e, value, 'province')}/><br/>
                                        <TextField floatingLabelText="Country" errorText={this.state.countryErr}
                                                   value={this.state.country} onChange={(e, value) => this.onFieldChange(e, value, 'country')}/><br/>
                                        <TextField floatingLabelText="Postal Code" errorText={this.state.postalErr}
                                                   value={this.state.postal} onChange={(e, value) => this.onFieldChange(e, value, 'postal')}/><br/>
                                    </div>
                                    <div style={btnControl}>
                                        <RaisedButton label={this.state.addOrUpdate} primary={true} onClick={this.setAddressInfo}/>
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog title="Bank Account Info" modal={false} open={this.state.bankModalOpen}
                                    onRequestClose={this.handleBankSettingClose.bind(this)}>
                                <div>
                                    <div style={formControl}>
                                        <TextField floatingLabelText="Account Name" errorText={this.state.AccountNameErr}
                                                   value={this.state.AccountName} onChange={(e, value) => this.onFieldChange(e, value, 'Account Name')}/><br/>
                                        <TextField floatingLabelText="Account Number" errorText={this.state.AccountErr}
                                                   value={this.state.Account} onChange={(e, value) => this.onFieldChange(e, value, 'Account')}/><br/>
                                        <TextField floatingLabelText="Transit Number" errorText={this.state.TransitErr}
                                                   value={this.state.Transit} onChange={(e, value) => this.onFieldChange(e, value, 'Transit')}/><br/>
                                        <TextField floatingLabelText="Institution Name" errorText={this.state.InstitutionNameErr}
                                                   value={this.state.InstitutionName} onChange={(e, value) => this.onFieldChange(e, value, 'Institution Name')}/><br/>
                                        <TextField floatingLabelText="Institution Number" errorText={this.state.InstitutionErr}
                                                   value={this.state.Institution} onChange={(e, value) => this.onFieldChange(e, value, 'Institution')}/>
                                    </div>
                                    <div style={btnControl}>
                                        <RaisedButton label={this.state.addOrUpdate} primary={true} onClick={this.setBankAccountInfo}/>
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog title="Wechat ID" modal={false} open={this.state.widModalOpen}
                                    onRequestClose={this.handleWidClose.bind(this)}>
                                <div>
                                    <div style={formControl}>
                                        <TextField 
                                            floatingLabelText="Sub merchant"
                                            defaultValue={this.state.widMer ? this.state.widMer.WID : ""}
                                            value={this.state.selecctedWID}
                                            onChange={(e, value) => this.onFieldChange(e, value, 'WID')}/>
                                    </div>
                                    <div style={btnControl}>
                                        <RaisedButton 
                                            label="Update" 
                                            primary={true} 
                                            onClick={this.setMerchantWID}/>
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog title="Time Zone" modal={false} open={this.state.timeZoneModalOpen}
                                    onRequestClose={this.handleTimeZoneClose.bind(this)}>
                                <div>
                                    <div style={formControl}>
                                        <SelectField
                                            style={{textAlign: 'left'}}
                                            floatingLabelText="Select a time zone.."
                                            value={this.state.selectedTimeZone ? this.state.selectedTimeZone : (this.state.timeZoneMer ? this.state.timeZoneMer.ZoneType : null)}
                                            onChange={(e, value) => this.handleTimeZoneChange(value)}
                                            >
                                            {this.state.timeZoneList.map((item, index) => (
                                                <MenuItem value={item} key={index} primaryText={item}  />
                                            ))}
                                        </SelectField>
                                    </div>
                                    <div style={btnControl}>
                                        <RaisedButton label="Update" primary={true} onClick={this.setMerchantTimeZone}/>
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog title="Change Rate (%)" modal={false} open={this.state.rateModalOpen}
                                    onRequestClose={this.handleRateClose.bind(this)}>
                                <div>
                                    <div style={formControl}>
                                        <TextField floatingLabelText="New Rate" errorText={this.state.rateErr}
                                                   onChange={(e, value) => this.onFieldChange(e, value, 'New Rate')}/><br/>
                                    </div>
                                    <div style={btnControl}>
                                        <RaisedButton label="Confirm" primary={true} onClick={this.rateChange}/>
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog title="Change HST Number" modal={false} open={this.state.hstModalOpen}
                                    onRequestClose={this.handleHSTClose.bind(this)}>
                                <div>
                                    <div style={formControl}>
                                        <TextField floatingLabelText="HST" errorText={this.state.hstErr}
                                                   onChange={(e, value) => this.onFieldChange(e, value, 'HST')}/><br/>
                                    </div>
                                    <div style={btnControl}>
                                        <RaisedButton label="Confirm" primary={true} onClick={this.hstChange}/>
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog title="Assign sales" modal={false} open={this.state.salesModalOpen}
                                    onRequestClose={this.handleSalesClose.bind(this)}>
                                <div>
                                    <div style={formControl}>
                                        <SelectField
                                            style={{textAlign: 'left'}}
                                            floatingLabelText="Select a sales.."
                                            value={this.state.selectedSales.FirstName ? this.state.selectedSales.FirstName + ' ' + this.state.selectedSales.LastName : null}
                                            onChange={(e, value) => this.handleSalesChange(value)}
                                            >
                                            {this.state.salesList.map((item, index) => (
                                                <MenuItem value={item.FirstName+' '+item.LastName} key={index} primaryText={item.FirstName+' '+item.LastName}  />
                                            ))}
                                        </SelectField>
                                    </div>
                                    <div style={btnControl}>
                                        <RaisedButton label="Confirm" primary={true} onClick={() => this.assignSales()}/>
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog title="Documentation" modal={false} open={this.state.docModalOpen}
                                onRequestClose={this.handleDocClose.bind(this)}>
                                <div style={{marginBottom: 24}}>
                                    {
                                        this.state.docList.map((doc, idx) => (
                                            <li>
                                                <a style={docLink}
                                                    onClick={() => this.viewFile(doc)}>{doc}</a>
                                            </li>
                                        ))
                                    }
                                </div>
                            </Dialog>

                            <Dialog title="Email" modal={false} open={this.state.emailModalOpen}
                                onRequestClose={this.handleEmailClose.bind(this)}>
                                <div style={{marginBottom: 36}}>
                                    <p style={{fontSize: 17, fontWeight: 'bold', color: '#000'}}>Information:</p>
                                    <p style={{fontSize: 15, color: '#000'}}>
                                        <span style={{color: '#8C8C8C'}}>Merchant:&nbsp;</span> 
                                        {this.state.emailMerchant.FirstName ? this.state.emailMerchant.FirstName : ''} 
                                    </p>
                                    <p style={{fontSize: 15, color: '#000'}}>
                                        <span style={{color: '#8C8C8C'}}>Sending to:&nbsp;</span> 
                                    </p>
                                    <input style={{width: '100%', borderBottom: '1px solid #c9c9c9'}} 
                                            type="text" 
                                            onChange={(e) => this.handleEmailChange(e)}
                                            value={this.state.emailMerchant.Email ? this.state.emailMerchant.Email : ''} />
                                </div>
                                <div style={{marginBottom: 24}}>
                                    <textarea 
                                        onChange={(e) => this.handleMsgChange(e)}
                                        value={this.state.msgContent}
                                        style={msgContainer} />
                                </div>
                                <div style={btnControl}>       
                                    <RaisedButton label="Send" 
                                                primary={true}
                                                onClick={() => this.sendMessage()} />
                                </div> 
                            </Dialog>
                        </div>
                );
        }
    }

    render() {

        const {
            mainPageStyle,
            drawerContainer,
            contentContainer,
            loadingContainer,
            drawerItem
        } = styles;

        if(this.state.isLoading){
            return (
                <div style={loadingContainer}>
                    <Loading />
                </div>
            )
        }

        return (
            <MuiThemeProvider>
                <div style={mainPageStyle}>

                    <div style={drawerContainer}>
                        <Drawer open={true} width={150}>
                            <MenuItem style={drawerItem} primaryText="Merchants" onClick={this.adminMain} />
                            {this.state.UserTypeID === '1' ? <MenuItem style={drawerItem} primaryText="Sales" onClick={this.salesMain} /> : ''}
                            {this.state.UserTypeID === '1' ? <MenuItem style={drawerItem} primaryText="Report" onClick={this.dailyReport} /> : ''}
                            {this.state.UserTypeID === '1' ? <MenuItem style={drawerItem} primaryText="EFT" onClick={this.EFT} /> : ''}
                            {this.state.UserTypeID === '1' ? <MenuItem style={drawerItem} primaryText="Franchise" onClick={this.Franchise} /> : ''}
                            <MenuItem style={drawerItem} primaryText="Log out" onClick={this.logout} />
                        </Drawer>
                    </div>

                    <div style={contentContainer}>
                        {this.renderTab(this.state.tab)}
                    </div>

                </div>
                <Snackbar 
                    open={this.state.open} 
                    message={this.state.message}
                    autoHideDuration={3000} 
                    onRequestClose={this.handleTouchTapClose}
                    bodyStyle={{backgroundColor: this.state.success ? green400 : pinkA400, textAlign: 'center' }}
                    />
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
        width: '12.8%',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        textAlign: 'center'
    },

    drawerContainer: {
        display: 'inline-block',
        float: 'left',
        width: '150px',
        height: '100vh',
    },

    drawerItem: {
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 6
    },

    contentContainer: {
        display: 'inline-block',
        float: 'left',
        width: 'calc(100% - 150px)',
        height: '100vh',
    },

    loadingContainer: {
        width: '100vw',
        height: '100vh',
    },

    docLink: {
        textDecoration: 'underline',
        cursor: 'pointer'
    },

    formControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 12,
        marginBottom: 12
    },

    msgContainer: {
        width: '100%',
        height: 200
    },

    btnControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 36,
        marginBottom: 12
    },

    uploadDescriptionContainer: {
        paddingLeft: '50px',
        paddingRight: '50px',
        marginTop: 18,
        marginBottom: 18
    },

    uploadDescriptionStyle: {
        textAlign: 'justify',
        maxWidth: 360,
        margin: '0 auto',
        marginTop: 36,
        marginBottom: 18,
    },

    sideBtnContainer: {
        height: 36,
        marginTop: 24,
    },

    addMerchantBtn: {
        float: 'right',
        height: 36,
    },

    tableCardContainer: {
        width: 'calc(100% - 48px)',
        margin: '0 auto',
        marginTop: 24
    },

    

}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const stateToProps = (state) => {

    return {
        UserTypeID: state.admin_reducer.UserTypeID,
    }
}

export default connect(stateToProps)(AdminPage);