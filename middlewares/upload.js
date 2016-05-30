/**
 * Created by kelvinsun on 2016/5/30.
 */
'use strict';
// TODO: 不需要压缩的资源上传
const fs = require('fs');
const path = require('path');
const Archiver = require('archiver');
const Formidable = require('formidable');

const config = require('../config');
const logger = require('../common/logger');

const uploadDir = config['upload']['path'];
// 涉及到把 post 参数赋值到 body, 所以需要放在 method-override 前面
const upload = (req, res, next) => {
    if (!!req.is('multipart/form-data')) {
        const form = new Formidable.IncomingForm();

        form.uploadDir = uploadDir;
        form.keepExtensions = true;

        form.on('file', (fields, file) => {
            const newName = `${path.basename(file.name, path.extname(file.name))}.${Date.now()}${path.extname(file.name)}`;
            const newPath = path.join(uploadDir, newName);
            const zipPath = path.join(uploadDir, newName + '.zip');
            // 重命名, 去掉自动改的 hash 名字
            fs.renameSync(file.path, newPath);

            const output = fs.createWriteStream(zipPath);
            // 文件压缩完成后删除原文件
            output.on('close', () => {
                fs.unlinkSync(newPath);
            });
            // 压缩
            const zipArchiver = Archiver('zip');
            zipArchiver.pipe(output);
            zipArchiver.bulk({
                cwd: path.dirname(newPath),
                src: newName,
                expand: true,
            });
            // 必须
            zipArchiver.finalize((err, bytes) => {
                if (err) {
                    logger.error('zip file error:', err);
                    throw err;
                } else {
                    logger.info('zip file done:', bytes);
                }
            });

            file.name = path.basename(zipPath);
            file.path = zipPath;
        });

        form.parse(req, (err, fileds, files) => {
            req.body = fileds || {};
            files && files['file'] && (req.file = files['file']);
            next();
        });
    } else {
        next();
    }
};

module.exports = upload;