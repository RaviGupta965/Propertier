import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('photos');

    if (!files || files.length === 0) {
      return new Response('No files uploaded', { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      if (typeof file === 'string') return null;

      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);

      return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: 'propertier' },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        stream.pipe(upload);
      });
    });

    const urls = await Promise.all(uploadPromises);
    return Response.json({ urls: urls.filter(Boolean) }); // filters nulls
  } catch (err) {
    console.error('Upload Error:', err);
    return new Response('Upload failed', { status: 500 });
  }
}
