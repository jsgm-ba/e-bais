/** Vista previa: desarrollo, despliegues de vista previa de Vercel o NEXT_PUBLIC_PREVIEW=1. */
export function esPreview(): boolean {
  return (
    process.env.NEXT_PUBLIC_PREVIEW === '1' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NODE_ENV === 'development'
  );
}
