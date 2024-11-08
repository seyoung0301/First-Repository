const asyncHandler = require("express-async-handler");
const dbConnect = require('../config/dbConnect');
const path = require("path"); // 정적인 파일

// @desc Get all contacts
// @route GET /contacts
const getAllContacts = asyncHandler(async (req, res) => { 
  // 전체 연락처 보기
  console.log('전체 연락처 보기');
  dbConnect.query('SELECT id, name, email, phone FROM Contacts', function(error, results, fields) {
    if (error) throw new Error("All Contacts not read");
    if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
      console.log(results);
      // res.render("getAll");  // 1차
      // res.render("getAll-2", { heading: "User List", users: results });  // 2차
      res.render("index", { heading: "User List", contacts: results });  // 2차
    } else {         
      console.log('연락처 없음');      
    }            
  });
});

// @desc Create a contact
// @route POST /contacts
const createContact = asyncHandler(async (req, res) => {
  // 새 연락처 추가하기
  console.log('새 연락처 추가하기');
  console.log(req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).send("필수값이 입력되지 않았습니다.");
  }

  dbConnect.query('INSERT INTO Contacts (name, email, phone) VALUES (?, ?, ?)', [name, email, phone], function(error, results) {
    if (error) throw new Error("Contact not created");
    console.log(results);
    // res.status(200).send("Create Contact");
    res.redirect("/contacts");
  });
});

// @desc Get contact
// @route GET /contacts/:id
const getContact = asyncHandler(async (req, res) => {
  // 특정 연락처 보기
  console.log('특정 연락처 보기');
  console.log(req.params.id);
  const id = req.params.id;

  dbConnect.query('SELECT id, name, email, phone FROM Contacts WHERE id = ?', [id], function(error, results) {
    if (error) throw new Error("Contact not read");
    if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
      console.log(results);
      // res.status(200).send("Read Contact");
      res.render("update", { contacts: results });
    } else {        
      console.log('연락처 없음');     
    }            
  });
});

// @desc Update contact
// @route PUT /contacts/:id
const updateContact = asyncHandler(async (req, res) => {
  // 특정 연락처 업데이트
  const id = req.params.id;
  const { name, email, phone } = req.body;

  dbConnect.query('UPDATE Contacts SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, id], function(error, results) {
    if (error) throw new Error("Contact not updated");
    console.log(results);
    // res.status(200).send("Update Contact");
    res.redirect("/contacts");
  });
});

// @desc Delete contact
// @route DELETE /contacts/:id
const deleteContact = asyncHandler(async (req, res) => {
  // 특정 연락처 삭제
  const id = req.params.id;
  const { name, email, phone } = req.body;

  dbConnect.query('DELETE FROM Contacts WHERE id = ?', [id], function(error, results) {
    if (error) throw new Error("Contact not deleted");
    console.log(results);
    // res.status(200).send("Delete Contact");
    res.redirect("/contacts");
  });
});

const addContactForm = (req, res) => {
  res.render("add"); 
};


module.exports = {
    getAllContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm
};