export const initiatePayout = async (amount: number, currency: string, bankingInfo: any): Promise<{success: boolean, platformFee: number, practitionerPayout: number}> => {
  const platformFee = amount * 0.08;
  const practitionerPayout = amount - platformFee;
  
  console.log(`Initiating payout of ${practitionerPayout.toFixed(2)} ${currency} to ${bankingInfo.accountHolderName} (Account: ${bankingInfo.accountNumber})`);
  console.log(`Platform fee collected: ${platformFee.toFixed(2)} ${currency} (8%)`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate success
  return {
    success: true,
    platformFee,
    practitionerPayout
  };
};
