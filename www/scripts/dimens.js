var dimens={
  scale:1,
  setScale:function(left,top,right,bottom){
    const sig=4;
    canvas.width=$("canvas").width();
    canvas.height=$("canvas").height();
    var xs=canvas.width/(right-left);
    var ys=canvas.height/(bottom-top);
    var s=(xs<ys)?xs:ys;
    dimens.scale=Math.round(s*sig)/sig;
    origin.x=-left*dimens.scale;
    origin.y=-top*dimens.scale;
  },
  zoomIn:function(){
    const limit=3.5;
    if(dimens.scale>=limit) return;
    dimens.scale*=1.5;
    if(dimens.scale>=limit) dimens.scale=limit;
  },
  zoomOut:function(){
    const limit=0.4;
    if(dimens.scale<=limit) return;
    dimens.scale/=1.5;
    if(dimens.scale<=limit) dimens.scale=limit;
  }
}

$(document).ready(function(){
  $(".zoomIn").click(function(){dimens.zoomIn()});
  $(".zoomOut").click(function(){dimens.zoomOut()});
});
