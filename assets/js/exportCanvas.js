function exportCanvas (canvas) {
  canvas.toBlob(function(blob){
    var url = URL.createObjectURL(blob);
    console.log(blob);
    console.log(url); // this line should be here
    alert(url);
  },'image/jpeg');
}
