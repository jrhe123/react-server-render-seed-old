import React, { Component } from 'react';
import { browserHistory } from 'react-router';

// Libaries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import validator from 'validator';
import InputMask from 'react-input-mask';
import Subheader from 'material-ui/Subheader';
import { green400, pinkA400 } from 'material-ui/styles/colors';

// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';

// Router
import { root_page } from '../utilities/urlPath'

// API
import { opay_url, merchant_category_list, merchant_signup, merchant_upload_file } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

// Component
import Snackbar from 'material-ui/Snackbar';


class MerchantRegisterPage extends Component{

    constructor(props) {

        super(props);
        this.refactor = this.refactor.bind(this);
        this.state = {

            open: false,
            openForm: true,
            openLastPage: false,
            message: '',
            success: true,
            category: category,
            categoryValue: 0,
            UserGUID: '',
            merchantGUIDList: [],

            floatLabelStyle: { fontSize: '19px' },
            inputStyle: { fontSize: '19px'  },
            textFieldStyle: { width: '58%' },
            loginBtnStyle: { marginTop: '19px' },
            paperSize: { height: '95%', width: '55%' },

            incorporation: { name:'' },
            identification: { name:'' },
            photographs: { name:'' },
            check: { name:'' },
            incorporationErr: '',
            identificationErr: '',
            photographsErr: '',
            checkErr: '',

            btnTxt: 'Sign Up',
            isResend: false,
            website: '',
            merchantName: '',
            merchantNameErrorText: '',
            legalName: '',
            legalNameErrorText: '',
            phone: '',
            phoneErrorText:'',
            email: '',
            emailErrorText: '',
            isValidEmail: false
        }

        this.uploadFile = this.uploadFile.bind(this);
        this.handleSubmitFile = this.handleSubmitFile.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.refactor);

        const width = window.innerWidth;
        if (width <= 414) {

        } else if (width <= 768) {

        } else {

        }

