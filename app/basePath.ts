export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/detectives-cfi' : '';

export function getAssetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
}
