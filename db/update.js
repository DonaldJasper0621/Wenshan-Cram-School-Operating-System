const connection = require('./dbconnection')

const parseObj = (data)=>{
  let column = []
  let value = []
  Object.keys(data).forEach((col, idx, arr) => {
      column.push(`${col}`)
      if(typeof(Object.values(data)[idx])==='string'){
        value.push(`"${Object.values(data)[idx]}"`)
      }else{
        value.push(`${Object.values(data)[idx]}`)
      }
  })
  return [column, value]
}

const dealUpdate = (arr1, arr2)=>{
  let update=""
  arr1.forEach((col, idx, arr)=>{
    if(idx+1==arr.length){
      update+=`${col}=${arr2[idx]}`
    }else{
      update+=`${col}=${arr2[idx]},`
    }
  })
  return update
}

const updateData = async(table, data, condition)=>{
  const parseArr = parseObj(data)
  const updateStr = dealUpdate(parseArr[0], parseArr[1])
  // console.log(updateStr)
  const res = await new Promise((resolve, reject)=>{
    const query = `UPDATE ${table} SET ${updateStr} WHERE ${condition}`;
    connection.query(query, (err, results)=>{
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  });

  return res;
}

const updateStu = async(columns, values, condition) => {
  const res = await new Promise((resolve, reject) => {
    let str = '';
    columns.forEach((column, idx)=>{
      if(typeof(values[idx])==='string'){
        values[idx] = `"${values[idx]}"`
      }
      if((idx+1)===columns.length){
        str+=`${column} = ${values[idx]}`
      }else{
        str+=`${column} = ${values[idx]},`
      }
    })
    const query = `UPDATE student SET ${str} WHERE ${condition}`
    connection.query(query, (err, results) => {
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  })
  return res;
}



module.exports = {
  updateStu,
  updateData
}