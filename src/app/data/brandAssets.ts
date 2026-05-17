import { projectId } from "../../../utils/supabase/info";

const storageBaseUrl = `https://${projectId}.supabase.co/storage/v1/object/public/products`;

function publicAsset(path: string) {
  return `${storageBaseUrl}/${path}`;
}

export const brandLogoUrl = publicAsset("branding/logo-crowstore.png");
export const heroBannerUrl = publicAsset("branding/home-hero.png");

export const categoryImageUrls = {
  camisetas: publicAsset("categories/camisetas.png"),
  pantalones: publicAsset("categories/pantalones.png"),
  camisas: publicAsset("categories/camisas.png"),
  chaquetas: publicAsset("categories/chaquetas.png"),
  polos: publicAsset("categories/polos.png"),
  vestidos: publicAsset("categories/vestidos.png"),
  tops: publicAsset("categories/tops.png"),
} as const;