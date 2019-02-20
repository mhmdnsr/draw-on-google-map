# draw-on-google-map
draw-on-google-map is a JavaScript library that enable you to draw on google maps. You can draw (Polygons, Markers and free hand style)

****Warning****
This library works only with **mouth click** due to google maps api does not not provide any touch events.

****_Install_**** 

**For npm**

`$ npm install --save draw-on-google-map`

**For browser**

You can download a minified version of the library from 'dist/draw-on-google-map.js' on github project: 

`https://github.com/mhmdnsr/draw-on-google-map`

****How to use?****

**_Pre-requests_**

- Google Maps API Key
- Drawing Library

-Initialize Google Map

**_Import It_**

After installing the library you can start use it like:

    var DrawOnGoogleMap = require('');

or 

    import DrawOnGoogleMap from ''

or

    <script src="path/to/library/draw-on-google-map.js"></script>

---

**_Initialize DrawOnGoogleMap_**

To start using the library you have to initialize it first.

    var draw = new DrawOnGoogleMap(map);

map: Google Maps instance

---

***API***

- _Hold Map To Start Draw:_

      draw.holdMap();

- _Release Map After Finishing Draw:_

      draw.releaseMap();

- _Clear All Drawn Art:_

      draw.clearAllArt();

- _Change Stroke Color:_

      draw.changeColor(color);

    _color (string)_

- _Change Stroke Weight:_

      draw.changeStrokeWeight(weight);
      
   _weight (number)_
   
---
      
- **_Brush Draw_**
            
      draw.brush
    - _Start Brush Draw:_
         
          draw.brush.startDraw();
         
    - _Stop Brush Draw:_
    
          draw.brush.stopDraw();
          
    - _Clear Brush Drawn Art:_

          draw.brush.clearArt();
          
---

- **_Polygon Draw_**
    
      draw.polygon
    - _Start Polygon Draw:_
    
          draw.polygon.startDraw();
         
    - _Stop Polygon Draw:_
    
          draw.polygon.stopDraw();
          
    - _Clear Polygon Draw Art:_
    
          draw.polygon.clearArt();
          
    - _Change Polygon Fill Color:_
        
          draw.polygon.changeFillColor(color);
          
        _color (string)_
              
    - _Change Polygon Fill Color Opacity:_
    
          draw.polygon.changeOpacity(opacity);
          
        _opacity (number)_
        
        From 0 to 1. 0 is transparent and 1 is fully visible

---
      
- **_Marker Draw_**
    
      draw.marker
    - _Start Marker Draw:_
    
          draw.marker.startDraw();
         
    - _Stop Marker Draw:_
    
          draw.marker.stopDraw();
          
    - _Clear Marker Draw Art:_
    
          draw.marker.clearArt();
          
    - _Change Marker Icon:_ 
    
          draw.marker.changeIcon(icon);
          
      _icon (string)_
      - default : Add Google Map default marker.
      - colorful : Custom marker with selected color.
      - Any Icon link
      
      
---

