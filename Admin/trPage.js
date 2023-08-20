
$.ajaxSetup ({
  cache: false //關閉AJAX相應的快取
});
// NAV BAR導覽列處理---------------------------------------------------------------------
$("#classManageLink").click(() => {
  window.location.href = "./trPage.html"
})

$("#rollcallLink").click(() => {
  $(".adminPage").load('./components/trPage/rollCall/rollcall.html')
  localStorage.setItem('classId', '')
  localStorage.setItem('className', '')
})

$("#gradeLink").click(() => {
  $(".adminPage").load('./components/trPage/gradeOp/grade.html')
  localStorage.setItem('classId', '')
  localStorage.setItem('className', '')
})
