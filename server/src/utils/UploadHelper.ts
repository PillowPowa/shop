import type { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

// TEMP: types

export class UploadHelper {
  static customFileName(req: Request, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let fileExtension = '';
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = 'png';
    }
    const originalName = file.originalname.split('.')[0];
    cb(null, originalName + '-' + uniqueSuffix + '.' + fileExtension);
  }

  static destinationPath(req, file, cb) {
    cb(null, './uploads/');
  }

  static fileFilter(req: Request, file, cb) {
    if (!file.mimetype.match('\\.(jpe?g|png)$')) {
      cb(null, false);
    }
  }
}
