const { execSync } = require('child_process');

try {
  execSync('ffmpeg -y -ss 00:00:00 -i "videos para web/Old Fashioned/Old_Fashioned_cocktail_mobile.mp4" -vframes 1 "C:/Users/migue/.gemini/antigravity-ide/brain/566245d1-e974-47cd-aebd-81e100475be0/of_mobile_start.jpg"');
  execSync('ffmpeg -y -ss 00:00:03.5 -i "videos para web/Old Fashioned/Old_Fashioned_cocktail_mobile.mp4" -vframes 1 "C:/Users/migue/.gemini/antigravity-ide/brain/566245d1-e974-47cd-aebd-81e100475be0/of_mobile_end.jpg"');
  execSync('ffmpeg -y -ss 00:00:00 -i "videos para web/Mojito/Mojito_product_video mobile.mp4" -vframes 1 "C:/Users/migue/.gemini/antigravity-ide/brain/566245d1-e974-47cd-aebd-81e100475be0/mojito_mobile_start.jpg"');
  execSync('ffmpeg -y -ss 00:00:03.5 -i "videos para web/Mojito/Mojito_product_video mobile.mp4" -vframes 1 "C:/Users/migue/.gemini/antigravity-ide/brain/566245d1-e974-47cd-aebd-81e100475be0/mojito_mobile_end.jpg"');
  console.log('Sample frames extracted successfully');
} catch (e) {
  console.error(e.message);
}
