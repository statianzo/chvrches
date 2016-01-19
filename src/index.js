'use strict';

const spawn = (gen) => {
  const loop = (prop, last) => {
    let result;
    try {
      result = iter[prop](last);
    }
    catch (err){
      return Promise.reject(err);
    }
    if (result.done) {
      return Promise.resolve(result.value);
    }
    else {
      return Promise.resolve(result.value)
      .then(success, fail);
    }
  };
  const iter = gen();
  const success = loop.bind(iter, 'next');
  const fail = loop.bind(iter, 'throw');

  return success();

};
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

const getPixels = (canvas, x, y) => {
  const ctx = canvas.getContext('2d');
  return ctx.getImageData(x, y, 100, 100);
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

const drawRect = (canvas, color, x, y) => {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
  ctx.fillRect(x, y, 100, 100);
};

spawn(function *() {
  const image = yield loadImage('/img/place.jpg');
  const x = 300;
  const y = 300;
  const canvas = canvasFromImage(image);
  const pixels = getPixels(canvas, x, y);
  const avg = colorAvg(pixels);
  const rect = drawRect(canvas, avg, x, y);
  document.body.appendChild(canvas);
});
