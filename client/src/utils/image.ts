export const PLACEHOLDER_IMAGE = '/placeholder-product.svg';

export function onImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (!img.src.endsWith(PLACEHOLDER_IMAGE)) {
    img.src = PLACEHOLDER_IMAGE;
  }
}
