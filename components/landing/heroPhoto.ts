import fs from "node:fs";
import path from "node:path";

/** Drop a photo here (e.g. an owner in their workshop) and it appears in the landing hero's right-hand panel.
 *  Checked at build time: restart the dev server or rebuild after adding it. */
const PHOTO_PATH = "/landing/hero-photo.jpg";

export const heroPhotoSrc: string | null = fs.existsSync(path.join(process.cwd(), "public", PHOTO_PATH))
  ? PHOTO_PATH
  : null;
