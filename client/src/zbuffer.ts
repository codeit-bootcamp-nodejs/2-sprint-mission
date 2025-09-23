let zBuffer: number[] = [];

export function initZBuffer(width: number) {
  zBuffer = new Array(width).fill(Infinity);
}

export function setZBuffer(x: number, value: number) {
  zBuffer[x] = value;
}

export function getZBuffer(x: number) {
  return zBuffer[x];
}
