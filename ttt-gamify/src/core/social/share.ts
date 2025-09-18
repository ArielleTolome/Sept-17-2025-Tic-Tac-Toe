export async function renderShareCard(opts: { title: string; subtitle?: string; themeColor?: string }): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200; canvas.height = 630;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = opts.themeColor || '#111827';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px system-ui, -apple-system, Segoe UI, Roboto';
  ctx.fillText(opts.title, 64, 220);
  ctx.font = 'normal 36px system-ui, -apple-system, Segoe UI, Roboto';
  if (opts.subtitle) ctx.fillText(opts.subtitle, 64, 300);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
}

