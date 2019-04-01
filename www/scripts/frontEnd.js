//startup
var canvas=document.getElementById("canvas");
var c=canvas.getContext("2d");

//engine support
var colors=['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc'];
var bins=["low-low","low-med","low-high","med-med","med-high","high-high"];
var nodes=Array();
var edges=Array();
var origin={x:0,y:0};
function mouseIn(obj,x,y){
  var h=obj.getHeight?obj.getHeight():obj.height;
  return (x>=obj.x && x<=obj.x+obj.width && y>=obj.y && y<=obj.y+h);
}

var last;
function clickCanvas(){
	var x=click.mouse[0];
	var y=click.mouse[1];
  if(click.moved){
		click.moved=false;
	  click.selected=null;
	  return;
	}
	if((x*dimens.scale)+origin.x>=canvas.width-40 && (y*dimens.scale)+origin.y<=40){
		legend.setup();
		return;
	}
  if(graph.visible && mouseIn(graph,x*dimens.scale,y*dimens.scale)){
		for(var a=0;a<graph.selectors.length;a++){
			var s=graph.selectors[a];
			if(s.color=="blue"){
		    s.status=!s.status;
		    Selector.statusColor(s);
		    Shiny.onInputChange("bins",Selector.getSelectors());
		    return;
			}
	  }
	  if(x*dimens.scale>graph.x+graph.width-20 && y*dimens.scale<graph.y+20){
			graph.hide();
	  }
	  return;
	}
	for(var a=nodes.length-1;a>=0;a--){
		var node=nodes[a];
		if(distance(node,x,y)<=node.radius){
			if(last!=node){
				last=node;
				graph.reset();
				Shiny.onInputChange("bins","111");
				Shiny.onInputChange("gene",node.name);
				Shiny.onInputChange("gene1","none");
				graph.setType("node","111");
			}
		  graph.setCoordinates(node.x,node.y,node.radius+2);
			return;
		}
	}
	for(var a=edges.length-1;a>=0;a--){
    var edge=edges[a];
		if(edgeClick(nodes[edge.start],nodes[edge.end],edge)){
			if(last!=edge){
				last=edge;
				graph.reset();
				setEdgeData(edge,nodes[edge.start].name,nodes[edge.end].name);
				graph.setType("edge",edge.getBins());
			}
			graph.setCoordinates(edge.signPos[0],edge.signPos[1],15);
			return;
		}
	}
  graph.hide();
}
function edgeClick(node,node1,edge){
	var x=click.mouse[0];
	var y=click.mouse[1];
	var width=edge.width;
	if((x>node.x)!=(x>node1.x) || (node.x==node1.x)){
		var m=(node.y-node1.y)/(node.x-node1.x);
		if(Math.abs(m)==Infinity){
      return (y>node.y)!=(y>node1.y) && Math.abs(x-node.x)<width;
		}else{
			var expectedY;
			if(node.x<node1.x) expectedY=(m*(x-node.x))+node.y;
			else expectedY=(m*(x-node1.x))+node1.y;
			var leniency=Math.abs(width/Math.cos(Math.atan(m)));
			if(Math.abs(y-expectedY)<leniency) return true;
		}
	}
	return false;
}
function setEdgeData(edge,gene,gene1){
	var i=colors.indexOf(edge.color);
	var addToTitle=": "+bins[i]+" ("+edge.sign+")(Confidence: "+edge.width+"/30)";
	Shiny.onInputChange("addToTitle",addToTitle);
	Shiny.onInputChange("bins",edge.getBins());
	Shiny.onInputChange("gene",gene);
	Shiny.onInputChange("gene1",gene1);
}
function distance(){
	function dist(x,y,x1,y1){
		return Math.sqrt(Math.pow(x-x1,2)+Math.pow(y-y1,2));
	}
	if(arguments.length==4) return dist(arguments[0],arguments[1],arguments[2],arguments[3]);
	if(arguments.length==3) return dist(arguments[0].x,arguments[0].y,arguments[1],arguments[2]);
	if(arguments.length==2) return dist(arguments[0].x,arguments[0].y,arguments[1].x,arguments[1].y);
}
function onUpload(){
	var file=document.getElementById("uploader").files[0];
  var reader=new FileReader();
  reader.onload=function(e){
		var contents=e.target.result;
		contents=contents.split("\n");
		var string=contents[0];
		for(var a=1;a<contents.length;a++){
	    if(contents[a].length>0) string+=","+contents[a];
		}
		document.getElementById("searched").value=string;
		Shiny.onInputChange("searched",string);
  }
  reader.readAsText(file);
}

