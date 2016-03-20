(function(){

            var canvas, ctx;
            var resizeId;
            var MAX;
            var pixels;
            var width, height;       //create stars
            var rate = 1000000;
            var count = 0;
            var xposition, yposition;
            var ffx, ffy;
            var tx, ty;


            var boost = 500;

            var start = '0000FF';
            var end   = '88FF00';
            var sr, sg, sb, er, eg, eb, cr, cg, cb, shiftr, shiftg, shiftb;

            var count = 0;
            var finish;
            // #B3FFAB  - light blue
            //  #00223E - pink

            //Colour 1: #FFA17F
            //Colour 2: #00223E


//Endless River
//Colour 1: #43cea2
//Colour 2: #185a9d



            

            $(document).ready(function(){

                canvas = document.getElementById('pixelMap');
               
                if (canvas.getContext){
                    
                    ctx = canvas.getContext('2d');
                    tx = Math.floor((Math.random() * (width)));
                    ty = Math.floor((Math.random() * (height)));
                    configureCanvas();
                    configureColor(start, end);
                    finish = width * height;

                    // ctx.fillStyle = "#7FFF00";
                    // ctx.fillRect(0, 100, 221, 441);
                    // drawStars();

                    // canvas.addEventListener("mousemove", function(eventInfo) {

                    // });
                    // canvas.addEventListener("mouseup", function(eventInfo){
                    //     tx = eventInfo.offsetX || eventInfo.layerX;
                    //     ty = eventInfo.offsetY || eventInfo.layerY;

                    //     tx = Math.floor((Math.random() * (width - tx)) + tx);
                    //     ty = Math.floor((Math.random() * (height - ty)) + ty);
                    // });

                    // canvas.addEventListener("mouseout", function(eventInfo){
                    //     seek = false;
                    //     i = 2;
                    // });

                    // $(window).resize(function(){
                    //     clearTimeout(resizeId);
                    //     resizeId = setTimeout(onResizeDraw, 300);
                    // });

                    loop();
                }
            });


            function Pixel(fromX, fromY) {
                this.fromX = fromX;
                this.fromY = fromY;
                this.r = 0;
                this.g = 0;
                this.b = 0;

                this.Draw = function(x, y){
                    this.r = cr;
                    this.g = cg;
                    this.b = cb;
                    ctx.fillStyle = nextColor();
                    ctx.fillRect(x,y,1,1);
                }

                this.FromXX = function(x){ this.fromX = x;}
                this.FromYY = function(y){ this.fromY = y;}
                this.FromX =  function(){ return this.fromX;}
                this.FromY =  function(){ return this.fromY;}
                this.FromR =  function(){ return this.r;}
                this.FromG =  function(){ return this.g;}
                this.FromB =  function(){ return this.b;}
            }



            function loop(){
                var timer = setTimeout(function(){
                  
                    for(var i = 0; i < boost; i++)
                    {
                        paint();
                        count += 1;
                        if (count >= finish){
                            ctx.clearRect(0, 0, width, height);
                            configureCanvas();
                            count = 0;
                            break;
                        }
                    }

                    loop();
                }, 0);
            }


            function paint() {
                var p = new Pixel(xposition, yposition);
                //xposition = Math.floor(width  * Math.random());
                //yposition = Math.floor(height * Math.random());
                p = setValidLocation(p);
                pixels[xposition][yposition] = p;
                p.Draw(xposition, yposition);
            }

            function setValidLocation(p) {
                var xx = xposition;
                var yy = yposition;
                var xxx, yyy;
                var pp;

                while(true)
                {

                    pp = pixels[xx][yy];
                    
                    if(pp == "EMPTY")
                    {
                        //xposition = Math.floor(width  * Math.random());
                        //yposition = Math.floor(height * Math.random());
                        return;
                    }
                    var c = 0;
                    var r = Math.floor((Math.random() * 4));
                    //40 40 10 10
                    // var fx, fy;

                    // if (xx + 1 < tx){
                    //     fx = 0;
                    // } else {
                    //     fx = 2;
                    // }

                    // if (yy + 1 < ty){
                    //     fy = 1;
                    // } else {
                    //     fy = 3;
                    // }

                    // var r1 = Math.floor((Math.random() * 100));
                    // r = (r1 < 50) ? fx : -1;
                    // r = (r1 < 25) ? fx : fy;

                    // if (r == -1){
                    //     r =  Math.floor((Math.random() * 4));
                    // }
                    r = Math.floor((Math.random() * 4));
                    //40 40 10 10
                    while(c < 4)
                    {    
                        switch(r)
                        {
                            case 0:
                                if ((xx + 1 < width) && pixels[xx + 1][yy] == "EMPTY"){
                                    xxx = xx;
                                    yyy = yy;
                                    xx += 1;
                                    c = 9;
                                }
                                break;
                            case 1:
                                if ((yy + 1 < height) && pixels[xx][yy + 1] == "EMPTY"){
                                    xxx = xx;
                                    yyy = yy;
                                    yy += 1;
                                    c = 9;
                                    }
                                break;
                            case 2:
                                if ((xx - 1 >= 0) && pixels[xx - 1][yy] == "EMPTY"){
                                    xxx = xx;
                                    yyy = yy;
                                    xx -= 1;
                                    c = 9;
                                }
                                break;
                            case 3:
                                if ((yy - 1 >= 0) && pixels[xx][yy - 1] == "EMPTY"){
                                    xxx = xx;
                                    yyy = yy;
                                    yy -= 1;
                                    c = 9;
                               }
                               break;
                        }
                        c += 1;
                        r = (r + 1) % 4;
                    }
                        
                    if (c < 6)
                    { //no found location
                        xx = pp.FromX();
                        yy = pp.FromY();
                        cr = pp.FromR();
                        cb = pp.FromB();
                        cg = pp.FromG();
                        if (xx == ffx && yy == ffy)
                        {
                            xposition = Math.floor(width  * Math.random());
                            yposition = Math.floor(height * Math.random());
                            ffx = xposition;
                            ffy = yposition;
                            p.FromXX(ffx);
                            p.FromYY(ffy);
                            return p;
                            //ctx.clearRect(0, 0, width, height);
                            //count = 0;
                            //return configureCanvas();                   
                        }
                    } 
                    else 
                    {
                        xposition = xx;
                        yposition = yy;
                        p.FromXX(xxx); //is this correct = pp.FromX();
                        p.FromYY(yyy);
                        return p;
                    }
                } 
            }

            function nextColor(){
                //to start we'll one at a time
                if (cr != er)
                {
                    cr += shiftr;
                }
                else if (cg != eg) 
                {
                    cg += shiftg;
                }
                else if (cb != eb)
                {
                    cb += shiftb;                    
                }
                else
                {
                    cr = sr;
                    cg = sg;
                    cb = sb;
                }
                return rgb(cr, cg, cb);
            }

            function rgb(r, g, b){
                return ["rgb(",r,",",g,",",b,")"].join("");
            }

            function getColor(n){
                var colors    = [ "#ccff66", "#FFD700","#66ccff", "#ff6fcf", "#ff6666", "#F70000", "#D1FF36", "#7FFF00", "#72E6DA", "#1FE3C7", "#4DF8FF", "#0276FD", "#FF00FF"];
                n %= colors.length;
                return colors[n];
            }

            function configureColor(start, end)
            {
                start = parseInt(start, 16);
                end   = parseInt(end, 16);
                //sr, sg, sb
                sr = (start >> 16) & 0xFF;
                sg = (start >> 8)  & 0xFF;
                sb = (start)       & 0xFF;
                //cr, cg. cb
                cr = sr;
                cg = sg;
                cb = sb;
                //er, eb, eg
                er = (end >> 16) & 0xFF;
                eg = (end >> 8)  & 0xFF;
                eb = (end)       & 0xFF;

                //shiftr, shiftg, shiftb
                shiftr = (er > sr) ? 1 : -1;
                shiftg = (eg > sg) ? 1 : -1;
                shiftb = (eb > sb) ? 1 : -1;
            }


            function configureCanvas(){
                var h = $(window).height();
                var w = $(window).width();

                canvas.width = w;
                canvas.height = h;

                width = w;
                height = h;

                //width = canvas.width;
                //height = canvas.height;
                pixels = [];
                for ( var i = 0; i < width; i++) pixels[i] = Array(height);
                for ( var i = 0; i < width; i++){
                     for ( var j = 0; j < height; j++){
                        pixels[i][j] = "EMPTY";
                     }
                }

                /* getting things restarted */
                xposition = Math.floor(width  * Math.random());
                yposition = Math.floor(height * Math.random());
                ffx = xposition;
                ffy = yposition;
                var p = new Pixel(xposition, yposition);
                var c = 0;
                
                pixels[xposition][yposition] = p;
                p.Draw(xposition, yposition);

                return p;
            }
        })(); 
