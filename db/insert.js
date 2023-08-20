const e = require('express')
const connection = require('./dbconnection')

const parseObj = (data)=>{
  let column = ''
  let value = ''
  Object.keys(data).forEach((col, idx, arr) => {
    if((idx+1)===arr.length){
      column+=`${col}`
      if(typeof(Object.values(data)[idx])==='string'){
        value+=`"${Object.values(data)[idx]}"`
      }else{
        value+=`${Object.values(data)[idx]}`
      }
      // value+=`"${typeof(Object.values(data)[idx])==='string' ? Object.values(data)[idx]:''}"${typeof(Object.values(data)[idx])==='string'?'':Object.values(data)[idx]}`
    }else{
      column+=`${col},`
      if(typeof(Object.values(data)[idx])==='string'){
        value+=`"${Object.values(data)[idx]}",`
      }else{
        value+=`${Object.values(data)[idx]},`
      }
      // value+=`"${typeof(Object.values(data)[idx])==='string' ? Object.values(data)[idx]:''}"${typeof(Object.values(data)[idx])==='string'?'': Object.values(data)[idx]}, `
    }
  })
  console.log(value)
  return [column, value]
}

const insertTr = async(data)=>{
  const parseArr = parseObj(data)
  const res = await new Promise((resolve, reject)=>{
    const query = `INSERT INTO teacher(${parseArr[0]}, Entry) VALUES (${parseArr[1]}, CURRENT_TIMESTAMP)`;
    connection.query(query, (err, results)=>{
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  });
  return res;
}

const insertStu = async(data) => {
  const parseArr = parseObj(data)
  const res = await new Promise((resolve, reject)=>{
    const query = `INSERT INTO student(${parseArr[0]}) VALUES (${parseArr[1]})`;
    connection.query(query, (err, results)=>{
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  });
  return res;
}

const insertData = async(table, data) => {
  const parseArr = parseObj(data)
  const res = await new Promise((resolve, reject)=>{
    const query = `INSERT INTO ${table}(${parseArr[0]}) VALUES (${parseArr[1]});`;
    connection.query(query, (err, results)=>{
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  });
  return res;
}

const insertMany = async(table, columns, values) => {
  const res = await new Promise((resolve, reject)=>{
    const query = `INSERT INTO ${table}(${columns}) VALUES ${values}`;
    connection.query(query, (err, results)=>{
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  });
  return res;
}

module.exports = {
  insertTr,
  insertStu,
  insertData,
  insertMany
}