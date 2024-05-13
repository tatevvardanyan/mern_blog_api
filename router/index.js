const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Post = require("../model/Post");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secret = "tetras-vi-key";
const UserDto = require("../dto/userDto")


router.post("/register", async (req, res) => {
    const { username, password, fullName } = req.body;
    try {
        if (username && password && fullName && password.length >= 5) {
            const pass = bcrypt.hashSync(password, salt)
            const userDoc = new User({
                fullName: fullName,
                username: username,
                password: pass,
            });
            await userDoc.save()
            const userDto = new UserDto({
                id: userDoc._id,
                fullName: userDoc.fullName,
                username: userDoc.username,
                role: userDoc.role,
                isAuth: false,
                v: 0
            })
            res.json({ userDto, mess: "successful" })
        }
        else {
            res.status(400).json({ error: "something went wrong!" })
        }
    } catch (error) {
        res.status(400).json({ error: "registration faild. Try again" })
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        if (userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                //logged in
                const userDto = new UserDto({
                    id: userDoc._id,
                    fullName: userDoc.fullName,
                    username: userDoc.username,
                    role: userDoc.role,
                    isAuth: true,
                    v: userDoc.v
                });
                if (userDto.v === 1) {
                    jwt.sign({ username, id: userDto.id, role: userDto.role, isAuth: userDto.isAuth, v: userDto.v }, secret, {}, (err, token) => {
                        if (err) throw err;
                        res.cookie('token', token).json({
                            id: userDto.id,
                            username,
                            role: userDto.role,
                            isAuth: userDto.isAuth,
                            v: userDto.v
                        })
                    });
                } else {
                    res.status(400).json({ mess: "you can't login" })//user not find
                }
            } else {
                res.status(400).json({ mess: 'wrong credentials' })//password
            }
        } else {
            res.status(400).json({ mess: 'something went wrong' })//username

        }

    } catch (error) {
        res.status(400).json({ error: "signin faild. Try again" })//everything

    }
});

router.get("/profile", async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) {
                res.status(401).json({ error: "Unauthorized" });
            } else {
                if (info.isAuth) {
                    if (info.v === 1) {
                        res.json(info)
                    } else {
                        res.status(401).json({ error: "Unauthorized" })
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

router.post("/logout", (req, res) => {
    res.cookie('token', '').json("ok")
});

router.get("/posts", async (req, res) => {
    const posts = await Post.find()
        .populate("author", 'username')
        .sort({ createdAt: -1 })
        .limit(20);
    res.json(posts)
});

router.get("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const indexDoc = await Post.findById(id).populate('author', 'username');
    res.json(indexDoc)

})

module.exports = router
