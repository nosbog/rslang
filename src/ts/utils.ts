export function getRandomInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function getRandomTrueOrFalse() {
  const num = Math.random();
  if (num > 0.5) return true;
  return false;
}
