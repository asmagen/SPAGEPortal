/*var legend={
  x:0,y:0,
  width:370,height:444,
  image:new Image(),
  visible:true,
  draw:function(){
    if(!legend.visible){
      return;
    }
    c.translate(legend.x,legend.y);
    c.drawImage(legend.image,0,0);

    c.fillStyle="black";
		c.strokeStyle="black";
		c.lineWidth=1;
		c.font="bold 15pt sans-serif";
		c.strokeRect(0,0,legend.width,legend.height);
		c.fillText("x",legend.width-20,20);

    c.translate(-legend.x,-legend.y);
  },
  setup:function(){
    legend.x=-origin.x+canvas.width-legend.width-40;
    legend.y=-origin.y;
    legend.visible=true;
  }
}
legend.image.src="legend.png";
function drawLegendButton(){
  var radius=20;
  c.translate(canvas.width-radius,radius);
  c.fillStyle="maroon";
  c.beginPath();
  c.arc(0,0,radius,0,2*Math.PI,true);
  c.fill();
  c.font="bold 15pt sans-serif";
  c.fillStyle="white";
  c.fillText("i",-4,8);
  c.translate(-canvas.width+radius,-radius);
}*/

$(document).ready(function(){
  console.log("Ready!");
  console.log($("#legendsmall"));
  $("#legendsmall").click(function(){
    console.log("Clicked!");
    $("body").append($("<div>")
      .attr("id","legend-big")
      .append($("<img>").attr("src","legend.png").addClass("legend"))
      .append($("<img>")
        .addClass("close-img")
        .attr("src","baseline-close-24px.svg")
        .click(function(){
          $("#legend-big").remove();
        })
      )
    )
  });
});
