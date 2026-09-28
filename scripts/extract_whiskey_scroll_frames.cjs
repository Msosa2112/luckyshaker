const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const videoSrc = path.join(rootDir, 'videos para web', 'Whiskey Cream', 'Scroll_first_cinematic_whiskey_4K.mp4');
const outDir = path.join(rootDir, 'assets', 'frames', 'whiskey_scroll');
const webVideoDest = path.join(rootDir, 'videos para web', 'Whiskey Cream', 'Scroll_first_cinematic_whiskey_1080p.mp4');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
} else {
  // Clear any previous frames
  fs.readdirSync(outDir).filter(f => f.endsWith('.webp')).forEach(f => fs.unlinkSync(path.join(outDir, f)));
}

console.log('--- 1. Extracting 120 WebP Frames (10s @ 12fps, 1920x1080 Lanczos) ---');
console.log('Source video:', videoSrc);
console.log('Destination:', outDir);

const t0 = Date.now();

const ffmpegArgs = [
  '-y',
  '-i', videoSrc,
  '-vf', 'fps=12,scale=1920:1080:flags=lanczos',
  '-c:v', 'libwebp',
  '-quality', '82',
  '-compression_level', '4',
  '-vframes', '120',
  path.join(outDir, 'frame-%04d.webp')
];

const proc = spawn('ffmpeg', ffmpegArgs, { stdio: 'inherit' });

proc.on('close', (code) => {
  if (code !== 0) {
    console.error(`FFmpeg frame extraction exited with code ${code}`);
    process.exit(code);
  }
  const frames = fs.readdirSync(outDir).filter(f => f.endsWith('.webp'));
  console.log(`✓ Frame extraction finished: ${frames.length} frames in ${((Date.now() - t0)/1000).toFixed(1)}s`);

  // Pad to 120 if needed
  if (frames.length > 0 && frames.length < 120) {
    console.log(`Padding frames from ${frames.length} to 120...`);
    const last = path.join(outDir, `frame-${String(frames.length).padStart(4, '0')}.webp`);
    for (let i = frames.length + 1; i <= 120; i++) {
      fs.copyFileSync(last, path.join(outDir, `frame-${String(i).padStart(4, '0')}.webp`));
    }
  }

  // Next: encode 1080p web-optimized mp4
  console.log('--- 2. Generating 1080p Faststart MP4 for Web ---');
  const encArgs = [
    '-y',
    '-i', videoSrc,
    '-vf', 'scale=1920:1080:flags=lanczos',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '20',
    '-movflags', '+faststart',
    '-an',
    webVideoDest
  ];
  const encProc = spawn('ffmpeg', encArgs, { stdio: 'inherit' });
  encProc.on('close', (encCode) => {
    if (encCode === 0) {
      console.log('✓ 1080p web video created:', webVideoDest);
    } else {
      console.error('Encoding web video failed with code', encCode);
    }
    console.log('ALL PIPELINES COMPLETE in', ((Date.now() - t0)/1000).toFixed(1), 's');
  });
});
