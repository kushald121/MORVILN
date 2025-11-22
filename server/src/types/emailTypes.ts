export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string; 
}


export interface OrderConfirmationData {
    customerName: string;
    orderId: string;
    orderDate: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    shippingAddress: string;
}


export interface ProductLaunchData {
  productName: string;
  productDescription: string;
  productImage?: string;
  launchDate: string;
  productUrl: string;
  specialOffer?: string;
}

export interface OfferData {
  customerName: string;
  offerTitle: string;
  offerDescription: string;
  discountCode?: string;
  validUntil: string;
  termsAndConditions?: string;
}

