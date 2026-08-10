const MAX_OUTPUT_SIZE = 640
const OUTPUT_TYPE = 'image/webp'
const OUTPUT_QUALITY = 0.88

function loadImage(file: File) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const objectUrl = URL.createObjectURL(file)
		const image = new Image()

		image.onload = () => {
			URL.revokeObjectURL(objectUrl)
			resolve(image)
		}
		image.onerror = () => {
			URL.revokeObjectURL(objectUrl)
			reject(new Error('Não foi possível preparar a foto selecionada.'))
		}
		image.src = objectUrl
	})
}

function exportCanvas(canvas: HTMLCanvasElement) {
	return new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) resolve(blob)
				else reject(new Error('Não foi possível recortar a foto selecionada.'))
			},
			OUTPUT_TYPE,
			OUTPUT_QUALITY,
		)
	})
}

function getOutputName(originalName: string, mimeType: string) {
	const baseName = originalName.replace(/\.[^.]+$/, '') || 'foto-perfil'
	const extension = mimeType === OUTPUT_TYPE ? 'webp' : 'png'

	return `${baseName}-perfil.${extension}`
}

export async function cropProfileImage(file: File, verticalPosition: number) {
	const image = await loadImage(file)
	const cropSize = Math.min(image.naturalWidth, image.naturalHeight)
	const outputSize = Math.min(cropSize, MAX_OUTPUT_SIZE)
	const position = Math.min(100, Math.max(0, verticalPosition)) / 100
	const sourceX = (image.naturalWidth - cropSize) / 2
	const sourceY = (image.naturalHeight - cropSize) * position
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	if (!context) throw new Error('Seu navegador não conseguiu preparar a foto.')

	canvas.width = outputSize
	canvas.height = outputSize
	context.imageSmoothingEnabled = true
	context.imageSmoothingQuality = 'high'
	context.drawImage(
		image,
		sourceX,
		sourceY,
		cropSize,
		cropSize,
		0,
		0,
		outputSize,
		outputSize,
	)

	const croppedImage = await exportCanvas(canvas)

	return new File([croppedImage], getOutputName(file.name, croppedImage.type), {
		type: croppedImage.type,
		lastModified: Date.now(),
	})
}
