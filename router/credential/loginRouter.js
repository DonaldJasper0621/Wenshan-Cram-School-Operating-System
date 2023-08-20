const express = require('express');
const router = new express.Router();
const {queryDataWhere} = require('../../db/query')
const {createJWT} = require('../../db/services/createJWT')

router.post('/login', async (req, res) => {
  // console.log(req.body)
  try {
    const result = await queryDataWhere('*', `${req.body.roleSelect}`, `Account="${req.body.account}" AND Pass="${req.body.password}"`)
    // console.log(result.length)
    if(result.length===0){
      res.status(400).send("Account or Password Wrong. Otherwise, Wrong Role.")
      return
    }
    const token = await createJWT(result[0].Account, result[0].Role)
    console.log(token)
    res.status(200).send({...result[0], token})
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }
})

module.exports = router