export function makeSN(length: number): string {
  let result = '';
  const numbers = '0123456789';
  const numbersLength = numbers.length;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    if (i === 2) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    } else {
      result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }
  }
  return result;
}
