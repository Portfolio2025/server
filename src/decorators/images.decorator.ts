import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs"

export const Images = (folder: string) => {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor('uploadImage', {
                storage: diskStorage({
                    destination: (req, file, callback) => {
                        const uploadPath = path.join(__dirname, `../../public/${folder}`);

                        if (!fs.existsSync(uploadPath)) {
                            fs.mkdir(uploadPath, { recursive: true }, ()=>{});
                        }
                        callback(null, uploadPath);
                    },
                    filename: (req, file, callback) => {
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
