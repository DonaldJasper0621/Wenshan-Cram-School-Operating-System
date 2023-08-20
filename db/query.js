const connection = require('./dbconnection')

const queryAllData = async(columns, table)=>{
  const res = await new Promise((resolve, reject)=>{
    const query = `SELECT ${columns} FROM ${table}`;
    connection.query(query, (err, results)=>{
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  });
  return res;
}

const queryDataWhere = async(columns, table, condition) => {
  const res = await new Promise((resolve, reject)=>{
    const query = `SELECT ${columns} FROM ${table} WHERE ${condition}`;
    connection.query(query, (err, results)=>{
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  });
  return res;
}

const queryDataGroupBy = async(columns, table, groupBy, having) => {
  const res = await new Promise((resolve, reject)=>{
    const query = `SELECT ${columns} FROM ${table} GROUP BY ${groupBy} HAVING ${having}`;
    connection.query(query, (err, results)=>{
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  });
  return res;
}

module.exports = {
  queryAllData,
  queryDataWhere,
  queryDataGroupBy
}