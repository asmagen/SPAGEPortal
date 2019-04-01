function connectionFilter(){
	for(var a=0;a<nodes.length;a++){
		if(nodes[a].connections<=1 && !nodes[a].selected){
			for(var b=0;b<edges.length;b++){
				if(edges[b].start==a || edges[b].end==a){
					edges[b].remove=1;
					//break;
				}
			}
		}
	}
}
/*function colorFilter(color){
	for(var a=0;a<edges.length;a++){
		if(edges[a].color!=colors[color]){
			edges[a].remove=1;
		}
	}
}
function signFilter(sign){
  for(var a=0;a<edges.length;a++){
    if(edges[a].sign[0]!=sign){
      edges[a].remove=1;
    }
  }
}*/

function cleanAfterFilters(){
	for(var a=0;a<edges.length;a++){
		if(edges[a].remove!=undefined){
			if(nodes[edges[a].start].connections>0){
				nodes[edges[a].start].connections--;
			}
			if(nodes[edges[a].end].connections>0){
				nodes[edges[a].end].connections--;
			}
			edges.splice(a,1);
			a--;
		}
	}
	for(var a=0;a<nodes.length;a++){
		if(!nodes[a].selected && nodes[a].connections==0){
			for(var b=0;b<edges.length;b++){
				if(edges[b].start>a){
					edges[b].start--;
				}
				if(edges[b].end>a){
					edges[b].end--;
				}
			}
			nodes.splice(a,1);
			a--;
		}
	}
}

$(window).ready(function(){
	$(".dropdown button").attr("data-toggle","dropdown");
	window.fList=$(".dropdown .dropdown-menu");
	window.binsList=["+1","-1","+2","-2","+3","-3","+5","-5","+6","-6","+9","-9"];
	binsList.forEach(addToFList);
	getCheckedBins();
});
function addToFList(element,index,array){
	fList.append($("<li><input type=\"checkbox\" checked> "+element+" (bin filter)</input></li>"));
}

function getCheckedBins(){
	var list=new Array();
	fList.children().each(function(){
		list.push($(this).children().first().prop("checked"));
	});
	return list;
}
function applyBinFilter(){
	if($("#TS").prop("checked")){	//Target-Specific FDR
		var list=getCheckedBins();
		var string="";
		for(var a=0;a<list.length;a++){
			if(list[a]){
				string+=binsList[a]+",";
			}
		}
		if(string.length>0){
			string=string.substring(0,string.length-1);
		}
		Shiny.onInputChange("binsFilter",string);
	}else{
		populateNodes();
	}
}
