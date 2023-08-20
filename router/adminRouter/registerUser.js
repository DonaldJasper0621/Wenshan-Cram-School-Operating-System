const express = require('express')
const router = new express.Router()
const {insertTr, insertStu} = require('../../db/insert')
const {updateStu} = require('../../db/update')
const {auth} = require('../../db/services/auth')

router.post('/delstudent', auth, async (req, res) => {
  console.log(req.body)
  try {
    console.log(req.role);
    if(req.role!==0){
      throw new Error('您沒有該權限!!!!')
    }
    await insertStu(req.body)
    res.status(201).send("Register Successfully")
  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
})

router.post('/teacher', auth, async(req, res) => {
  console.log(req.body)
  try {
    if(req.role!==0){
      throw new Error('您沒有該權限!!')
    }
    await insertTr(req.body)
    res.status(201).send("Register Successfully")
    res.statu
  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
})

module.exports = router;