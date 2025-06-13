export const maskAccountNumber = (accountNumber?: string): string => {
    if (!accountNumber) return "N/A";
    if (accountNumber.length < 4) return accountNumber;
    
    const lastFour = accountNumber.slice(-4);
    const firstDigit = accountNumber.charAt(0);
    
    return `${firstDigit}****${lastFour}`;
  };