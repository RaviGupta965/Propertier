import { writeFile,unlink } from 'fs/promises';
import cloudinary from '@/app/lib/cloudinary';
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll('images');

  if (!files || files.length < 1) {
    return Response.json({ error: 'No files uploaded' }, { status: 400 });
  }

  const uploadedUrls = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tmpPath = `./uploads/${Date.now()}-${file.name}`;

    await writeFile(tmpPath, buffer);

    try {
      const result = await cloudinary.uploader.upload(tmpPath, {
        resource_type: 'image',
      });
      uploadedUrls.push(result.secure_url);
    } catch (err) {
      console.error("Cloudinary upload failed:", err.message);
    } finally {
      await unlink(tmpPath);
    }
  }

  return Response.json({ urls: uploadedUrls });
}
