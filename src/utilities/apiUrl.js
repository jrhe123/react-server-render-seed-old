 export const opay_url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/': '';
//export const opay_url = 'https://api.opay.ca/';//process.env.NODE_ENV === 'development' ? 'https://api.opay.ca/': '';


export const admin_login = 'admin/login';
export const admin_merchantlist = 'admin/merchant_list';
export const admin_logout = 'admin/logout';
export const admin_active_merchant = 'admin/active_merchant';
export const admin_create_pos = 'admin/create_merchant_pos';
export const admin_create_sales = 'admin/create_sales';
export const admin_remove_sales = 'admin/remove_sales';
export const admin_sales_list = 'admin/sales_list';
export const admin_upate_merchant_rate = 'admin/update_merchant_rate';
export const admin_view_merchant_bank_account = 'admin/view_merchant_bank_account';
export const admin_update_merchant_bank_account = 'admin/update_merchant_bank_account';
export const admin_create_merchant_bank_account = 'admin/create_merchant_bank_account';
export const admin_daily_report = 'admin/daily_report';
export const admin_assign_service_account = 'admin/assign_service_account';
export const admin_report = 'admin/export_report';
export const admin_franchise_list = 'admin/franchise_list';
export const admin_create_franchise =  'admin/create_franchise';
export const admin_franchise_available_merchant_list = 'admin/franchise_available_merchant_list';
export const admin_franchise_assign_merchant_list = 'admin/franchise_assign_merchant_list';
export const admin_assign_merchant_to_franchise = 'admin/assign_merchant_to_franchise';
export const admin_remove_merchant_from_franchise = 'admin/remove_merchant_from_franchise';

export const admin_create_address = 'admin/create_address';
export const admin_update_address = 'admin/update_address';
export const admin_get_merchant_default_address = 'admin/get_merchant_default_address';

export const merchant_upload_file = 'upload/multiple';
export const merchant_pos_machines = 'merchant/pos_machine_list_by_guid';
export const merchant_category_list = 'merchant_category/list';
export const merchant_signup = 'merchant/sign_up';
export const merchant_transaction_list = 'merchant/transaction_list';

// social media url

export const facebook = 'https://www.facebook.com/OPAY-Inc-922075181274404/?modal=admin_todo_tour';

export const twitter = 'https://twitter.com/?request_context=signup';

export const youtube = 'https://www.youtube.com/channel/UCnmKx2EG-SO5ER2-3Wq6VSQ?guided_help_flow=3&disable_polymer=true';

export const instagram = 'https://www.instagram.com/opay3950/?hl=en';