//class definitions
function Node(name,role,selected){
	this.radius=15;
	this.name=name;
	this.x=0;
	this.y=0;
	this.connections=0;
  this.selected=JSON.parse(selected);
  if(typeof(role)=="object"){
  	this.color=[];
    for(var a=0;a<role.length;a++){
			this.color.push(getColor(role[a]));
    }
	}else this.color=[getColor(role)];
}
function Edge(color,width,start,end){
	this.color=color;
	this.width=Math.abs(Math.round(width));
	this.sign=width<0?"+":"-";
	var map=["1","2","3","5","6","9"];
	this.sign+=map[colors.indexOf(color)];
	this.start=start;
	this.end=end;
  this.signPos=[];
	this.getBins=function(){
		if(this.color==colors[0]) return "100000000";
		if(this.color==colors[1]) return "010000000";
		if(this.color==colors[2]) return "001000000";
		if(this.color==colors[3]) return "000010000";
		if(this.color==colors[4]) return "000001000";
		if(this.color==colors[5]) return "000000001";
	}
}
function Selector(graphType,index){
    Selector.buffer=14.5;
    Selector.radius=5;
    this.color="gray";
    this.status=false;
    this.xOff=10;
    this.yOff=360;
    this.yOff+=index*Selector.buffer;
    Selector.data={
      "edge":[
        {color:"blue",text:"low-low (1)"},
        {color:"purple",text:"low-med (2)"},
        {color:"red",text:"low-high (3)"},
        {color:"cyan",text:"med-low (4)"},
        {color:"green",text:"med-med (5)"},
        {color:"orange",text:"med-high (6)"},
        {color:"yellow",text:"high-low (7)"},
        {color:"pink",text:"high-med (8)"},
        {color:"brown",text:"high-high (9)"}
      ],
      "node":[
        {color:"red",text:"low"},
        {color:"blue",text:"med"},
        {color:"green",text:"high"}
      ]
    }
    this.data=Selector.data[graphType][index];
    Selector.statusColor=function(s){
      s.color=s.status?"gray":"white";
    }
    Selector.getSelectors=function(){
    	var value="";
    	for(var s=0;s<graph.selectors.length;s++){
        value+=graph.selectors[s].status?"1":"0";
  	  }
  	  return value;
    }
}
function getColor(role){
	return {
		"TSG":"#b3cde3",				// green
		"oncogene":"#fbb4ae",		// orange
		"BRCAdriver":"#ffffcc",	// ivory
		"Cancergene":"#fed9a6"	// red
	}[role] || "gray";
}
var nodeData="";
function populateNodes(){
	graph.hide();
	c.font="10pt sans-serif";
	while(nodes.length>0) nodes.splice(0,1);
	while(edges.length>0) edges.splice(0,1);
	var data=nodeData;
	for(var a=0;a<data.length;a++){
    var sub=data.substring(a,a+1);
		if(sub=="\"" || sub=="\n" || sub==" "){
			data=data.substring(0,a)+data.substring((a--)+1);
		}
	}
	if(data.substring(0,6)=="[1]NA,") return;
	information=data.split("[1]");
	information.splice(0,1);
	for(var a=0;a<information.length;a++){
		information[a]=information[a].split(",,");
		if(information[a][0]=="NULL") return;
		var add=true;
		for(var b=0;b<nodes.length;b++){
			if(nodes[b].name==information[a][0]){
				add=false;
        if(JSON.parse(information[a][2]) && !nodes[b].selected){
				  nodes[b].selected=true;
				  nodes.splice(b,1);
				  nodes.push(nodes[b]);
				}
				break;
			}
		}
		if(add==true){
			nodes.push(new Node(information[a][0],getRoles(information[a][1]),information[a][2]));
		}
	}
	for(var a=0;a<information.length;a++){
		for(var b=3;b<information[a].length;b+=4){
			establishConnection(information[a][0],information[a][b],information[a][b+1],information[a][b+2],information[a][b+3]);
		}
	}
	if(!$("#TS").prop("checked")){
		var list=getCheckedBins();
		for(var a=0;a<list.length;a++){
			if(!list[a]){
				for(var b=0;b<edges.length;b++){
					if(edges[b].sign==binsList[a]){
						edges[b].remove=1;
					}
				}
			}
		}
		cleanAfterFilters();
	}
	if($("#filter").prop("checked")){
		connectionFilter();
		cleanAfterFilters();
	}
  positionNodes();
	for(var a=0;a<nodes.length;a++){
		if(nodes[a].x-nodes[a].radius+origin.x<0){
			origin.x+=Math.abs(nodes[a].x-nodes[a].radius)-origin.x;
		}
	}
	dimens.zoomOut();
}

