import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Sube una imagen al bucket de Supabase Storage o conserva una copia local cuando no hay backend configurado.
 */
export const uploadImage = async (
  file: File,
  folder: 'branding' | 'hero' | 'products' | 'categories' = 'products'
): Promise<string> => {
  if (!file) throw new Error('No se seleccionó ningún archivo');

  // Validaciones
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Formato de imagen no soportado. Usa JPG, PNG, WEBP o GIF.');
  }

  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    throw new Error('La imagen excede el límite de 5MB.');
  }

  if (!isSupabaseConfigured) {
    // Permite trabajar localmente sin convertir el archivo en una dependencia externa.
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('catalog-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error al subir imagen a Supabase Storage:', error);
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('catalog-images')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};
