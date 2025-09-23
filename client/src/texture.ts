let spriteTexture: HTMLImageElement | null = null;

export function loadSpriteTexture(src: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      spriteTexture = img;
      resolve();
    };
    img.onerror = reject;
  });
}

export function getSpriteTexture() {
  return spriteTexture;
}