function getRoles(info){
  return info.replace(",","/").split("/");
}
function positionNodes(){
  var extreme=null;
  var centerX=0;
  var centerY=0;
  for(var a=0;a<nodes.length;a++){
    if(nodes[a].selected){
  	  var length=0;
      while(a+1+length<nodes.length && !nodes[a+1+length].selected) length++;
      var rad=Math.ceil((length*20)/Math.PI)+10;
  	  if(rad<150) rad=150;
      centerX+=rad+25;
  	  if(a==0) extreme={smallX:centerX,smallY:centerY,largeX:centerX,largeY:centerY};
      nodes[a].x=centerX;
      nodes[a].y=centerY;
      checkForExtreme(nodes[a],extreme);
      for(var b=0;b<length;b++){
    		var theta=Math.PI*2*b/length
    		nodes[b+a+1].x=Math.round(Math.cos(theta)*rad)+centerX;
    		nodes[b+a+1].y=Math.round(Math.sin(theta)*rad)+centerY;
    		checkForExtreme(nodes[b+a+1],extreme);
  	  }
  	  centerX+=rad+25;
    }
	  if(nodes[a].connections>0) nodes[a].radius+=Math.round(10*Math.log(nodes[a].connections));
  }
	if(nodes.length<=3){
		origin.x=200;
		origin.y=200;
		dimens.scale=2;
	}else dimens.setScale(
		extreme.smallX,extreme.smallY,extreme.largeX,extreme.largeY
	);
}
function checkForExtreme(node,extr){
  extr.largeX=(extr.largeX>node.x+node.radius)?extr.largeX:node.x+node.radius;
	extr.largeY=(extr.largeY>node.y+node.radius)?extr.largeY:node.y+node.radius;
	extr.smallX=(extr.smallX<node.x-node.radius)?extr.smallX:node.x-node.radius;
	extr.smallY=(extr.smallY<node.y-node.radius)?extr.smallY:node.y-node.radius;
}
function establishConnection(gene1,gene2,color,width,flip){
	var index1=-1;
	var index2=-1;
	for(var a=0;a<nodes.length;a++){
		if(nodes[a].name==gene1){
			index1=a;
			break;
		}
	}
	for(var a=0;a<nodes.length;a++){
		if(nodes[a].name==gene2){
			index2=a;
			break;
		}
	}
	if(index1>=0 && index2>=0){
		for(var a=0;a<edges.length;a++){
			if((edges[a].start==index1 && edges[a].end==index2) || (edges[a].start==index2 && edges[a].end==index1)) return;
		}
		if(flip==1) edges.push(new Edge(color,width,index1,index2));
		else if(flip==-1) edges.push(new Edge(color,width,index2,index1));
		nodes[index1].connections++;
		nodes[index2].connections++;
	}
}

function drawLoading(){
  c.fillStyle="maroon";
  c.font="bold 20pt sans-serif";
  c.fillText("Loading...",0,0);
}

var firstNetwork=true;
function update(ignore){
	if(!ignore) setTimeout(update,250);
	if(!graph.image) graph.image=$(".hide-data img")[0];
	var data=document.getElementById("nodeData").innerHTML;
	if(nodeData!=data){
		nodeData=data;
		$("#colorFilter").val("all");
		$("#filter").prop("checked",false);
		firstNetwork=false;
		populateNodes();
	}
  c.fillStyle="white";
  if(ignore) c.fillRect(0,0,canvas.width,canvas.height);
  else c.clearRect(0,0,canvas.width,canvas.height);
  if(firstNetwork && nodes.length==0){
		c.fillStyle="maroon";
		c.font="50px sans serif";
		c.fillText("Loading...",(canvas.width/2)-200,canvas.height/2);
	}else{
  	c.translate(origin.x,origin.y);
    if(ignore!=2){
    	c.scale(dimens.scale,dimens.scale);
    	drawEdges();
    	drawNodes();
    	c.scale(1/dimens.scale,1/dimens.scale);
    }
		graph.draw();
  	c.translate(-origin.x,-origin.y);
	}
}

$(document).ready(function(){
	$("#filter").click(function(){
		populateNodes();
	});
	$("#TS").prop("checked",true);
	$("#TS").click(function(){
    var c=document.getElementById("TS").checked;
    Shiny.onInputChange("view",c?"target-specific":"base");
	});
	$("#colorFilter,#signFilter").change(function(){
		populateNodes();
	});
	$("#canvas").height($(window).height()-$("#canvas").offset().top-100);

	window.graph=new Graph();
	update();
});
