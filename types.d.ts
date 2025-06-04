export interface CompanyInfo {
  country: string;
  city: string;
  address: string;
  postalCode: string;
  swiftCode: string;
  email: string;
  tel: string;
  fax: string;
  tfn: string;
  vatReceiptNo: string;
  vatRegNo: string;
  vatRegDate: string;
  name: string; // e.g., "Commercial Bank of Ethiopia"
  receiptTitle: string; // e.g., "VAT Invoice / Customer Receipt"
  logoBase64?: string; // <<< For the base64 encoded logo
}

export interface CustomerInfo {
  name: string;
  region?: string;
  city?: string;
  subCity?: string;
  weredaKebele?: string;
  vatRegNo?: string;
  vatRegDate?: string;
  tin?: string;
  branch?: string;
}

export interface PaymentInfo {
  payer: string;
  payerAccount: string;
  receiver: string;
  receiverAccount: string;
  dateTime: string;
  referenceNo: string;
  reason: string;
  amount: string;
  commission: string;
  vatOnCommission: string;
  totalDebited: string;
}

// // This will be the main data structure expected by the API and the template function
export interface CBEReceiptData {
  company: CompanyInfo;
  customer: CustomerInfo;
  payment: PaymentInfo;
  amountInWords: string;
  qrCodeBase64: any
}