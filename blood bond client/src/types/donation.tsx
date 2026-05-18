export interface DonationRequest {
  id: string;
  recipientName: string;
  recipientDistrict: string;
  recipientUpazila: string;
  donationDate: string;
  donationTime: string;
  bloodGroup: string;
  donationStatus: string;
  requesterEmail: string;
  donorName?: string;
  donorEmail?: string;
}
