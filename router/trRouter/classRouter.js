const express = require("express");
const router = new express.Router();
const { updateData } = require("../../db/update");
const { insertData, insertMany } = require("../../db/insert");
const { queryDataWhere, queryDataGroupBy } = require("../../db/query");
const { auth } = require("../../db/services/auth");
const { deleteData } = require("../../db/delete");

// Get all classes of the teacher
router.get("/allClasses", auth, async (req, res) => {
  try {
    if (req.role !== 1) {
      throw new Error("您沒有該權限!!!!");
    }
    // console.log(req.userId)
    const queryData = await queryDataGroupBy(
      "Tid, class.Clsid, ClassName, COUNT(ClassName) as StuNum",
      "class LEFT JOIN studyclass ON class.Clsid=studyclass.Clsid",
      `class.Clsid`,
      `Tid=${req.userId}`
    );
    // console.log(queryData)
    res.status(200).send(queryData);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/allstudents/:classId", auth, async (req, res) => {
  try {
    if (req.role !== 1) {
      throw new Error("您沒有該權限!!!!");
    }
    const classId = req.params.classId;
    const students = await queryDataWhere(
      "student.Stuid, student.Name",
      "student, studyclass",
      `studyclass.Clsid=${classId} AND student.Stuid = studyclass.Stuid ORDER BY Stuid`
    );
    console.log(students);
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/submitGrade", auth, async (req, res) => {
  try {
    if (req.role !== 1) {
      throw new Error("您沒有該權限!!!!");
    }
    // console.log(req.body)
    await insertData("testrecord", req.body.graderecord);
    const testrecord = await queryDataWhere(
      "Testid",
      "testrecord",
      "Testid = LAST_INSERT_ID();"
    ); //獲取Testid,因為要插入testscore表

    let values = "";
    req.body.stuGrade.forEach((value, idx, arr) => {
      if (idx + 1 === arr.length) {
        values += `(${value.stuid}, ${testrecord[0].Testid}, ${value.testScore})`;
      } else {
        values += `(${value.stuid}, ${testrecord[0].Testid}, ${value.testScore}),`;
      }
    });
    console.log(testrecord);
    await insertMany("testscore", "Stuid, Testid, Score", values);

    res.status(200).send("Insert Successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// 成績查詢透過classid
router.get("/allGrades/:classid", auth, async (req, res) => {
  try {
    if (req.role !== 1) {
      throw new Error("您沒有該權限!!!!");
    }
    const response = await queryDataWhere(
      "testscore.Stuid, student.Name, testrecord.TestDate, testrecord.TestType, testrecord.TestName, testscore.Score",
      "testscore, testrecord, student",
      `testrecord.Clsid=${req.params.classid} AND testscore.Stuid=student.Stuid AND testscore.Testid=testrecord.Testid ORDER BY testrecord.Testid DESC, testscore.Stuid;`
    );
    // console.log(response)
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// 成績查詢，filter模式
router.post("/allGrades", auth, async (req, res) => {
  try {
    if (req.role !== 1) {
      throw new Error("您沒有該權限!!!!");
    }
    let filterStr = "";
    if (req.body.testDate) {
      filterStr += `AND testrecord.TestDate="${req.body.testDate}" `;
    }
    if (req.body.testType) {
      filterStr += `AND testrecord.TestType=${req.body.testType} `;
    }
    if (req.body.testName) {
      filterStr += `AND testrecord.TestName="${req.body.testName}" `;
    }
    console.log(filterStr);
    const response = await queryDataWhere(
      "testscore.Stuid, student.Name, testrecord.TestDate, testrecord.TestType, testrecord.TestName, testscore.Score",
      "testscore, testrecord, student",
      `testrecord.Clsid=${req.body.clsid} ${filterStr}AND testscore.Stuid=student.Stuid AND testscore.Testid=testrecord.Testid ORDER BY testrecord.Testid DESC, testscore.Stuid;`
    );
    // console.log(response)
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/rollcallbf", auth, async (req, res) => {
  try {
    if (req.role !== 1) {
      throw new Error("您沒有該權限!!!!");
    }
    req.body.CallIp = req.socket.remoteAddress;
    // 如果同一堂課同一天已經有上課點名就不能再點
    const done = await queryDataWhere(
      "*",
      "rollcall",
      `Clsid=${req.body.Clsid} AND Tid=${req.body.Tid} AND Rollcalltype=${
        req.body.RollcallType
      } AND Date(callTime)="${new Date().toISOString().split("T")[0]}"`
    );
    const done2 = await queryDataWhere(
      "*",
      "rollcall",
      `Clsid=${req.body.Clsid} AND Tid=${req.body.Tid} AND Rollcalltype=${
        req.body.RollcallType
      } AND Date(callTime)="${new Date().toISOString().split("T")[0]}"`
    );
    console.log(done[0]);
    if (
      (done[0] && req.body.RollcallType === 1) ||
      (done2[0] && req.body.RollcallType === 2)
    ) {
      console.log("done");
      res.status(200).send(done[0] || done2[0]);
      return;
    }
    console.log(req.body);

    //同一天尚未點名
    await insertData("rollcall", req.body);
    const rcRecord = await queryDataWhere(
      "*",
      "rollcall",
      "Rcid = LAST_INSERT_ID();"
    );
    const students = await queryDataWhere(
      "Stuid",
      "studyclass",
      `Clsid=${req.body.Clsid}`
    );
    console.log(students);
    students.forEach((stu) => {
      insertData("attentance", {
        Stuid: stu.Stuid,
        Clsid: rcRecord[0].Clsid,
        Rcid: rcRecord[0].Rcid,
        AttenStatus: 2,
      });
    });
    res.status(200).send(rcRecord[0]);
    // console.log(rcRecord)
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

//暫停點名
router.get("/stopCall/:rcid", auth, async (req, res) => {
  try {
    if (req.role !== 1) {
      throw new Error("您沒有該權限!!!!");
    }
    const rc = await updateData(
      "rollcall",
      { State: 0 },
      `Rcid=${req.params.rcid}`
    );
    res.status(200).send("done");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

//重啟點名
router.get("/reCall/:rcid", auth, async (req, res) => {
  try {
    if (req.role !== 1) {
      throw new Error("您沒有該權限!!!!");
    }
    const rc = await updateData(
      "rollcall",
      { State: 1 },
      `Rcid=${req.params.rcid}`
    );
    res.status(200).send("done");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// 獲得所有出席紀錄
router.get("/attentance", auth, async (req, res) => {
  // const rcid = req.query.rcid;
  const date = req.query.date;
  const clsid = req.query.clsid;
  console.log(date);
  try {
    const condition = `attentance.Clsid=class.Clsid AND attentance.Stuid=student.Stuid AND attentance.Rcid=rollcall.Rcid AND attentance.AttenStatus=attentancestatus.Statusid AND rollcall.Rollcalltype=rollcalltype.Rctid`;
    const cond1 = clsid ? `attentance.Clsid=${clsid} AND ` : "";
    // const cond2 = rcid ? `attentance.Rcid=${rcid} AND ` : '';
    const cond3 = date ? `DATE(rollcall.callTime)="${date}" AND ` : "";
    // console.log(cond3);
    const attRecord = await queryDataWhere(
      "class.ClassName, rollcalltype.Description as Rcdescription, student.Stuid, student.Name, rollcall.callTime, attentance.responseTime, rollcall.CallIp, attentance.CheckIpAddr, attentancestatus.Description",
      "class, student, attentance, rollcall, attentancestatus, rollcalltype",
      `${cond1 + cond3 + condition}`
    );

    // console.log(attRecord)
    res.status(200).send(attRecord);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
