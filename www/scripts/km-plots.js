function Graph(){
  //Graph.defaultSrc=1;
  this.visible=false;
  this.width=700;
  this.height=350;
  this.selectors=[];
  this.scale=1/window.devicePixelRatio;
  this.desWidth=Math.floor(this.width*3/5)-10;
  this.desX=(this.width-this.desWidth)-5;
  this.setCoordinates=function(focusX,focusY,minOffset){
    /*this.x=(focusX+minOffset)*dimens.scale;
    this.y=(focusY-(this.height/2))*dimens.scale;
    if(this.x+this.width+origin.x>canvas.width){
      this.x=((focusX-minOffset)*dimens.scale)-this.width;
    }
    if(this.y+origin.y<0){
      this.y=(focusY+minOffset)*dimens.scale;
    }else if(this.y+this.height+origin.y>canvas.height){
      this.y=((focusY-minOffset)*dimens.scale)-this.height;
    }*/
    this.y=-origin.y+($(canvas).height()-this.getHeight())/2;
    this.x=-origin.x+($(canvas).width()-this.width)/2;
    this.visible=true;
  }
  this.setType=function(type,bins){
    this.type=type;
    this.selectors=[];
    const s=(type=="edge")?9:3;
    for(var a=0;a<s;a++){
      var selector=new Selector(type,a);
      selector.status=(bins.substring(a,a+1)=="1");
      this.selectors.push(selector);
    }
  }
  this.hide=function(){
    //this.description=null;
    //this.image.src=null;
    this.visible=false;
  }
  this.getBotHeight=function(){
    var sh=this.selectors;
    var dh=this.desHeight || 0;
    sh=sh[sh.length-1].yOff+(Selector.radius*2)-this.height;
    return dh>sh?dh:sh;
  }
  this.getHeight=function(){
    return this.height+this.getBotHeight();
  }
  this.reset=function(){
    $(this.image).attr("src",null);
    this.description=null;
  }
  this.draw=function(){
  	if(this.visible){
  		c.translate(this.x,this.y);
      if(!$(this.image).attr("src")) drawLoading();
  	  else{
  			if(!this.description) this.formatDescription();
        c.lineWidth=1;
  			c.fillStyle="black";
  			c.strokeStyle="black";
  			c.font="bold 15pt sans-serif";
  			c.scale(this.scale,this.scale);
  			c.drawImage(this.image,0,0);
  			c.scale(1/this.scale,1/this.scale);
  			c.strokeRect(0,0,this.width,this.height);
  			c.fillText("x",this.width-20,20);
  			this.drawDescription();
  			this.drawSelectors(this.selectors);
  	  }
  	  c.translate(-this.x,-this.y);
  	}
  }
  this.drawSelectors=function(s){
    var r=Selector.radius;
  	for(var a=0;a<s.length;a++){
  		c.beginPath();
  		c.arc(s[a].xOff,s[a].yOff,r,0,Math.PI*2,true);
  		c.closePath();
  		c.fillStyle=s[a].color;
  		c.fill();
  		c.stroke();
      c.fillStyle=s[a].data.color;
      c.fillRect(s[a].xOff+(r*2),s[a].yOff-r,r*2,r*2);
      c.fillText(s[a].data.text,s[a].xOff+(r*5),s[a].yOff+r);
    }
  }
  this.drawDescription=function(){
  	c.fillStyle="white";
  	c.fillRect(0,this.height,this.width,this.getBotHeight());
  	c.font="10pt sans-serif";
  	c.fillStyle="black";
  	for(var a=0;a<this.description.length;a++){
  		c.fillText(this.description[a],this.desX,(15*(a+1))+this.height);
  	}
  	c.strokeRect(0,this.height,this.width,this.getBotHeight());
  }
  this.formatDescription=function(){
  	var des=$("#description").text().split(",,,");
  	des[0]=des[0].substring(5);
  	if(des.length==2) des[1]=des[1].substring(0,des[1].length-1);
  	for(var a=0;a<des.length;a++){
  		var b=1;
  		while(b<des[a].length){
  			if(c.measureText(des[a].substring(0,b)).width>this.desWidth){
  				while(des[a].substring(b,b+1)!=" ") b--;
  				des.splice(a+1,0,des[a].substring(b));
  				des[a]=des[a].substring(0,b);
  			}
  			b++;
  		}
  	}
    this.desHeight=(des.length*15)+5;
  	this.description=des;
  }
}
