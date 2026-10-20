import { toPng } from 'html-to-image'

/**
 * Renders a live frame node (photos + filter + stickers + text, exactly as styled)
 * to a high-res PNG and downloads it. pixelRatio 3 ≈ print-crisp for these frame sizes.
 */
export async function exportNodePng(node: HTMLElement, frameName: string): Promise<void> {
  const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true })
  const a = document.createElement('a')
  a.download = `cut-of-four-${frameName}.png`
  a.href = dataUrl
  a.click()
}
