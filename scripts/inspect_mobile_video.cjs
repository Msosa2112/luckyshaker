const { execSync } = require('child_process');
const path = 'C:/Users/migue/Downloads/Scroll_driven_whiskey_cream_anim…_20260926214605.mp4';
try {
  const out = execSync(`ffmpeg -i "${path}"`, { stdio: ['pipe', 'pipe', 'pipe'] }).toString();
  console.log(out);
} catch (e) {
  const output = (e.stdout ? e.stdout.toString() : '') + (e.stderr ? e.stderr.toString() : '');
  const lines = output.split('\n').filter(l => l.includes('Duration') || l.includes('Stream') || l.includes('Video') || l.includes('Audio'));
  console.log(lines.join('\n'));
}
