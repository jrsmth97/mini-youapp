import { Request } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const FileOptions = {
  storage: diskStorage({
    destination: './storage/uploads',
    filename: (_: Request, file: any, cb: any) => {
      const ext = file.originalname.split('.').pop();
      const timeStamp = new Date().getTime();
      const imgId = uuidv4();
      cb(null, `${imgId}_${timeStamp}.${ext}`);
    },
  }),
  fileFilter: (_: Request, file: any, callback: any) => {
    const ext = file.originalname.split('.').pop();
    if (ext.match(/[jpg|png]/gi)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};