     /*   let params = {
            Params: {
                Limit: '-1',
                Offset: '0',
                Extra: { SearchType: '', SearchField: '' }
            }
        };
        apiManager.opayApi(opay_url + merchant_category_list, params, false)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){
                    let list = response.data.Response.MerchantCategories;
                    let cagy = this.state.category;
                    let MerchantGUIDList = [];
                    for(let i = 0;i < this.state.category.length;i++) {
                        for (let j = 0;j < list.length;j++) {
                            if(cagy[i].includes(list[j].CategoryName)) {
                                MerchantGUIDList[i] = list[j].MerchantCategoryGUID;
                            }
                        }
                    }
                    this.setState({ merchantGUIDList: MerchantGUIDList });
                   // console.log(MerchantGUIDList);
                   // console.log(this.state.merchantGUIDList);
                }
            }).catch((err) => {
                console.log(err)
            })

        let updated = Object.assign({}, this.state);
        ['phone', 'email', 'legalName','merchantName','website','categoryValue'].map((item) => {
            let value = sessionStorage.getItem('merchant_register_' + item);
            if(value) {
                if(item === 'categoryValue') updated[item] = parseInt(value);
                else updated[item] = value;
            }
        })

        this.setState(updated);*/
    }

    refactor = () => {
        const width = window.innerWidth;
        if(width <= 414) {
            this.setState({ floatLabelStyle: { fontSize: '12px' } });
            this.setState({ inputStyle: { fontSize: '12px' } });
            this.setState({ textFieldStyle: { width: '66%' } });
            this.setState({ loginBtnStyle: {marginTop: '2px'}});
            this.setState({ paperSize: { height: '98%', width: '68%' } });
        } else if(width <= 768) {
            this.setState({ floatLabelStyle: { fontSize: '15px' } });
            this.setState({ inputStyle: { fontSize: '15px' } });
            this.setState({ textFieldStyle: { width: '78%' } });
            this.setState({ loginBtnStyle: {marginTop: '4px'}});
            this.setState({ paperSize: { height: '98%', width: '55%' } });
        } else {
            this.setState({floatLabelStyle: {fontSize: '19px'}});
            this.setState({inputStyle: {fontSize: '19px'}});
            this.setState({textFieldStyle: {width: '58%'}});
            this.setState({loginBtnStyle: {marginTop: '19px'}});
            this.setState({ paperSize: { height: '98%', width: '55%' } });
        }
    }

    handleCategoryChange = (e, index, value) => {
        this.setState({ categoryValue: value });
        sessionStorage.setItem('merchant_register_categoryValue',value);
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

    uploadFile = (field, e) => {

     //   console.log('e.target',e.target.files[0]);

        let file = e.target.files[0];
        let err = '';
        let size = file.size / 1000 / 1000;

        if(size > 2.5) {
            err = 'File size must smaller than 2.5 Mb'
        } else if((file.type.substr(0,5) !== 'image') && (file.type !== 'application/pdf')) {
            err = 'only image and pdf filles are accepted'
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

    onFieldChange = (field, e) => {
        let updated = Object.assign({}, this.state);
        let value = e.target.value;
        if(field === 'phone') value = value.replace(/\D/g,'').trim();
        updated[field] = value;
        sessionStorage.setItem('merchant_register_' + field, value);
        this.setState(updated);
    }

    handleSubmitFile = () => {

        let stop = false;

        if (!this.state.incorporation) {
            stop = true;
            this.setState({ incorporationErr: 'Certificate of incorporation is required' });
        }

        if (!this.state.identification) {
            stop = true;
            this.setState({ identificationErr: 'Identification is required' });
        }

        if (!this.state.photographs) {
            stop = true;
            this.setState({ photographsErr: 'Representative photograph is required' });
        }
        if (!this.state.check) {
            stop = true;
            this.setState({ checkErr: 'Check or letter is required' });
        }

        if (stop === true) return;

        let formData = new FormData();
        formData.append('File1', this.state.incorporation);
        formData.append('File2', this.state.identification);
        formData.append('File3', this.state.photographs);
        formData.append('File4', this.state.check);
        formData.append('UserGUID', this.state.UserGUID);

        apiManager.opayFileApi(opay_url + merchant_upload_file, formData, false)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){

                    //console.log('upload',response)
                    this.setState({ openLastPage: true });
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handlerSubmit = () => {
        if (!this.state.merchantName) {
            this.handleTouchTap('Please enter your merchant name', false);
        } else if(!this.state.email) {
            this.handleTouchTap('Please enter your email', false);
        } else if(!this.state.isValidEmail) {
            this.handleTouchTap('Invalid email address', false);
        } else if(!this.state.legalName) {
            this.handleTouchTap('Please enter your legal name', false);
        } else if(!this.state.phone) {
            this.handleTouchTap('Please enter your phone number', false);
        } else if(this.state.phone < 10) {
            this.handleTouchTap('Invalid phone number', false);
        } else{
            let params = {
                Params: {
                    MerchantName: this.state.merchantName,
                    LegalName: this.state.legalName,
                    MerchantCategoryGUID: this.state.merchantGUIDList[this.state.categoryValue],
                    MerchantWebsite: this.state.website,
                    Email: this.state.email,
                    PhoneNumber: this.state.phone,
                }
            };


            apiManager.opayApi(opay_url + merchant_signup, params, false)
                .then((response) => {
                    if(response.data.Confirmation === 'Success'){
                        //console.log('success', response.data.Response)
                        this.setState({ UserGUID: response.data.Response.UserGUID, openForm: true });
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }        
    }

    render() {

        const {
            mainMerchantRegisterPageStyle,
            uploadDescriptionStyle,
            paperStyle,
            verticalCenter,
            resendStyle,
            uploadDescriptionContainer,
            submitFileBtn
        } = styles;

        const resendText = (this.state.isResend)
            ? <p style={resendStyle}>Didn't receive email? Resend it.</p> : null;

        const basicInfo = (
                <div style={{ textAlign: 'center' }}>
                    <TextField floatingLabelText="Merchant name"
                               inputStyle={this.state.inputStyle}
                               floatingLabelStyle={this.state.floatLabelStyle}
                               style={this.state.textFieldStyle}
                               value={this.state.merchantName}
                               onBlur={this.onFieldBlur.bind(this, 'merchantName')}
                               errorText={this.state.merchantNameErrorText}
                               onChange={this.onFieldChange.bind(this, 'merchantName')} /><br />
                    <TextField floatingLabelText="Website (optional)"
                               inputStyle={this.state.inputStyle}
                               floatingLabelStyle={this.state.floatLabelStyle}
                               style={this.state.textFieldStyle}
                               value={this.state.website}
                               onChange={this.onFieldChange.bind(this, 'website')} /><br />
                    <TextField floatingLabelText="Legal Name"
                               inputStyle={this.state.inputStyle}
                               floatingLabelStyle={this.state.floatLabelStyle}
                               style={this.state.textFieldStyle}
                               value={this.state.legalName}
                               onBlur={this.onFieldBlur.bind(this, 'legalName')}
                               errorText={this.state.legalNameErrorText}
                               onChange={this.onFieldChange.bind(this, 'legalName')} /><br />
                    <TextField floatingLabelText="Phone"
                               inputStyle={this.state.inputStyle}
                               floatingLabelStyle={this.state.floatLabelStyle}
                               style={this.state.textFieldStyle}
                               value={this.state.phone}
                               onBlur={this.onFieldBlur.bind(this, 'phone')}
                               errorText={this.state.phoneErrorText}>
                        <InputMask mask="(999)999-9999"
                                   maskChar=" "
                                   defaultValue={this.state.phone}
                                   onChange={this.onFieldChange.bind(this, 'phone')} />
                    </TextField><br />
                    <TextField floatingLabelText="Email"
                               inputStyle={this.state.inputStyle}
                               floatingLabelStyle={this.state.floatLabelStyle}
                               style={this.state.textFieldStyle}
                               value={this.state.email}
                               onBlur={this.onFieldBlur.bind(this, 'email')}
                               errorText={this.state.emailErrorText}
                               onChange={this.onFieldChange.bind(this, 'email')} /><br /><br />
                    <DropDownMenu maxHeight={300} value={this.state.categoryValue} onChange={this.handleCategoryChange.bind(this)}>
                        {this.state.category.map((item,index) => (
                            <MenuItem value={index} key={index} primaryText={item}  />
                        ))}
                    </DropDownMenu><br />
                    <RaisedButton label={this.state.btnTxt}
                                  primary={true}
                                  style={this.state.loginBtnStyle}
                                  onClick={() => this.handlerSubmit()} /> <br />
                    { resendText }
                </div>
        )

        const signUpForm = (
                <div style={{ marginTop: 12, overflowY: 'auto' }}>
                    <div style={uploadDescriptionContainer}>
                        <p style={uploadDescriptionStyle}>1. A Copy of Certificate of incorporation</p>
                        <RaisedButton primary={true} containerElement='label' label='Upload'>
                            <div><input type="file" style={{ display: 'none' }} onChange={(e) => this.uploadFile('incorporation',e)} /></div>
                        </RaisedButton>
                        <p style={{ color: this.state.incorporationErr ? pinkA400 : green400, marginTop: 6 }}>{this.state.incorporationErr.length > 0 ? this.state.incorporationErr : this.state.incorporation.name}</p>
                    </div>

                    <div style={uploadDescriptionContainer}>
                        <p style={uploadDescriptionStyle}>2. A Copy of OWNER/OFFICER’s valid government-issued identification</p>
                        <RaisedButton primary={true} containerElement='label' label='Upload'>
                            <div><input type="file" style={{ display: 'none' }} onChange={(e) => this.uploadFile('identification',e)} /></div>
                        </RaisedButton>
                        <p style={{ color: this.state.identificationErr ? pinkA400 : green400, marginTop: 6 }}>{this.state.identificationErr.length > 0 ? this.state.identificationErr : this.state.identification.name}</p>
                    </div>

                    <div style={uploadDescriptionContainer}>
                        <p style={uploadDescriptionStyle}>3. Representative photographs of the interior and exterior of merchant’s retail
                            location, including the merchant’s logo/branding</p>
                        <RaisedButton primary={true} containerElement='label' label='Upload'>
                            <div><input type="file" style={{ display: 'none' }} onChange={(e) => this.uploadFile('photographs',e)} /></div>
                        </RaisedButton>
                        <p style={{ color: this.state.photographsErr ? pinkA400 : green400, marginTop: 6 }}>{this.state.photographsErr.length > 0 ? this.state.photographsErr : this.state.photographs.name}</p>
                    </div>

                    <div style={uploadDescriptionContainer}>
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

                    <RaisedButton primary={true} label='Submit' style={submitFileBtn} onClick={() => this.handleSubmitFile()}/>
                </div>
        )

        const lastPage = (
                <div>
                    <Subheader style={{ fontSize: '24px', fontWeight: 'bold', color:'#000000' }}>THANK YOU FOR APPLYING TO OPAY</Subheader>
                    <Subheader>We will be in touch within 2 business days to discuss your business needs.</Subheader>
                    <RaisedButton primary={true} label='Back to Home' style={submitFileBtn} onClick={() => browserHistory.push(`${root_page}`)}/>
                </div>
        )

        return (
            <MuiThemeProvider>
                <div style={mainMerchantRegisterPageStyle}>
                    <Paper zDepth={3} style={Object.assign({}, this.state.paperSize, paperStyle )}>
                            {this.state.openForm ? ( this.state.openLastPage ? lastPage : signUpForm ) : basicInfo }
                    </Paper>
                </div>
                <Snackbar open={this.state.open} message={this.state.message}
                    autoHideDuration={3000} onRequestClose={this.handleRequestClose}
                    bodyStyle={{backgroundColor: this.state.success ? green400 : pinkA400, textAlign: 'center' }}
                    />
            </MuiThemeProvider>
        )
    }
}

const styles = {

    mainMerchantRegisterPageStyle: {
        width: '100vw',
        height: '100vh',
    },

    uploadDescriptionContainer: {
        paddingLeft: '50px',
        paddingRight: '50px',
        marginTop: 18,
        marginBottom: 18
    },

    uploadDescriptionStyle: {
        textAlign: 'left',
        marginBottom: 12
    },

    submitFileBtn: {
        marginTop: 24,
        marginBottom: 24
    },

    paperStyle: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        textAlign: 'center',
        overflowY: 'auto',
    },

    signUpBtn: {
        marginTop: '10px',
    },

    verticalCenter: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)'
    },

    resendStyle: {
        marginTop: 12,
        color: '#B2B2B2',
    }

}

const category = [
    '综合商城 Integrated Store',
    '鞋包服饰 Clothes & Fashion',
    '食品 Food & Restaurants',
    '化妆品 Beauty & Health care',
    '酒店行业 Hospitality industry',
    '母婴 Baby, maternal products & toys',
    '办公用品 Office supplies',
    '旅游行业 Tourism & Travel',
    '机票行业 Airline tickets industry',
    '娱乐行业 Entertainment, music & games',
    '运动行业 Sports & Outdoors',
    '珠宝行业 Jewelry',
    '国际物流 International logistics',
    '教育行业 Education & School',
    '其他服务行业 Other services industry',
    '其他货物贸易行业 Other goods trade'
]

export default connect()(MerchantRegisterPage);