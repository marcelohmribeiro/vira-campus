import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { extname } from "node:path";
import { settings } from "#src/config";

cloudinary.config({
    cloud_name: settings.CLOUDINARY_CLOUD_NAME,
    api_key: settings.CLOUDINARY_API_KEY,
    api_secret: settings.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        // Pasta onde o arquivo será salvo
        folder: (req, file) => {
            return req.baseUrl.includes("usuarios") ? "uploads/perfis" : "uploads/anuncios";
        },
        // Formato do arquivo
        format: async (req, file) => extname(file.originalname).replace(".", ""),
        // Nome do arquivo
        public_id: (req, file) => `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`,
    },
})

const upload = multer({
    // Tamanho maximo permitido do arquivo (2MB)
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    // Formato de imagens permitidas
    fileFilter: (req, file, cb) => {
        const allowedImages = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        // Verificando se o arquivo é permitido
        if (allowedImages.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Invalid file type."))
        }
    },
})

export { upload };
export default upload;
