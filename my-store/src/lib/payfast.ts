import crypto from "crypto";

// PayFast configuration
export const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID ?? "",
  merchantKey: process.env.PAYFAST_MERCHANT_KEY ?? "",
  passphrase: process.env.PAYFAST_PASSPHRASE ?? "",
  sandbox: process.env.PAYFAST_SANDBOX === "true",
  returnUrl: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=success`
    : "http://localhost:3000/checkout?status=success",
  cancelUrl: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=cancelled`
    : "http://localhost:3000/checkout?status=cancelled",
  notifyUrl: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/payfast/notify`
    : "http://localhost:3000/api/payfast/notify",
};

// PayFast payment URLs
export const PAYFAST_URLS = {
  sandbox: "https://sandbox.payfast.co.za/eng/process",
  production: "https://www.payfast.co.za/eng/process",
};

export function getPayFastUrl(): string {
  return PAYFAST_CONFIG.sandbox
    ? PAYFAST_URLS.sandbox
    : PAYFAST_URLS.production;
}

export interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  cell_number?: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  email_confirmation?: string;
  confirmation_address?: string;
  payment_method?: string;
  signature?: string;
}

/**
 * Generate PayFast signature from payment data
 */
export function generatePayFastSignature(data: PayFastPaymentData): string {
  // Remove empty values and signature itself
  const cleanData: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== "" && key !== "signature") {
      cleanData[key] = String(value);
    }
  }

  // Sort by key name
  const sortedKeys = Object.keys(cleanData).sort();

  // Build query string
  const queryString = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(cleanData[key]).replace(/%20/g, "+")}`)
    .join("&");

  // Add passphrase if provided
  const stringToSign = PAYFAST_CONFIG.passphrase
    ? `${queryString}&passphrase=${encodeURIComponent(PAYFAST_CONFIG.passphrase)}`
    : queryString;

  // Generate MD5 hash
  return crypto.createHash("md5").update(stringToSign).digest("hex");
}

/**
 * Create PayFast payment data object
 */
export function createPayFastPaymentData(params: {
  mPaymentId: string;
  amount: number;
  itemName: string;
  itemDescription?: string;
  emailAddress?: string;
  nameFirst?: string;
  nameLast?: string;
  customData?: Record<string, string>;
}): PayFastPaymentData {
  const paymentData: PayFastPaymentData = {
    merchant_id: PAYFAST_CONFIG.merchantId,
    merchant_key: PAYFAST_CONFIG.merchantKey,
    return_url: PAYFAST_CONFIG.returnUrl,
    cancel_url: PAYFAST_CONFIG.cancelUrl,
    notify_url: PAYFAST_CONFIG.notifyUrl,
    m_payment_id: params.mPaymentId,
    amount: params.amount.toFixed(2),
    item_name: params.itemName,
    email_confirmation: "1",
  };

  if (params.itemDescription) {
    paymentData.item_description = params.itemDescription;
  }

  if (params.emailAddress) {
    paymentData.email_address = params.emailAddress;
  }

  if (params.nameFirst) {
    paymentData.name_first = params.nameFirst;
  }

  if (params.nameLast) {
    paymentData.name_last = params.nameLast;
  }

  // Add custom data if provided
  if (params.customData) {
    Object.entries(params.customData).forEach(([key, value], index) => {
      if (index < 5) {
        paymentData[`custom_str${index + 1}` as keyof PayFastPaymentData] = value;
      }
    });
  }

  // Generate signature
  paymentData.signature = generatePayFastSignature(paymentData);

  return paymentData;
}

