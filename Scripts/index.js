/** ENUMS **/
var RAND = {
  LEFT : {value: 0, name: "Small", code: "S"}, 
  RIGHT: {value: 1, name: "Medium", code: "M"}, 
  NORM : {value: 2, name: "Large", code: "L"}
};

/** VARS **/
var canvas, ctx;
var pixels;
var width, height;       //create stars
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


//index script
$(document).ready(function(){


  /** RACTIVE CONTROLS **/
  $.get( 'Scripts/template.html' ).then( function ( template ) {

    var ractive = new Ractive({
      el: '#template-container',

      template: template,

      data: { 
        playing : true,
        cover: true,
        random : RAND.LEFT,
        boost : 500,
        start : '0000FF',
        end   : '88FF00',
        rate  : 1
      }
    });


    canvas = document.getElementById('pixelMap');
               
    if (canvas.getContext)
    {
      ctx = canvas.getContext('2d');
      configureCanvas();
      configureColor(start, end);
      loop(ractive);
    }

    /** Ractive Responses to User Input **/
    ractive.on({
     togglePlay: function ( event ) {
        var n = ractive.get("current_script");
        if (n == 0) n = 1;
        else if (n == 1) n = 2
        else n = 0;

        ractive.set( 'current_script', n);
     },
     nextSong: function ( event ) {
          var n = ractive.get("current_playlist");
          var l = ractive.get('playlists').length;
          n += 1;
          if (n == l) {
            n = 0;
          }

          ractive.set( 'current_playlist', null ).then( function () {
          ractive.set( 'current_playlist', n );
        })
      },
      prevSong: function ( event ) {
          var n = ractive.get("current_playlist");
          n -= 1;
          if (n < 0) {
            var l = ractive.get('playlists').length;
            n = l - 1;
          }
          ractive.set( 'current_playlist', null ).then( function () {
          ractive.set( 'current_playlist', n );
        })
      },
      showProject: function ( event, which ) {
        ractive.set( 'current_project', null ).then( function () {
          ractive.set( 'current_project', which );
        })
      },
      next: function ( event ) {
          var n = ractive.get("current_project");
          var l = ractive.get('projects').length;
          n += 1;
          if (n == l) {
            n = 0;
          }

          ractive.set( 'current_project', null ).then( function () {
          ractive.set( 'current_project', n );
        })
      },
      prev: function ( event ) {
          var n = ractive.get("current_project");
          n -= 1;
          if (n < 0) {
            var l = ractive.get('projects').length;
            n = l - 1;
          }
          ractive.set( 'current_project', null ).then( function () {
          ractive.set( 'current_project', n );
        })
      }
    });
  });
});

//when pause increase rate, and playing to false
//when play, reset rate, and playing to true

/** FUNCTIONS **/
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
      var r;
      var openspots = [];
      if ((xx + 1 < width) && pixels[xx + 1][yy] == "EMPTY"){
          openspots.push(0);
      }
      if ((yy + 1 < height) && pixels[xx][yy + 1] == "EMPTY"){
          openspots.push(1);
      }
      if ((xx - 1 >= 0) && pixels[xx - 1][yy] == "EMPTY"){
          openspots.push(2);
      }
      if ((yy - 1 >= 0) && pixels[xx][yy - 1] == "EMPTY"){
          openspots.push(3);
      }


      if ( openspots.length > 0 ){
          r = openspots[Math.floor((Math.random() * openspots.length))];
       
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
          
          xposition = xx;
          yposition = yy;
          p.FromXX(xxx); //is this correct = pp.FromX();
          p.FromYY(yyy);
          return p;
      } 
      else 
      {
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
  } 
}


function nextColor()
{
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

function rgb(r, g, b) { return ["rgb(",r,",",g,",",b,")"].join(""); }

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
    console.log(cr, cg, cb);

    //shiftr, shiftg, shiftb
    shiftr = (er > sr) ? 1 : -1;
    shiftg = (eg > sg) ? 1 : -1;
    shiftb = (eb > sb) ? 1 : -1;
}

function randomColor()
{
    //start = parseInt(start, 16);
    //end   = parseInt(end, 16);
    //sr, sg, sb

    sr = Math.floor(Math.random() * 255);
    sg = Math.floor(Math.random() * 255);
    sb = Math.floor(Math.random() * 255);
    //cr, cg. cb
    cr = sr;
    cg = sg;
    cb = sb;
    //er, eb, eg
    er = Math.floor(Math.random() * 255);
    eg = Math.floor(Math.random() * 255);
    eb = Math.floor(Math.random() * 255);

    //shiftr, shiftg, shiftb
    shiftr = (er > sr) ? 1 : -1;
    shiftg = (eg > sg) ? 1 : -1;
    shiftb = (eb > sb) ? 1 : -1;
    console.log(cr, cg, cb);
}

function configureCanvas(){
  var h = $(window).height();
  var w = $(window).width();

  canvas.width = w;
  canvas.height = h;

  width = w;
  height = h;

  finish = width * height;
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

function loop(r){
                var timer = setTimeout(function(){
                    //if r is playing
                    if (r.get('playing')){ 
                      for(var i = 0; i < boost; i++)
                      {
                          paint();
                          count += 1;
                          if (count >= finish){
                              ctx.clearRect(0, 0, width, height);
                              randomColor();
                              //configureColor('43cea2', '000FFF');//'43cea2', '000FFF'

                              configureCanvas();
                              count = 1;
                              break;
                          }
                      }
                    }
                    loop();
                }, r.get('rate')); //ractive.get...
            }