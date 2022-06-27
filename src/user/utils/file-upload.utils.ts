import { Request } from "express";

export const editFileName = (req: Request, file: Express.Multer.File, callback) => {
    const extension = file.originalname.split('.')[1];
    const randomIndicator = Math.floor(Math.random() * (100 - 1 + 1) + 1);
    const date = new Date();
    const name = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}-${date.getHours()}${date.getMinutes()}-${randomIndicator}`
    callback(null, `${name}.${extension}`);
}