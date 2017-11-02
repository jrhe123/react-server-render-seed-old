import React, { Component } from 'react';
import Footer from '../components/Footer';

class PrivacyPolicy extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        return (
            <div>
                <div className="doc-background">
                    <p className="txt-2" style={{ textAlign: 'center' }}>Privacy Policy</p>
                    <p className="txt-4">This privacy policy sets out how OPAY Inc. uses and protects any information that you give OPAY Inc. when you use this website.</p>
                    <p className="txt-4">OPAY Inc. is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.</p>
                    <p className="txt-4">OPAY Inc. may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from October 1st, 2017.</p>
                    <p className="txt-3" style={{ fontWeight: 'bold' }}>What we collect</p>
                    <p className="txt-4">We may collect the following information:</p>
                    <ul>
                        <li className="txt-4">name and job title</li>
                        <li className="txt-4">contact information including email address</li>
                        <li className="txt-4">demographic information such as postcode, preferences and interests</li>
                        <li className="txt-4">other information relevant to customer surveys and/or offers</li>
                    </ul>
                    <p className="txt-3" style={{ fontWeight: 'bold' }}>What we do with the information we gather</p>
                    <p className="txt-4">We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
                    <ul>
                        <li className="txt-4">Internal record keeping</li>
                        <li className="txt-4">We may use the information to improve our products and services</li>
                        <li className="txt-4">We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided</li>
                        <li className="txt-4">From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customize the website according to your interests</li>
                    </ul>
                    <p className="txt-3" style={{ fontWeight: 'bold' }}>Security</p>
                    <p className="txt-4">We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.</p>
                    <p className="txt-3" style={{ fontWeight: 'bold' }}>How we use cookies</p>
                    <p className="txt-4">A cookie is a small file which asks permission to be placed on your computer's hard drive. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.</p>
                    <p className="txt-3" style={{ fontWeight: 'bold' }}>Site Trackers</p>
                    <p className="txt-4">We use traffic log trackers to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.</p>
                    <p className="txt-4">Overall, trackers help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A tracker in no way gives us access to your computer or any information about you, other than the data you choose to share with us.</p>
                    <p className="txt-3" style={{ fontWeight: 'bold' }}>Links to other websites</p>
                    <p className="txt-4">Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.</p>
                    <p className="txt-3" style={{ fontWeight: 'bold' }}>Controlling your personal information</p>
                    <p className="txt-4">You may choose to restrict the collection or use of your personal information in the following ways:</p>
                    <ul>
                        <li className="txt-4">whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
                        <li className="txt-4">if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us</li>
                    </ul>
                    <p className="txt-4">We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</p>
                    <p className="txt-4">You may request details of personal information which we hold about you under the Data Protection Act 1998. A small fee will be payable.</p>
                    <p className="txt-4">If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.</p>
                    <p className="txt-4">Please contact us to find out more.</p>
                    <br />
                </div>
                <Footer />
            </div>
        )
    }
}

export default PrivacyPolicy