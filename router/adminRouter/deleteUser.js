const express = require('express')
const router = new express.Router()
const {deleteData} = require('../../db/delete')
const {queryDataWhere} = require('../../db/query')
const {updateData} = require('../../db/update')
const {auth} = require('../../db/services/auth')

router.delete('/student', auth, async(req, res) => {
  console.log(req)
  try {
    if(req.role!==0){
      throw new Error('您沒有該權限!!')
    }
    console.log(req.body)
    const student = await queryDataWhere('Stuid', 'student', `Account="${req.body.Account}"`)
    console.log(student)
    await deleteData('testscore', `Stuid="${student[0].Stuid}"`)
    await deleteData('studyclass', `Stuid="${student[0].Stuid}"`)
    await deleteData('attentance', `Stuid="${student[0].Stuid}"`)

    await deleteData('student', `Account="${req.body.Account}"`);
    res.status(201).send("Delete Successfully")
  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
})

router.delete('/teacher', auth, async(req, res) => {
  try {
    if(req.role!==0){
      throw new Error('您沒有該權限!!')
    }
    await updateData('teacher', {Dismiss: `${new Date().toISOString()}`}, `Account="${req.body.Account}"`)
    res.status(201).send("Delete Successfully")
  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
})

module.exports = router;