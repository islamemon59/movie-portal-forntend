import { http } from "@/lib/http";

export type SSLCommerzInitPayload = {
  amount: number;
  currency?: "BDT";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  transactionId: string;
};

type SSLCommerzInitResponse = {
  gatewayUrl: string;
};

export async function initiateSSLCommerzCheckout(
  payload: SSLCommerzInitPayload,
) {
  const { data } = await http.post<SSLCommerzInitResponse>(
    "/payments/sslcommerz/initiate",
    payload,
  );

  if (typeof window !== "undefined" && data.gatewayUrl) {
    window.location.href = data.gatewayUrl;
  }

  return data;
}
