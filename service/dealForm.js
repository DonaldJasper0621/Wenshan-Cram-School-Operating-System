const dealForm = async(method, url, formId, auth=false, obj=null, Global=null)=>{
  const fd = new FormData(document.getElementById(formId));
  let fdData = Object.fromEntries(fd)
  let header = null

  // 針對addToClassForm有多個同名的input做處裡
  if(formId === "addToClassForm"){
    fdData.Stuid = fd.getAll('Stuid')
  }

  if(obj!==null){
    fdData = {...fdData, ...obj}
  }
  console.log("Form Data: ", fdData)

  if(auth){
    header={ 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer '+localStorage.getItem('token') 
    }
  }else{
    header = { 
      'Content-Type': 'application/json' 
    }
  }

  let responseData = await fetch(url,{
    method: method,
    body: JSON.stringify(fdData),
    headers: header,
  }).then(async (res) => {
    if(res.status===400){
      const response = await res.text();
      $('.message').text(response)
      // console.log(response);
    }else{
      $('.message').text('')
      const response = await res.text();
      console.log("Return Data: ", response)
      if(!(formId==='loginForm')){
        alert(response);
        return response
      }
      // 清空全部表單
      $('#'+formId)[0].reset();
      if(formId==='loginForm'){
        const loginData = await JSON.parse(response);
        return loginData
      }
    }
  })
  console.log(responseData);
  return responseData
}

function checkForm(formId){
  const fd = new FormData(document.getElementById(formId));
  const fdData = Object.fromEntries(fd)
  console.log(fdData);
  if(fdData.Pass==='' || fdData.Account===''){
    return false
  }
  return true
}