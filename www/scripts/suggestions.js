$(window).resize(function(){
  $("#sugCon").width($("#searched").width());
  pos=$("#searched").offset();
  $("#sugCon").offset({
    left:pos.left,
    top:pos.top+pos.height
  });
});
$("#sugCon").width($("#searched").width());
var m=new MutationObserver(function(mutations){
  $(mutations[0].addedNodes).each(function(){
    if($(this).hasClass("suggestion")){
      $(this).click(function(){
        sugClicked($(this).text());
      });
    }
  });
});
$(window).ready(function(){
  m.observe($("#suggestions")[0],{childList:true});
});
function sugClicked(value){
    var searched=$("#searched");
    //console.log(searched);
    var values=searched.val().split(",");
    values[values.length-1]=value;
    var str=values[0];
    for(var a=1;a<values.length;a++){
      str+=","+values[a];
    }
    searched.val(str);
    Shiny.onInputChange("searched",str);
}
