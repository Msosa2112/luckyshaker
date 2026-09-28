const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const downloadsVideo = 'C:/Users/migue/Downloads/Scroll_driven_whiskey_cream_anim…_20260926214605.mp4';
const targetDir = path.join(rootDir, 'videos para web', 'Whiskey Cream');
const masterMobile4K = path.join(targetDir, 'Scroll_driven_whiskey_mobile_4K.mp4');
const webMobile1080p = path.join(targetDir, 'Scroll_driven_whiskey_mobile_1080p.mp4');
const mobileFramesDir = path.join(rootDir, 'assets', 'frames', 'whiskey_scroll_mobile');

console.log('=== Step 1: Copy Master Mobile Video to Project Workspace ===');
if (!fs.existsSync(downloadsVideo)) {
  console.error('ERROR: Download video not found at:', downloadsVideo);
  process.exit(1);
}

fs.copyFileSync(downloadsVideo, masterMobile4K);
console.log('✓ Copied to:', masterMobile4K, `(${fs.statSync(masterMobile4K).size} bytes)`);

console.log('=== Step 2: Ensure frames directory exists ===');
if (!fs.existsSync(mobileFramesDir)) {
  fs.mkdirSync(mobileFramesDir, { recursive: true });
} else {
  fs.readdirSync(mobileFramesDir).filter(f => f.endsWith('.webp')).forEach(f => fs.unlinkSync(path.join(mobileFramesDir, f)));
}

console.log('=== Step 3: Extract 120 Mobile WebP Frames (10s @ 12fps, 720x1280 Lanczos, Quality 82) ===');
const t0 = Date.now();

// 720x1280 is optimal for mobile devices: crisp sharpness, low memory footprint, ultra-fast decoding
const ffmpegFrameArgs = [
  '-y',
  '-i', masterMobile4K,
  '-vf', 'fps=12,scale=720:1280:flags=lanczos',
  '-c:v', 'libwebp',
  '-quality', '82',
  '-compression_level', '4',
  '-vframes', '120',
  path.join(mobileFramesDir, 'frame-%04d.webp')
];

const proc = spawn('ffmpeg', ffmpegFrameArgs, { stdio: 'inherit' });

proc.on('close', (code) => {
  if (code !== 0) {
    console.error(`FFmpeg frame extraction exited with code ${code}`);
    process.exit(code);
  }

  const frames = fs.readdirSync(mobileFramesDir).filter(f => f.endsWith('.webp'));
  console.log(`✓ Mobile frame extraction finished: ${frames.length} frames in ${((Date.now() - t0)/1000).toFixed(1)}s`);

  // Pad to 120 frames if needed
  if (frames.length > 0 && frames.length < 120) {
    console.log(`Padding frames from ${frames.length} to 120...`);
    const last = path.join(mobileFramesDir, `frame-${String(frames.length).padStart(4, '0')}.webp`);
    for (let i = frames.length + 1; i <= 120; i++) {
      fs.copyFileSync(last, path.join(mobileFramesDir, `frame-${String(i).padStart(4, '0')}.webp`));
    }
  }

  console.log('=== Step 4: Encode Web-Optimized 1080x1920 MP4 with Faststart ===');
  const encArgs = [
    '-y',
    '-i', masterMobile4K,
    '-vf', 'scale=1080:1920:flags=lanczos',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '22',
    '-movflags', '+faststart',
    '-an',
    webMobile1080p
  ];

  const encProc = spawn('ffmpeg', encArgs, { stdio: 'inherit' });
  encProc.on('close', (encCode) => {
    if (encCode === 0) {
      console.log('✓ 1080x1920 Mobile Web video created:', webMobile1080p);
    } else {
      console.error('Encoding mobile web video failed with code', encCode);
    }
    console.log('=== ALL MOBILE PIPELINES COMPLETE in', ((Date.now() - t0)/1000).toFixed(1), 's ===');
  });
});
