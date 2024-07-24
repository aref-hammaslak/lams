import Doc from "../models/Doc.js"

export const uploadDoc = async (req, res) => {
    const files = req.files;

    if (!files) {
        return res.status(400).send({
            success: false,
            message:'No file provided'
        });
    }

    const filesJson = JSON.parse(JSON.stringify(files));
    const docs = await createDocs(
        filesJson.map(file => ({ originalName: file.originalname, filename: file.filename }))
    );
    res.send({
        success: true,
        payload: docs
    });
}

export const getDoc = async (req, res) => {
    const { docId } = req.params;
    const doc = await Doc.findById(docId);
    if (!doc) {
        return res.send({
            success: false,
            message: 'Document Not Found!'
        });
    }
    return res.send({
        success: true,
        payload: doc
    });
}

export async function createDocs(inputs) {
    const docs = [];
    inputs.forEach(input => docs.push(new Doc(input)));
    await Doc.bulkSave(docs);
    return docs;
}