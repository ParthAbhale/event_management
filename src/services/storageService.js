const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const MAX_FILE_SIZE_MB = 1.8;

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not process the selected image.'));
    image.src = dataUrl;
  });
}

function canvasToDataURL(canvas, mimeType, quality) {
  return canvas.toDataURL(mimeType, quality);
}

function getResizedDimensions(width, height) {
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
    return { width, height };
  }

  if (width > height) {
    return {
      width: MAX_DIMENSION,
      height: Math.round((height / width) * MAX_DIMENSION),
    };
  }

  return {
    width: Math.round((width / height) * MAX_DIMENSION),
    height: MAX_DIMENSION,
  };
}

function estimateBytesFromDataURL(dataUrl) {
  const base64 = dataUrl.split(',')[1] || '';
  return Math.ceil((base64.length * 3) / 4);
}

export async function uploadImage(file) {
  if (!file) return null;

  const rawDataUrl = await readFileAsDataURL(file);
  const image = await loadImage(rawDataUrl);
  const { width, height } = getResizedDimensions(image.width, image.height);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Image processing is not supported in this browser.');
  }

  context.drawImage(image, 0, 0, width, height);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const processedDataUrl = canvasToDataURL(canvas, outputType, JPEG_QUALITY);
  const sizeInBytes = estimateBytesFromDataURL(processedDataUrl);

  if (sizeInBytes > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error('Image is still too large. Please choose a smaller image.');
  }

  return processedDataUrl;
}
