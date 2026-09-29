-- Migración: Agregar soporte para múltiples fotos por post
-- Ejecutar en la base de datos de Render

-- Agregar columna images (JSONB) para almacenar array de URLs
ALTER TABLE posts ADD COLUMN images JSONB DEFAULT '[]';

-- Migrar datos existentes: image_url → images array
UPDATE posts SET images = jsonb_build_array(image_url) WHERE image_url IS NOT NULL AND image_url != '';

-- Crear índice para búsquedas en el array de imágenes
CREATE INDEX idx_posts_images ON posts USING gin(images);
