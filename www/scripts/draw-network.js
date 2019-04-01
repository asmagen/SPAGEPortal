function drawCircle(x,y,radius,colors){
    c.strokeStyle="black";
    c.lineWidth=1;
    c.fillStyle=colors[0];
    c.beginPath();
    c.arc(x,y,radius,0,2*Math.PI,true);
    c.closePath();
    c.fill();
    c.stroke();
    for(var a=1;a<colors.length;a++){
	c.fillStyle=colors[a];
	c.beginPath();
	var rad=(radius/colors.length)*(colors.length-a)
	c.arc(x,y,rad,0,2*Math.PI,true);
	c.closePath();
	c.fill();
    }
    c.fillStyle="white";
    c.globalAlpha/=4;
    c.beginPath();
    var offset=radius*Math.cos(Math.PI/4)/2;
    c.arc(x-offset,y-offset,radius/2,0,2*Math.PI,true);
    c.closePath();
    c.fill();
    c.globalAlpha*=4;
}
function drawNodes(){
	c.font="10pt sans-serif";
	for(var a=0;a<nodes.length;a++){
		var node=nodes[a];
		drawCircle(node.x,node.y,node.radius,node.color);
		c.fillStyle="black";
		var delta=c.measureText(node.name).width/2;
		c.fillText(node.name,node.x-delta,node.y+5);
	}
}
function drawEdges(){
	c.font="10pt sans-serif";
	for(var a=0;a<edges.length;a++){
		var edge=edges[a];
		var startX=nodes[edge.start].x;
		var startY=nodes[edge.start].y;
		var endX=nodes[edge.end].x;
		var endY=nodes[edge.end].y;
		var theta=Math.atan2(endY-startY,endX-startX);
		startX+=(nodes[edge.start].radius+parseInt(edge.width))*Math.cos(theta);
		startY+=(nodes[edge.start].radius+parseInt(edge.width))*Math.sin(theta);
		theta+=Math.PI;
		endX+=nodes[edge.end].radius*Math.cos(theta);
		endY+=nodes[edge.end].radius*Math.sin(theta);
		edge.signPos=drawEdge(startX,startY,endX,endY,edge.color,edge.width,edge.sign);
	}
}
function drawEdge(startX,startY,endX,endY,color,width,sign){
	if(arguments.length==8){
		var theta=arguments[7];
	}else{
		var theta=Math.atan2(endY-startY,endX-startX)+Math.PI;
	}
  c.strokeStyle=color;
  c.lineWidth=width;
  c.beginPath();
	if(sign[0]=="-"){
		drawDotted(startX,startY,endX,endY,theta);
	}else{
  	c.moveTo(startX,startY)
  	c.lineTo(endX,endY)
	}
	c.stroke();
  c.closePath();
  drawArrow(startX,startY,width,color,theta+Math.PI);
  c.fillStyle="black";
  var signPos=[((endX-startX)/2)+startX,((endY-startY)/2)+startY];
  c.fillText(sign,signPos[0]-8,signPos[1]+4);
  return signPos;
}
function drawDotted(startX,startY,endX,endY,theta){
	const l=20;
	const ratio=0.4;
	var segs=Math.sqrt(Math.pow(startX-endX,2)+Math.pow(startY-endY,2))/l;
	var last=[startX,startY];
	while(segs>0){
		c.moveTo(last[0],last[1]);
		if(segs<1) c.lineTo(endX,endY);
    else{
			var deltaX=l*Math.cos(theta);
			var deltaY=l*Math.sin(theta);
			var end=[last[0]-deltaX,last[1]-deltaY];
			c.lineTo(end[0],end[1]);
			last=[end[0]-(deltaX*ratio),end[1]-(deltaY*ratio)];
		}
		segs-=1+ratio;
	}
}
function drawArrow(x,y,e,color,theta){
	c.fillStyle=color;
	c.translate(x,y);
	c.rotate(theta);
	c.beginPath();
	c.moveTo(-e,0);
	c.lineTo(0,e);
	c.lineTo(0,-e);
	c.lineTo(-e,0);
	c.fill();
	c.closePath();
	c.rotate(-theta);
	c.translate(-x,-y);
}
