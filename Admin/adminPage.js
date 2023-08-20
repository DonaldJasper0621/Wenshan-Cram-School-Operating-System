// NAV BAR導覽列處理---------------------------------------------------------------------
$("#delUserLink").click(() => {
  $(".registerUser").hide();
  $(".maCourse").attr('hidden', true)
  $(".delUser").removeAttr('hidden');
})

$("#registerUserLink").click(() => {
  $(".registerUser").show();
  $(".maCourse").attr('hidden', true)
  $(".delUser").attr('hidden',true)
})

$("#manageCourseLink").click(() => {
  console.log("hide");
  $(".registerUser").hide();
  $(".delUser").attr('hidden', true)
  $(".maCourse").attr('hidden', false)
})

$('#adminLogoutLink').click(() => {
  window.location = './index.html'
  localStorage.clear()
})

// 註冊用戶處理--------------------------------------------------------------------------
$('#registerRoleSelectBtn').click(()=>{
  let selected = $('.registerRoleSelector').find("option:selected").text(); // 看選到哪個
  console.log(selected);
  if(selected === "Student"){
    $("#registerForm").load('./components/adminPage/registerUser/studentRegister.html')
  }
  else if(selected=="Teacher"){
    $("#registerForm").load('./components/adminPage/registerUser/trRegister.html')
  }
  else if(selected=="Parent"){
    $("#registerForm").load('./components/adminPage/registerUser/prRegister.html')
  }
})


// 刪除用戶處理-------------------------------------------------------------------------
$("#delUserBtn").click(() => {
  let selected = $(".delRoleSelector").find("option:selected").text();
  console.log(selected)
})

// 管理課程處裡-------------------------------------------------------------------------
$("#courseOpSelectBtn").click(() => {
  // let selected = $(".courseOpSelector").find("option:selected").text();
  let selected = $(".courseOpSelector").val();

  if(selected==='add'){
    $("#courseOpForm").load('./components/adminPage/courseOp/addCourse.html')
  }else if(selected==='delete'){
    $("#courseOpForm").load('./components/adminPage/courseOp/delCourse.html')
    console.log(selected)
  }else if(selected==='update'){
    $("#courseOpForm").load('./components/adminPage/courseOp/updateCourse.html')
    console.log(selected)
  }else if(selected==='showAll'){
    $("#courseOpForm").load('./components/adminPage/courseOp/showAll.html')
    console.log(selected)
  }else if(selected==='addToClass'){
    $("#courseOpForm").load('./components/adminPage/courseOp/addToClass.html')
    console.log(selected)
  }

})