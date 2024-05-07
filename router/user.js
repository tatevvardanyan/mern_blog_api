const express = require("express");
const userRouter = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const Post = require("../model/Post");
const jwt = require("jsonwebtoken");
const secret = "tetras-vi-key";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        const name = crypto.randomUUID() + file.originalname
        cb(null, name)
    }
})
const upload = multer({ storage: storage })

userRouter.post("/post", upload.single('file'), async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                res.status(401).json({ error: "Unauthorized" });
            } else {
                if (info.isAuth) {
                    const { title, summery, content } = req.body;
                    const postDoc = await Post.create({
                        title,
                        summery,
                        content,
                        cover: req.file.filename,
                        author: info.id
                    });
                    res.json('ok')
                } else {
                    res.status(401).json({ error: "Unauthorized" });
                }
            }
        })
    } else {
        res.json({ error: "Unauthorized" });
    }
});

userRouter.put("/post", async (req, res) => {
    const { token } = req.cookies;
    // console.log(token)
    if (token) {
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                res.status(401).json({ error: "Unauthorized" });
            } else {
                if (info.isAuth) {
                    const { id, title, summery, content } = req.body;
                    const postIndex = await Post.findById({ _id: id });
                    const isAuthor = JSON.stringify(postIndex.author) === JSON.stringify(info.id);
                    if (!isAuthor) {
                        return res.status(400).json('You are not the author');
                    }
                    const update = await Post.findByIdAndUpdate(id, {
                        title,
                        summery,
                        content,
                        cover: postIndex.cover
                    })
                    res.json(update)
                } else {
                    res.status(401).json({ error: "Unauthorized" });
                }
            }
        })
    } else {
        res.json({ error: "Unauthorized" });
    }
});

module.exports = userRouter