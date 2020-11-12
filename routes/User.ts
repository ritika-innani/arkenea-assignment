import {Router} from "express";
import getDbConnection from "../db/DbManager";
import * as fs from "fs";
let objectId = require("mongodb").ObjectID;
const multer = require('multer');
const path = require('path');
let storage = multer.diskStorage({
    destination: function(req: any, file: any, cb: any) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null , Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
const upload = multer({ storage: storage });

const collection_name = "User";

module.exports = (router: Router) => {
    router.get("/user", async (req: any, res: any) => {
        const dbConnection =  await getDbConnection();
        if(req.query && req.query.id) {
            const id = req.query.id;
            dbConnection.collection(collection_name).findOne({_id: id})
                .then((data: any) => {
                    console.log("User found Successfully");
                    return res.status(200).json(data);
                })
                .catch((error: any) => {
                    console.log("Error getting user: ", error);
                    return res.status(500).json({"message": "Error getting users"})
                });
        } else {
            dbConnection.collection(collection_name).find({})
                .toArray()
                .then((data: any) => {
                    console.log("Users found Successfully");
                    return res.status(200).json(data);
                })
                .catch((error: any) => {
                    console.log("Error getting users: ", error);
                    return res.status(500).json({"message": "Error getting users"})
                });
        }
    });

    router.get("/user/image", async (req: any, res: any) => {
        try {
            const filename = req.query.path;
            const extension = filename.split('.')[1];
            const dirPath = path.join(__dirname, '../../uploads/');
            res.writeHead(200, {
                "Content-Type": "application/" + extension,
            });
            let file = fs.createReadStream(dirPath + filename);
            file.pipe(res);
            file.on("end", () => {
                console.log("Image sent successfully ");
            });
            file.on("error", (error) => {
                console.log("Error sending user image ", error);
                // return res.status(500).json({"message": "Error getting user image"});
            });
        } catch(e) {
            console.log("Error sending user image ", e);
            return res.status(500).json({"message": "Error getting user image"});
        }
    });

    router.post("/user", upload.single('imageFile'), async (req: any, res: any) => {
        try {
            if(!req.body.firstName || !req.body.email || !req.file || !req.file.filename) {
                console.log("Data Incomplete");
                return res.status(500).json({"message": "Data Incomplete"});
            }
            const data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                imageUrl: req.file.filename
            };

            const dbConnection =  await getDbConnection();
            let insertedData = await dbConnection.collection(collection_name).insertOne(data);
            console.log("Data Saved Successfully");
            return res.status(200).json(insertedData);
        } catch(e) {
            console.log("Error adding user ", e);
            return res.status(500).json({"message": "Error adding user"});
        }
    });

    router.put("/user", async (req: any, res: any) => {
        try {
            const updations = req.body.data;
            const id = updations._id;
            delete updations._id;
            const dbConnection =  await getDbConnection();
            let updatedData = await dbConnection.collection(collection_name).updateOne({_id: objectId(id)},
                {$set: updations});
            console.log("Data Updated Successfully");
            return res.status(200).json(updatedData);
        } catch(e) {
            console.log("Error updating user ", e);
            return res.status(500).json({"message": "Error updating user"});
        }
    });

    router.delete("/user", async (req: any, res: any) => {
        try {
            const id = req.query.id;
            const dbConnection =  await getDbConnection();
            let updatedData = await dbConnection.collection(collection_name).deleteOne({_id: objectId(id)});
            console.log("User deleted Successfully");
            return res.status(200).json(updatedData);
        } catch(e) {
            console.log("Error deleting user ", e);
            return res.status(500).json({"message": "Error deleting user"});
        }
    });

    return router;
};
