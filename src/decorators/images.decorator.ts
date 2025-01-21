import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs"

// Custom decorator to handle image uploads
export const Images = (folder: string) => {
    return applyDecorators(
        UseInterceptors(
            FileFieldsInterceptor(
                [{ name: 'uploadImage[]', maxCount: 10 }],
                {
                    storage: diskStorage({
                        // Set the destination folder for uploaded images
                        destination: (_req, _file, callback) => {
                            const uploadPath = path.join(__dirname, `../../public/${folder}`);

                            // Create the folder if it doesn't exist
                            if (!fs.existsSync(uploadPath)) {
                                fs.mkdir(uploadPath, { recursive: true }, () => { });
                            }
                            callback(null, uploadPath);
                        },
                        // Generate a random filename for the uploaded image
                        filename: (_req, file, callback) => {
                            const randomName = Array(32)
                                .fill(null)
                                .map(() => Math.round(Math.random() * 16).toString(16))
                                .join('');
                            callback(null, `${randomName}${path.extname(file.originalname)}`);
                        },
                    }),
                }),
        ),
    );
};
