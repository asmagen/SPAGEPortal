var click={
  mouse:[0,0],
  moved:false,
  selected:null,
  formatClick:function(e){
  	e.x1=e.offsetX;
  	e.y1=e.offsetY;
    e.x1-=origin.x;
    e.y1-=origin.y;
    e.x1/=dimens.scale;
    e.y1/=dimens.scale;
  },
  mousedown:function(e){
  	click.formatClick(e);
    if(graph.visible && mouseIn(graph,e.x1*dimens.scale,e.y1*dimens.scale)){
  		click.selected=graph;
  	  return;
  	}
  	/*if(legend.visible && mouseIn(legend,e.x1*dimens.scale,e.y1*dimens.scale)){
  		click.selected=legend;
  	  return;
  	}*/
  	for(var a=nodes.length-1;a>=0;a--){
  		if(distance(nodes[a],e.x1,e.y1)<nodes[a].radius){
  			click.selected=nodes[a];
  			return;
  		}
  	}
    click.selected=origin;
  },
  mousemove:function(e){
    click.formatClick(e);
    if(click.selected!=null){
    	var factor=1;
    	if(click.selected==origin || click.selected==graph/* || click.selected==legend*/){
        factor=dimens.scale;
  	  }
    	click.selected.x+=(e.x1-click.mouse[0])*factor;
    	click.selected.y+=(e.y1-click.mouse[1])*factor;
    	click.moved=true;
    }
    click.mouse=[e.x1,e.y1];
    if(graph.visible){
      for(var a=0;a<graph.selectors.length;a++){
        Selector.statusColor(graph.selectors[a]);
      }
      var x=e.x1*dimens.scale;
    	var y=e.y1*dimens.scale;
    	var centerX=graph.x+(graph.selectors[0].xOff);
    	if(x>=centerX-Selector.radius && x<=centerX+Selector.radius){
        var centerY=graph.y+(graph.selectors[0].yOff);
    	  if(y>=centerY-Selector.radius && y<=centerY+(Selector.buffer*(graph.selectors.length-1))+Selector.radius){
          var index=Math.floor((y-(centerY-Selector.radius))/(Selector.buffer));
    		  graph.selectors[index].color="blue";
        }
  	  }
    }
  }
}

$(document).ready(function(){
  $("html,body").mouseup(function(e){click.selected=null})
  $("canvas")
    .mouseleave(function(e){click.selected=null})
    .mousedown(function(e){click.mousedown(e)})
    .mousemove(function(e){click.mousemove(e)})
});
