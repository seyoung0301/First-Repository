const asyncHandler = require("express-async-handler");
const dbConnect = require('../config/dbConnect');
const crypto = require('crypto'); // npm i crypto
const bcrypt = require("bcrypt");


//@desc Get login page
//@route GET /
const getLogin = (req, res) => {
  res.render("home");
};  

//@desc Login user
//@route POST /
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const pw = crypto.createHash('sha256').update(password).digest('hex');
  dbConnect.query('SELECT username FROM Users WHERE username = ? AND password = ?', [username, pw], function(error, results) {
    if (error) throw new Error("Users not read");
    if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
      console.log(results);
      res.status(200).send("User 있음");
    } else {        
      console.log('User 없음');     
    }            
  });
});

//@desc Register Page
//@route GET /register
const getRegister = (req, res) => {
  res.render("register");
};

//@desc Register user
//@route POST /register
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, password2 } = req.body;
  
  if (password !== password2) {
    return res.status(400).send("비밀번호가 일치하지 않습니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  dbConnect.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
    if (error) {
      console.error("DB 저장 오류:", error);
      return res.status(500).send("회원가입 실패");
    }

    res.status(201).json({ message: "회원가입 성공", user: { username } });
  });
});


module.exports = { getLogin, loginUser, getRegister, registerUser };
