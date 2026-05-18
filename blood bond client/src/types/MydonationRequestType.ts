export type DonationStatus = "pending" | "inprogress" | "done" | "canceled";

export interface myDonationRequestData {
  _id: string;
  recipientName: string;
  bloodGroup: string;
  recipientDistrict: string;
  recipientUpazila: string;
  hospitalName: string;
  fullAddressLine: string;
  donationDate: string;
  donationTime: string;
  donationStatus: DonationStatus;
  requesterEmail: string;
  requesterName: string;
  requestMessage?: string;
  donorName?: string;
  donorEmail?: string;
}
