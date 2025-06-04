function amountToWords(
  amount: number,
  currencyName: string = "ETB",
  subUnitName: string = "cents", // Or "Cents"
  subUnitPrecision: number = 2 // Number of decimal places for sub-unit
): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];
  const scales = ["", "Thousand", "Million", "Billion", "Trillion"]; // Add more if needed

  function convertLessThanOneThousand(n: number): string {
    if (n === 0) return "";
    let currentWords = "";
    if (n >= 100) {
      currentWords += ones[Math.floor(n / 100)] + " Hundred";
      n %= 100;
      if (n > 0) currentWords += " ";
    }
    if (n > 0) {
      if (n < 20) {
        currentWords += ones[n];
      } else {
        currentWords += tens[Math.floor(n / 10)];
        if (n % 10 > 0) {
          currentWords += " " + ones[n % 10];
        }
      }
    }
    return currentWords;
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    return "Invalid amount";
  }
  if (amount === 0) {
    return `Zero ${currencyName} Only`;
  }

  const numStr = amount.toFixed(subUnitPrecision);
  const [integerPartStr, decimalPartStr] = numStr.split('.');

  let integerPart = parseInt(integerPartStr, 10);
  const decimalPart = parseInt(decimalPartStr, 10) || 0;

  let words = "";
  if (integerPart === 0 && decimalPart === 0) {
     return `Zero ${currencyName} Only`;
  }

  if (integerPart > 0) {
    let scaleIndex = 0;
    let tempWords = [];
    while (integerPart > 0) {
      if (integerPart % 1000 !== 0) {
        const partWords = convertLessThanOneThousand(integerPart % 1000);
        if (scales[scaleIndex]) {
          tempWords.unshift(partWords + " " + scales[scaleIndex]);
        } else {
          tempWords.unshift(partWords);
        }
      }
      integerPart = Math.floor(integerPart / 1000);
      scaleIndex++;
    }
    words = tempWords.join(" ").trim();
  }


  let fullWords = "";
  if (words) { // If there was an integer part
    fullWords = words + " " + currencyName;
  }

  if (decimalPart > 0) {
    const decimalWords = convertLessThanOneThousand(decimalPart); // Handles up to 99 for cents
    if (fullWords) { // If integer part existed
        fullWords += " and " + decimalWords + " " + subUnitName;
    } else { // Only decimal part e.g. 0.50
        fullWords = decimalWords + " " + subUnitName;
    }
  } else if (integerPart > 0) { // Only if there was an integer part and no decimal part
    fullWords += " Only";
  } else if (integerPart === 0 && decimalPart === 0 && amount === 0) {
     // Already handled by the initial zero check, but for completeness
     fullWords = `Zero ${currencyName} Only`;
  }


  // Capitalize first letter
  if (fullWords.length > 0) {
    fullWords = fullWords.charAt(0).toUpperCase() + fullWords.slice(1);
  }

  return fullWords.replace(/\s+/g, ' ').trim(); // Clean up multiple spaces
}

// --- How to use it in your Vue component ---
// Example usage:
// console.log(amountToWords(250.00)); // "Two Hundred Fifty Ethiopian Birr Only"
// console.log(amountToWords(12345.67)); // "Twelve Thousand Three Hundred Forty Five Ethiopian Birr and Sixty Seven Santim"
// console.log(amountToWords(1000000)); // "One Million Ethiopian Birr Only"
// console.log(amountToWords(0.50));    // "Fifty Santim"
// console.log(amountToWords(0));       // "Zero Ethiopian Birr Only"
// console.log(amountToWords(10.05));   // "Ten Ethiopian Birr and Five Santim"
// console.log(amountToWords(20.00, "USD", "Cents")); // "Twenty USD Only"
// console.log(amountToWords(15.25, "USD", "Cents")); // "Fifteen USD and Twenty Five Cents"

export { amountToWords }; // Export if you put this in a separate utils.ts file