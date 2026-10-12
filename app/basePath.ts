export const BASE_PATH = '';

export function getAssetPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}
