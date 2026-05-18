import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xbF5Cba0b0a1044f3aB2309E2FF074B4d7079B40e";

const CONTRACT_ABI = [
  "function recordDonation(string memory _donorEmail, string memory _recipientName, string memory _donationType, string memory _bloodGroup) public returns (uint256)",

  "function getRecord(uint256 _id) public view returns (string, string, string, string, uint256, bool)",

  "function recordCount() public view returns (uint256)"
];

export const recordDonationOnBlockchain = async (
  donorEmail: string,
  recipientName: string,
  donationType: "blood" | "organ",
  bloodGroup: string
) => {

  try {

    if (!(window as any).ethereum) {
      throw new Error("MetaMask not found");
    }

    const provider = new ethers.BrowserProvider(
      (window as any).ethereum
    );

    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const tx = await contract.recordDonation(
      donorEmail,
      recipientName,
      donationType,
      bloodGroup
    );

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash
    };

  } catch (error: any) {

    console.error(error);

    return {
      success: false,
      error: error.message
    };
  }
};