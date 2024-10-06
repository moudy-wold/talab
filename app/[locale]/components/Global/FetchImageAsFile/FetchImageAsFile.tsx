import mime from 'mime';

async function FetchImageAsFile(url : string, filename : string) {
    const proxyUrl = `${process.env.API_BASE_URL}/proxy-image?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl); // Fetching from your own Next.js API route
    const blob = await response.blob();
    const mimeType = mime.getType(url) || 'application/octet-stream';
    return new File([blob], filename, { type: mimeType });
  }
  export default FetchImageAsFile