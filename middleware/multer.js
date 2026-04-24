import multer from "multer";

const uplode = multer({storage: multer.diskStorage({})})

export default uplode