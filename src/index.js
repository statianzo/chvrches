'use strict';

const loadImage = (url) => {
  const image = new Image;
  image.src = url;
  return new Promise((resolve, reject) => {
    image.onload = resolve.bind(null, image);
    image.onerror = reject;
  });
};

const canvasFromImage = (image) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);
  return canvas;
};

const getPixels = (canvas, x, y, w, h) => {
  const ctx = canvas.getContext('2d');
  return ctx.getImageData(x, y, w, h);
};

const colorAvg = (imageData) => {
  let r = 0, g = 0, b = 0, a = 0;
  const length = imageData.data.length;
  const total = length / 4;
  for (let i = 0; i < length; i++) {
    const val = imageData.data[i];
    switch (i % 4) {
    case 0:
      r += val;
      break;
    case 1:
      g += val;
      break;
    case 2:
      b += val;
      break;
    case 3:
      a += val;
      break;
    }
  }
  return {
    r: r/total|0,
    g: g/total|0,
    b: b/total|0,
    a: a/total|0
  };
};

const drawRect = (canvas, color, x, y, w, h) => {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
  ctx.fillRect(x, y, w, h);
};

const drawAvgBlock = (canvas, x, y, w, h) => {
  const pixels = getPixels(canvas, x, y, w, h);
  const avg = colorAvg(pixels);
  drawRect(canvas, avg, x, y, w, h);
};

const random = (max) => Math.floor(Math.random() * max);

(() => {
  const size = 50;
  const count = 20;
  loadImage('/img/flowers.jpg').then((image) => {
    const cols = Math.floor(image.width / size);
    const rows = Math.floor(image.height / size);
    const canvas = canvasFromImage(image);

    for(let i = 0; i < count; i++) {
      drawAvgBlock(canvas, random(cols) * size, random(rows) * size, size, size);
    }

    document.body.appendChild(canvas);
  });
})();
