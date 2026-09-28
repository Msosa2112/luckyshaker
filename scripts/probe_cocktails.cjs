const { execSync } = require('child_process');
const path = require('path');

const files = [
  'videos para web/Whiskey Cream/Scroll_first_cinematic_whiskey_1080p.mp4',
  'videos para web/Whiskey Cream/Scroll_driven_whiskey_mobile_1080p.mp4',
  'videos para web/Old Fashioned/Cinematic_Old_Fashioned desktop.mp4',
  'videos para web/Old Fashioned/Old_Fashioned_cocktail_mobile.mp4',
  'videos para web/Mojito/Cinematic_mojito_desktop.mp4',
  'videos para web/Mojito/Mojito_product_video mobile.mp4'
];

files.forEach(f => {
  try {
    const jsonStr = execSync(`ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of json "${f}"`).toString();
    const data = JSON.parse(jsonStr);
    const s = data.streams[0];
    console.log(f, '=>', s.width + 'x' + s.height, '@', s.r_frame_rate, 'duration:', Number(data.format.duration).toFixed(2) + 's');
  } catch (err) {
    console.error('Error on', f, err.message);
  }
});
