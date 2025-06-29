import multer from "multer";
import path from "path";

// configure storage:
const storage = multer.diskStorage({

    destination: function(req,file, cb){
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },

});

const fileFilter = (req:any, file:Express.Multer.File, cb: multer.FileFilterCallback) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }
    else{
        cb(new Error('Not an image. Please upload only image'));
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 1024 * 1024 * 5}, // 5 MB is limit
});