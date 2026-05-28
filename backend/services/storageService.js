import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { supabase, STORAGE_BUCKET } from '../config/supabase.js';

export async function uploadStanceImage(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase() || '.jpg';
  const fileName = `${uuidv4()}${ext}`;
  const fileBuffer = await fs.readFile(filePath);
  const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);

  await fs.unlink(filePath).catch(() => {});

  return data.publicUrl;
}
