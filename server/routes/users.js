const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/key'); // mongoURI 가져오기
const { User } = require('../models/User'); // 유저모델 가져오기
const { auth } = require('../middleware/auth'); // auth 미들웨어 가져오기

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 오류 막기 위함
}).then(() => console.log('MongoDB connected...')).catch(err => console.log(err));

// 회원가입
router.post('/register', (req, res) => {
    userData = {
        name: req.body.name,
        id: req.body.id,
        email: req.body.email,
        password: req.body.password,
        address: req.body.roadAddress + " " + req.body.detailAddress,
        phone: req.body.phone,
    }

    // 회원가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어준다.

    // req.body는 JSON 형태

    const user = new User(userData); // 유저 인스턴스 생성

    // 정보들을 유저모델에 저장
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err }) // err시 json형태로 실패한 정보 전달.
        return res.status(200).json({
            success: true
        })
    });
});


// 로그인
router.post('/login', (req, res) => {

    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ id: req.body.id }, (err, userInfo) => {
        if (!userInfo) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인. (메소드 제작)
        userInfo.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

            // 비밀번호까지 맞다면 토큰을 생성하기. (메소드 제작)
            userInfo.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 쿠키에 토큰을 저장하고 client로 쿠키를 전달하여 로컬스토리지에 저장하도록 한다.
                res.cookie("jwt", user.token, { expires: new Date(user.tokenExp), httpOnly: true }).status(200).json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

// 인증
router.get('/auth', auth, (req, res) => { // auth라는 미들웨어 추가. 엔드포인트에서 request받고 callback전에 중간 처리.

    // 여기가지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
    res.status(200).json({
        _id: req.user._id, // auth 미들웨어 통해 가져왔기 때문에 사용 가능
        isAdmin: req.user.role === 0 ? false : true, // role : 0 -> 일반유저
        isAuth: true,
        id: req.user.id,
        address: req.user.address,
        phone: req.user.phone,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,

    });
});

// 로그아웃
router.get('/logout', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})

module.exports = router;
