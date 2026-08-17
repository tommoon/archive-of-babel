export function base32ToBigInt(base32Str: string): bigint {
  const base = BigInt(32);
  let result = BigInt(0);

  // Determine if the number is negative
  const isNegative = base32Str[0] === "-";
  const startIndex = isNegative ? 1 : 0;

  for (let i = startIndex; i < base32Str.length; i++) {
    const char = base32Str[i];
    const digit = parseInt(char, 32);

    // Check for invalid characters
    if (Number.isNaN(digit)) {
      throw new Error(`Invalid character '${char}' in base-32 string`);
    }

    result = result * base + BigInt(digit);
  }

  // Apply negative sign if necessary
  if (isNegative) {
    result = -result;
  }

  return result;
}

export function bigIntToBase32(bigInt: bigint): string {
  if (bigInt === 0n) return "0";

  const isNegative = bigInt < 0n;
  if (isNegative) {
    bigInt = -bigInt;
  }

  let result = "";
  while (bigInt > 0n) {
    const remainder = bigInt % 32n;
    result = Number(remainder).toString(32) + result;
    bigInt = bigInt / 32n;
  }

  return isNegative ? "-" + result : result;
}

export const base32Add = (num1: string, num2: string) => {
  const bigInt1 = base32ToBigInt(num1);
  const bigInt2 = base32ToBigInt(num2);

  return bigIntToBase32(bigInt1 + bigInt2);
};

export const base32Subtract = (num1: string, num2: string) => {
  const bigInt1 = base32ToBigInt(num1);
  const bigInt2 = base32ToBigInt(num2);

  return bigIntToBase32(bigInt1 - bigInt2);
};
