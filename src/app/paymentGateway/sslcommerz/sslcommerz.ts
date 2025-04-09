/* eslint-disable @typescript-eslint/no-explicit-any */
import SSLCommerzPayment from 'sslcommerz-lts'

class SSLCommerzService {
  private store_id: string;
  private store_passwd: string;
  private is_live: boolean;
  private sslcz: typeof SSLCommerzPayment;

  constructor(store_id: string, store_passwd: string, is_live: boolean = false) {
    this.sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    this.store_id = store_id;
    this.store_passwd = store_passwd;
    this.is_live = is_live;
  }

  async initPayment(data: Record<string, any>) {
    try {
      const apiResponse = await this.sslcz.init(data);
      return apiResponse.GatewayPageURL;
    } catch (error : any) {
      throw new Error('Error initializing payment: ' + error.message);
      throw error;
    }
  }


  static createDefaultPaymentData(overrides = {}) {
    const defaultData = {
      total_amount: 100,
      currency: 'BDT',
      tran_id: 'REF' + Math.floor(Math.random() * 1000000000), // random transaction ID
      success_url: 'http://localhost:3030/success',
      fail_url: 'http://localhost:3030/fail',
      cancel_url: 'http://localhost:3030/cancel',
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'Courier',
      product_name: 'Computer.',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: 'Customer Name',
      cus_email: 'customer@example.com',
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01711111111',
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
    };

    return { ...defaultData, ...overrides };
  }
}

export default SSLCommerzService;