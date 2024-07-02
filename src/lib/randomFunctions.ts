import { x86 as MurmurHash3 } from "murmurhash3js";

export function seededRandom(seed: string) {
  const hash = MurmurHash3.hash32(seed);
  // Use hash to generate a number between 0 and 1
  const randomNumber = (Math.abs(hash) % 1000000) / 1000000;
  return randomNumber;
}

export function generateSeededText(
  seed: string,
  lineLength: number = 58,
  linesCount: number = 20
): string {
  const characters = "abcdefghijklmnopqrstuvwxyz, . ";

  // Initialize a random number generator based on the seed
  function lcg(seed: number) {
    let state = seed;
    return function () {
      state = (state * 48271) % 2147483647;
      return state;
    };
  }

  // Convert the seed to an integer
  const seedInt = parseInt(seed, 10);

  // Create the random number generator
  const random = lcg(seedInt);

  // Generate 40 lines of 80 characters each
  let text = "";
  for (let i = 0; i < linesCount; i++) {
    let line = "";
    for (let j = 0; j < lineLength; j++) {
      const charIndex = random() % characters.length;
      line += characters[charIndex];
    }
    text += line + "\n";
  }

  return text;
}
