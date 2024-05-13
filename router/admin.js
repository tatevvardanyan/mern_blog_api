const express = require("express");
const adminRouter = express.Router();
const jwt = require("jsonwebtoken");
const secret = "tetras-vi-key";
const User = require("../model/User");
const Post = require("../model/Post");
const fs = require('fs');

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
                        return res.status(400).json({ error: 'You are not admin' });
                    } else {
                        if (info.v === 1) {
                            const users = await User.find({ role: { $ne: 1 } });
                            res.json(users)
                        } else {
                            return res.status(400).json({ error: 'You are not admin or user' });
                        }
                    }
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
                    if (info.v === 1) {
                        const isAdmin = info.role === 1;
                        if (!isAdmin) {
                            return res.status(400).json('You are not admin');
                        }
                        const { id } = req.params;
                        const post = await Post.findById(id)
                        fs.unlinkSync(`./uploads/${post.cover}`)
                        await Post.findByIdAndDelete(id);
                        res.json("ok");
                    } else {
                        res.status(401).json({ error: "Unauthorized" });
                    }
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
                    if (info.v === 1) {
                        const isAdmin = info.role === 1;
                        if (!isAdmin) {
                            return res.status(400).json({error:'You are not admin'});
                        }
                        const { id } = req.params;
                        const posts = await Post.find({ author: id })
                        posts.map(elm => fs.unlinkSync(`./uploads/${elm.cover}`))
                        await User.findByIdAndDelete(id);
                        await Post.deleteMany({ author: id })
                        res.json("ok");
                    } else {
                        res.status(401).json({ error: "you are not admin or user" });
                    }
                } else {
                    res.status(401).json({ error: "Unauthorized" });
                }
            }
        })
    } else {
        res.json({ error: "Unauthorized" });
    }
})
adminRouter.put("/useredit/:id", async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                res.status(401).json({ error: "Unauthorized" });
            } else {
                if (info.isAuth) {
                    const isAdmin = info.role === 1;
                    if (!isAdmin) {
                        return res.status(400).json({ error: 'You are not admin' });
                    } else {
                        const verify = info.v === 1
                        if (verify) {
                            const { id } = req.params;
                            const user = await User.findById({ _id: id })
                            if (!user) {
                                res.json({ message: "user not found" })
                            } else {
                                const upd = await User.findByIdAndUpdate(id, { v: 1 })
                                res.json(upd)
                            }
                        } else {
                            return res.status(400).json({ error: "You are not user or admin" })
                        }
                    }
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