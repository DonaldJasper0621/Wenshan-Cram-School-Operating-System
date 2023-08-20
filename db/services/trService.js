const {queryData, queryDataWhere} = require('../query')
const {insertTr} = require('../insert')

class TrService{
  
  async getAllTr(){
    try {
      const res = await queryData('*', 'teachers')
      return res;
    } catch (e) {
      console.log(e.message)
    }
  }

  async getTrById(id){
    try {
      const res = await queryDataWhere('*', 'teachers', `Tid=${id}`)
      return res;
    } catch (e) {
      console.log(e.message)
    }
  }

  async getTrByName(name){
    try {
      const res = await queryDataWhere('*', 'teachers', `Name=${Name}`)
      return res;
    } catch (e) {
      console.log(e.message)
    }
  }

  
}

module.exports = TrService