import Map from 'ol/Map';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Icon, Style} from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import XYZ from 'ol/source/XYZ';

const isitech = fromLonLat([4.82323, 45.72811]);
const fac = fromLonLat([3.11360, 45.76073]);
const lycee = fromLonLat([3.11583, 45.88622]);
const nicolas = fromLonLat([3.08140, 45.77547]);
const modaal = fromLonLat([4.84511,45.75206]);
const flyArray = [lycee,fac,isitech,nicolas,modaal];
var indexFly = 1;
const iconFeatures = [new Feature(new Point(lycee)), new Feature(new Point(fac)), new Feature(new Point(isitech))];
iconFeatures.forEach(iconFeature=>{
    iconFeature.set('style', createStyle('assets/marker.png', undefined));
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Menu
function setMenuSelected(id){
  menuItems.forEach(e=>{
    if(e.id==id)
      e.classList.add("active");
    else e.classList.remove("active")
  })
  activeMenu=id
}
let cardItems = document.querySelectorAll(".card-map section");
cardItems = new Array(...cardItems);
var xScrollIndex = 0
const scrollEvent = (e) => {
  //map.updateSize()
  if(e.target.offsetWidth>800){
    if (e.target.scrollTop/e.target.offsetHeight > 0.99 ) {
      document.getElementById("nav-bar").style.top = "15px";
    } else {
      document.getElementById("nav-bar").style.top = "-50px";
    }
  }
  else document.getElementById("nav-bar").style.top = "0px";
  switch(e.target.scrollTop/e.target.offsetHeight){
    case 1:
      setMenuSelected('nav-home')
      break
    case 2:
      document.getElementById('main').addEventListener('wheel', wheelEvent);
      xScrollIndex>2?setMenuSelected('nav-work'):setMenuSelected('nav-school')
      break
    case 3:
      setMenuSelected('nav-capacities')
  }
}
var isScrolling = false
const wheelEvent = async (e) => {
  if((xScrollIndex==0 &&  e.deltaY<0) || (xScrollIndex==cardItems.length-1 && e.deltaY>0))
    document.getElementById('main').removeEventListener('wheel', wheelEvent);
  else {
    e.preventDefault();
    e.stopPropagation();
    if(isScrolling)return
    isScrolling = true
    cardItems[e.deltaY>0?xScrollIndex+1:xScrollIndex-1].scrollIntoView({ 
      behavior: 'smooth'
    })
    setMenuSelected(menuItems[xScrollIndex<3?1:2].id)
    setTimeout(()=>{
      isScrolling=false
      if(e.deltaY>0)
        xScrollIndex++
      else xScrollIndex--
    },500)
  }
}
document.getElementById('main').addEventListener('scroll', scrollEvent);
let menuItems = document.querySelectorAll("nav ul li a");
menuItems = new Array(...menuItems);
let activeMenu = 'nav-home'
onClick('nav', async function (e) {
  var target = e.target || e.srcElement;
  switch (target.id) {
    case "nav-home":
      if(activeMenu!='nav-home')
        setMenuSelected('nav-home')
      break;
    case "nav-school":
      if(activeMenu!='nav-school'){
        xScrollIndex = 0
        setMenuSelected('nav-school')
      }
      break;
    case "nav-work":
      if(activeMenu!='nav-work')
      {
        xScrollIndex = 3
        setMenuSelected('nav-work')
      }
      break;
    case "nav-capacities":
      if(activeMenu!='nav-capacities')
        setMenuSelected('nav-capacities')
      break;
  }
  document.getElementById("nav").classList.toggle('mobile-menu')
});
//Menu phone
document.getElementById('main').addEventListener('touchmove', function() {
  document.trigger('mousewheel');
});
const menuHamburger = document.querySelector(".menu")
const navLinks = document.getElementById("nav")

menuHamburger.addEventListener('click',()=>{
  navLinks.classList.toggle('mobile-menu')
})


// Init Maps
const view = new View({
    center: [lycee[0]+1450,lycee[1]],
    zoom: 15,
});
const key = 'Kn44eQqFgvbj0mWj8k17';
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
const map = new Map({
  controls: [],
  layers: [
    new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url:
          'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=' + key,
        maxZoom: 20,
      }),
    }),
    new VectorLayer({
        style: function (feature) {
          return feature.get('style');
        },
        name: "marker",
        source: new VectorSource({features: [iconFeatures[0]]}),
      }),
  ],
  target: 'map',
  view: view,
});
map.getInteractions().forEach(i => i.setActive(false))


// Catch click event 
function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
}
// Fly method
onClick('fly', async function () {
  let layer = map.getLayers()
    .getArray()
    .find(e => e.get("name") == "marker")
    .getSource()
  layer.clear()
  layer.addFeature(iconFeatures[indexFly])
  await sleep(10)
  flyTo([flyArray[indexFly][0]+800,flyArray[indexFly][1]], function () {});
  indexFly = indexFly==2?0:indexFly+1;
});
function flyTo(location, done) {
    const duration = 5000;
    const zoom = view.getZoom();
    let parts = 2;
    let called = false;
    function callback(complete) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
    view.animate(
      {
        center: location,
        duration: duration,
      },
      callback
    );
    view.animate(
      {
        zoom: 10,
        duration: duration / 2,
      },
      {
        zoom: zoom,
        duration: duration / 2,
      },
      callback
    );
  }

// Marker option
function createStyle(src, img) {
    return new Style({
      image: new Icon({
        anchor: [0.5, 0.96],
        crossOrigin: 'anonymous',
        src: src,
        img: img,
        imgSize: img ? [img.width, img.height] : undefined,
      }),
    });
}

consoleText(['Hello World !', 'Welcome'], 'text',['#5837D0','#7DE5ED']);

function consoleText(words, id, colors) {
  if (colors === undefined) colors = ['#fff'];
  var visible = true;
  var con = document.getElementById('console');
  var letterCount = 1;
  var x = 1;
  var waiting = false;
  var target = document.getElementById(id)
  target.setAttribute('style', 'color:' + colors[0])
  window.setInterval(function() {

    if (letterCount === 0 && waiting === false) {
      waiting = true;
      target.innerHTML = words[0].substring(0, letterCount)
      window.setTimeout(function() {
        var usedColor = colors.shift();
        colors.push(usedColor);
        var usedWord = words.shift();
        words.push(usedWord);
        x = 1;
        target.setAttribute('style', 'color:' + colors[0])
        letterCount += x;
        waiting = false;
      }, 1500)
    } else if (letterCount === words[0].length + 1 && waiting === false) {
      waiting = true;
      window.setTimeout(function() {
        x = -1;
        letterCount += x;
        waiting = false;
      }, 1500)
    } else if (waiting === false) {
      target.innerHTML = words[0].substring(0, letterCount)
      letterCount += x;
    }
  }, 120)
  window.setInterval(function() {
    if (visible === true) {
      con.className = 'console-underscore hidden'
      visible = false;

    } else {
      con.className = 'console-underscore'

      visible = true;
    }
  }, 400)
}