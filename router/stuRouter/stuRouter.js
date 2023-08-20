const express = require('express')
const router = new express.Router()
const {updateData} = require('../../db/update')
const {insertData, insertMany} = require('../../db/insert')
const {queryDataWhere, queryDataGroupBy} = require('../../db/query')
const {auth} = require('../../db/services/auth')
const {deleteData} = require('../../db/delete');

router.get('/callingclass/:stuid', auth, async (req, res) => {
  try {
    const stuid = req.params.stuid
    // console.log(stuid)
    const classes = await queryDataWhere('teacher.Name, attentance.Clsid, class.ClassName, class.StartAt, class.EndAt, attentance.Rcid, attentance.AttenStatus, rollcall.Rollcalltype', 'attentance, rollcall, teacher, class', 
    `rollcall.State=1 AND attentance.Rcid=rollcall.Rcid AND Date(rollcall.callTime)="${new Date().toISOString().split('T')[0]}" AND attentance.Stuid=${stuid} AND class.Clsid=attentance.Clsid AND teacher.Tid=class.Tid`)
    // console.log(classes)
    res.status(200).send(classes)
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }
})

router.post('/responCall', auth, async(req, res) => {
  try {
    // console.log(req.body)
    // 0表示已點名
    // 2表示未點名，default value
    req.body.AttenStatus=0
    req.body.CheckIpAddr = req.socket.remoteAddress

    // rollcall 時間
    // const callTime = await queryDataWhere('callTime', 'rollcall', `Rcid=${req.body.Rcid}`)
    // const responseTime = req.body.responseTime
    // if(new Date(responseTime).getTime() - callTime[0].callTime.getTime() > 10000){
    //   req.body.AttenStatus=4
    // }

    // console.log(req.body)
    await updateData('attentance', req.body,`Stuid=${req.body.Stuid} AND Rcid=${req.body.Rcid}`)
    res.status(200).send("Got it")
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }
})

//獲得學生所有的課程
router.get('/studyClasses/:stuid', auth, async (req, res) => {
  const stuid = req.params.stuid
  // console.log(stuid)
  try {
    const studyClasses = await queryDataWhere('class.Clsid, class.ClassName', "studyclass, class", `studyclass.Stuid=${stuid} and studyclass.Clsid=class.Clsid`)
    // console.log(studyClasses)
    res.status(200).send(studyClasses)
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }
})

//獲取出席紀錄
router.get('/attentance',auth, async (req, res) => {
  const date = req.query.date;
  const clsid = req.query.clsid;
  const stuid = req.query.stuid;
  console.log(date);
  try {
    const condition = `attentance.Clsid=class.Clsid AND attentance.Stuid=student.Stuid AND attentance.Rcid=rollcall.Rcid AND attentance.AttenStatus=attentancestatus.Statusid AND rollcall.Rollcalltype=rollcalltype.Rctid ORDER BY rollcall.callTime DESC `;
    const cond1 = clsid ? `attentance.Clsid=${clsid} AND ` : "";
    const cond2 = stuid ? `attentance.Stuid=${stuid} AND ` : '';
    const cond3 = date ? `DATE(rollcall.callTime)="${date}" AND ` : "";
    console.log(cond3);
    const attRecord = await queryDataWhere(
      "class.ClassName, rollcalltype.Description as Rcdescription, student.Stuid, student.Name, rollcall.callTime, attentance.responseTime, rollcall.CallIp, attentance.CheckIpAddr, attentancestatus.Description",
      "class, student, attentance, rollcall, attentancestatus, rollcalltype",
      `${cond1 + cond2 + cond3 + condition}`
    );

    console.log(attRecord)
    res.status(200).send(attRecord);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
})

//獲取成績
router.get('/grade', auth, async(req, res) => {
  const date = req.query.date;
  const clsid = req.query.clsid;
  const stuid = req.query.stuid;
  try {
    const condition = `testscore.Stuid=${stuid} AND testscore.Stuid=student.Stuid AND testtype.Typeid=testrecord.TestType AND class.Clsid=testrecord.Clsid AND testscore.Testid=testrecord.Testid ORDER BY testrecord.TestDate DESC`
    const cond1 = clsid ?`class.Clsid=${clsid} AND `:'';
    const cond2 = date?`testrecord.TestDate="${date}" AND `:'';
    console.log(cond2)
    const gradeRecord = await queryDataWhere('class.ClassName, testtype.Description, student.Stuid, student.Name, testrecord.TestDate, testscore.Score',
    "testrecord, testtype, testscore, class, student",
    `${cond1 + cond2 + condition}`)

    console.log(gradeRecord)
    res.status(200).send(gradeRecord);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
})

module.exports = router;