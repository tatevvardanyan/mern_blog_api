const express = require("express");
const adminRouter = express.Router();
const jwt = require("jsonwebtoken");
const secret = "tetras-vi-key";
const User = require("../model/User");
const Post = require("../model/Post");

adminRouter.get("/user", async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                res.status(401).json({ error: "Unauthorized" });
            } else {
                if (info.isAuth) {
                    const isAdmin = info.role === 1;
                    if (!isAdmin) {
                        return res.status(400).json('You are not admin');
                    }
                    const users = await User.find({ role: { $ne: 1 } });
                    res.json(users)

                } else {
                    res.status(401).json({ error: "Unauthorized" });
                }
            }
        })
    } else {
        res.json({ error: "Unauthorized" });
    }
})
adminRouter.delete("/postdelete/:id", async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                res.status(401).json({ error: "Unauthorized" });
            } else {
                if (info.isAuth) {
                    const isAdmin = info.role === 1;
                    if (!isAdmin) {
                        return res.status(400).json('You are not admin');
                    }
                    const { id } = req.params;
                    await Post.findByIdAndDelete(id);
                    res.json("ok");
                } else {
                    res.status(401).json({ error: "Unauthorized" });
                }
            }
        })
    } else {
        res.json({ error: "Unauthorized" });
    }
});
adminRouter.delete("/userdelete/:id", async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                res.status(401).json({ error: "Unauthorized" });
            } else {
                if (info.isAuth) {
                    const isAdmin = info.role === 1;
                    if (!isAdmin) {
                        return res.status(400).json('You are not admin');
                    }
                    const { id } = req.params;
                    await User.findByIdAndDelete(id);
                    await Post.deleteMany({ author: id })
                    res.json("ok");
                } else {
                    res.status(401).json({ error: "Unauthorized" });
                }
            }
        })
    } else {
        res.json({ error: "Unauthorized" });
    }
})
module.exports = adminRouter