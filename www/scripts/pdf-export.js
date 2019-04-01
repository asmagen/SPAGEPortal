$(document).ready(function(){
  $(".pdf-export").click(function(){
    var pdf=new jsPDF({orientation:"landscape"});

    var v=graph.visible;
    graph.visible=false;
    update(true);
    graph.visible=v;
    var data=canvas.toDataURL("image/jpeg",1.0);
    pdf.addImage(data,"JPEG",0,0);

    if(graph.visible){
      pdf.addPage();
      var old={x:graph.x,y:graph.y};
      graph.x=-origin.x;
      graph.y=-origin.y;
      update(2);
      graph.x=old.x;
      graph.y=old.y;
      data=canvas.toDataURL("image/jpeg",1.0);
      pdf.addImage(data,"JPEG",0,0);
    }

    pdf.save("spage-export.pdf");
  });
});
