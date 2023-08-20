const express = require('express')
const router = new express.Router()
const {updateData} = require('../../db/update')
const {insertData, insertMany} = require('../../db/insert')
const {queryDataWhere} = require('../../db/query')
const {auth} = require('../../db/services/auth')
const {deleteData} = require('../../db/delete')

router.post('/addClass', auth, async(req, res) => {
  try {
    if(req.role!==0){
      throw new Error('您沒有該權限!!')
    }
    console.log(req.body)
    await insertData('class',req.body)
    res.status(201).send("Add Successfully")
  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
})

router.delete('/delClass', auth, async(req, res) => {
  try {
    if(req.role!==0){
      throw new Error('您沒有該權限!!')
    }
    console.log(req.body)
    await deleteData('testscore', `Clsid=${req.body.Clsid}`)
    await deleteData('studyclass', `Clsid=${req.body.Clsid}`)
    await deleteData('attentance', `Clsid=${req.body.Clsid}`)
    await deleteData('rollcall', `Clsid=${req.body.Clsid}`)
    await deleteData('class',`Clsid=${req.body.Clsid}`)
    res.status(200).send("Delete Successfully")
  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
})

router.post('/addToClass', auth, async (req, res)=>{
  try {
    if(req.role!==0){
      throw new Error('您沒有該權限!!')
    }
    console.log(req.body)
    // 確認學生id是否有誤
    let existList = []
    let notexist = []
    const queryData= await queryDataWhere('Stuid', 'student', `Stuid IN (${req.body.Stuid.join(",")})`)
    queryData.forEach((stuid)=>{existList.push(stuid.Stuid)})
    // console.log(existList)
    req.body.Stuid.forEach((stuid)=>{if(existList.indexOf(parseInt(stuid))<0){notexist.push(stuid)}})
    // console.log(notexist)
    let insertValues = ''
    existList.forEach((stuid,idx, arr)=>{
      if(idx+1===arr.length){
        insertValues+=`(${parseInt(req.body.Clsid)}, ${stuid})`
      }else{
        insertValues+=`(${parseInt(req.body.Clsid)}, ${stuid}),`
      }
    })
    console.log(insertValues)
    //-----------------------------------
    if(notexist.length>0){
      insertMany('studyclass',`${Object.keys(req.body).join(',')}`, insertValues)
      res.status(201).send(`Add Successfully, No student: ${notexist.join(',')}`)
      return
    }else{
      insertMany('studyclass',`${Object.keys(req.body).join(',')}`, insertValues)
      res.status(201).send("Add Successfully")
    }
  } catch (error) {
    res.status(400).send(error.message)
    console.log(error)
  }
})

router.get('/allClasses', auth, async(req, res) => {
  try {
    if(req.role!==0){
      throw new Error('您沒有該權限!!')
    }
    const response = await queryDataWhere("teacher.Name, class.*", "teacher, class", "class.Tid=teacher.Tid")
    res.status(200).send(response)
  } catch (error) {
    console.log(error.message)
    res.status(404).send(error.message)
  }
})

router.get('/class/:classId', auth, async(req, res) => {
  try {
    if(req.role!==0){
      throw new Error('您沒有該權限!!')
    }
    const response = await queryDataWhere("*", "class", `class.Clsid=${req.params.classId}`)
    // console.log(response)
    res.status(200).send(response)
  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
})

router.patch('/class', auth, async(req, res) => {
  try {
    if(req.role!==0){
      throw new Error('您沒有該權限!!')
    }
    const clsid = req.body.Clsid
    delete req.body.Clsid
    await updateData('class', req.body, `Clsid=${clsid}`)
    res.status(201).send("Update Successfully")
  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
})

module.exports = router;