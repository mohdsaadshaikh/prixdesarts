const fs = require('fs');
const buf = fs.readFileSync('public/layer_clouds.webp');
// WebP VP8X chunk or VP8
if (buf.toString('ascii', 12, 16) === 'VP8X') {
  const w = 1 + buf.readUIntLE(24, 3);
  const h = 1 + buf.readUIntLE(27, 3);
  console.log('VP8X:', w, 'x', h);
} else if (buf.toString('ascii', 12, 16) === 'VP8 ') {
  const w = buf.readUInt16LE(26) & 0x3fff;
  const h = buf.readUInt16LE(28) & 0x3fff;
  console.log('VP8:', w, 'x', h);
} else {
  console.log('Unknown chunk:', buf.toString('ascii', 12, 16));
}
