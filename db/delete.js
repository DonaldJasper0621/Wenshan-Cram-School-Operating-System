const connection = require('./dbconnection')

const deleteData = async(tableName, condition) => {
  const res = await new Promise((resolve, reject) => {
    const query = `DELETE FROM ${tableName} WHERE ${condition}`
    connection.query(query, (err, results) => {
      if(err) reject(new Error(err.message));
      resolve(results)
    })
  })
  return res;
}



module.exports = {
  deleteData
}