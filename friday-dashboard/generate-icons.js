// Run this with: node generate-icons.js
// Requires: npm install canvas
// Or skip — Vercel will use the SVG favicon, and the icons are referenced in the manifest
// For real icons, use https://realfavicongenerator.net/ with the favicon.svg

const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

function generateIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0a0e1a'
  roundRect(ctx, 0, 0, size, size, size * 0.22)
  ctx.fill()

  // Arc reactor glow
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size * 0.38)
  gradient.addColorStop(0, 'rgba(0, 212, 255, 0.9)')
  gradient.addColorStop(0.6, 'rgba(0, 102, 255, 0.6)')
  gradient.addColorStop(1, 'rgba(10, 14, 26, 0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(size/2, size/2, size * 0.38, 0, Math.PI * 2)
  ctx.fill()

  // Border circle
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)'
  ctx.lineWidth = size * 0.02
  ctx.beginPath()
  ctx.arc(size/2, size/2, size * 0.38, 0, Math.PI * 2)
  ctx.stroke()

  // Lightning bolt (Iron Man style)
  const s = size * 0.5
  const ox = (size - s) / 2
  const oy = (size - s * 1.0) / 2
  ctx.fillStyle = '#00d4ff'
  ctx.globalAlpha = 0.95
  ctx.beginPath()
  ctx.moveTo(ox + s * 0.55, oy)
  ctx.lineTo(ox + s * 0.3, oy + s * 0.5)
  ctx.lineTo(ox + s * 0.5, oy + s * 0.5)
  ctx.lineTo(ox + s * 0.45, oy + s)
  ctx.lineTo(ox + s * 0.7, oy + s * 0.5)
  ctx.lineTo(ox + s * 0.5, oy + s * 0.5)
  ctx.closePath()
  ctx.fill()

  return canvas.toBuffer('image/png')
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

try {
  fs.writeFileSync(path.join(__dirname, 'public/icons/icon-192.png'), generateIcon(192))
  fs.writeFileSync(path.join(__dirname, 'public/icons/icon-512.png'), generateIcon(512))
  console.log('Icons generated successfully!')
} catch (e) {
  console.log('canvas module not available — use realfavicongenerator.net with the SVG favicon')
}
