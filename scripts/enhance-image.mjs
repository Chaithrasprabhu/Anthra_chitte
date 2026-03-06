 import { existsSync, copyFileSync, renameSync } from "fs";
 import { join } from "path";
 import sharp from "sharp";
 
 const root = process.cwd();
 const assetsDir = join(root, "public", "assets");
 const src = join(assetsDir, "home-hero.jpeg");
 const backup = join(assetsDir, "home-hero.original.jpeg");
 const outWebp = join(assetsDir, "home-hero.webp");
 const tmp = join(assetsDir, "home-hero.tmp.jpeg");
 
 async function main() {
   if (!existsSync(src)) {
     console.error("Source image not found:", src);
     process.exit(1);
   }
 
   if (!existsSync(backup)) {
     copyFileSync(src, backup);
     console.log("Backup created:", backup);
   }
 
   await sharp(backup)
     .modulate({ brightness: 1.08, saturation: 1.1 })
     .gamma(1.05)
     .jpeg({ quality: 92 })
     .toFile(tmp);
 
   renameSync(tmp, src);
   console.log("Enhanced image written:", src);
 
   await sharp(src).webp({ quality: 90 }).toFile(outWebp);
   console.log("WebP variant written:", outWebp);
 }
 
 main().catch((err) => {
   console.error(err);
   process.exit(1);
 });
