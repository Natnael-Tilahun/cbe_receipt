// In your component or utility file

export const getQRCodeBase64 = async(idForQr: any) => {

    // Generate the URL for the receipt
    const receiptViewerUrl = `https://cbe-receipt.vercel.app/receipt-generator/${idForQr}`;
    
    // Generate the QR code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${receiptViewerUrl}`;
      
    try {
      // Fetch the QR code image
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
        
      // Convert the blob to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      return ''; // Return empty string or handle error appropriately
    }
  }