(function(){

            var canvas, ctx;
            var resizeId;
            var MAX;
            var pixels;
            var width, height;       //create stars
            var rate = 100;
            var xposition, yposition;


            $(document).ready(function(){

                canvas = document.getElementById('pixelMap');
               
                if (canvas.getContext){
                    
                    ctx = canvas.getContext('2d');

                    configureCanvas();

                    // drawStars();

                    // canvas.addEventListener("mousemove", function(eventInfo) {
                    //     seek = true;
                    //     target = {x: eventInfo.offsetX || eventInfo.layerX, y:eventInfo.offsetY || eventInfo.layerY};
                    // });

                    // canvas.addEventListener("mouseup", function(eventInfo){
                    //     //may want to do more here ... EXPLODE
                    //     seek = false;
                    //     lagger = 150;
                    //     target = {x: eventInfo.offsetX || eventInfo.layerX, y:eventInfo.offsetY || eventInfo.layerY};
                    // });

                    // canvas.addEventListener("mouseout", function(eventInfo){
                    //     seek = false;
                    //     i = 2;
                    // });

                    // $(window).resize(function(){
                    //     clearTimeout(resizeId);
                    //     resizeId = setTimeout(onResizeDraw, 300);
                    // });
                    xposition = width  * Math.random();
                    yposition = height * Math.random();
                    loop();
                }
            });


            function Pixel(fromX, fromY) {
                this.fromX = fromX;
                this.fromY = fromY;

                this.Draw = function(color, x, y){
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, x + 1, y + 1);
                }
                this.From = function(){ return (this.fromX, this.fromY);}
            }



            function loop(){
                setTimeout(function(){
                    draw();
                    loop();
                }, 1000/rate);
            }


            function draw() {
                var p = new Pixel(xposition, yposition);
                var r = Math.floor((Math.random() * 4));
                var c = 0;

                while(c++ < 4){
                    switch(r){
                        case 0:
                            if (!pixels[xposition + 1][yposition]){
                                xposition += 1;
                                p.Draw(xposition, yposition, getColor(r));
                            }
                            break;
                        case 1:
                            if (!pixels[xposition][yposition + 1]){
                                yposition += 1;
                                p.Draw(xposition, yposition, getColor(r));
                            }
                            break;
                        case 2:
                            if (!pixels[xposition - 1][yposition]){
                                xposition -= 1;
                                p.Draw(xposition, yposition, getColor(r));
                            }
                            break;
                        case 3:
                            if (!pixels[xposition][yposition-1]){
                                yposition -= 1;
                                p.Draw(xposition, yposition, getColor(r));
                            }
                            break;
                    }
                    r = (r + 1) % 4;
                }
                // if (c == 4) {
                //     var back = backtrack();
                // }

            }

            function getColor(n){
                var colors    = [ "#ccff66", "#FFD700","#66ccff", "#ff6fcf", "#ff6666", "#F70000", "#D1FF36", "#7FFF00", "#72E6DA", "#1FE3C7", "#4DF8FF", "#0276FD", "#FF00FF"];
                n %= colors.length;
                return colors[n];
            }


            function configureCanvas(){
                var h = $(window).height();
                var w = $(window).width();

                canvas.width = w;
                canvas.height = h; 
                width = w;
                height = h;
                pixels = [];
                for ( var i = 0; i < width; i++) pixels[i] = Array(height);
                return pixels;
            }
        })(); 


// ublic static Color Lighten(Color inColor, double inAmount)
// {
//   return Color.FromArgb(
//     inColor.A,
//     (int) Math.Min(255, inColor.R + 255 * inAmount),
//     (int) Math.Min(255, inColor.G + 255 * inAmount),
//     (int) Math.Min(255, inColor.B + 255 * inAmount) );
// }
// */