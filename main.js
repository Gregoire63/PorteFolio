import Map from 'ol/Map';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Icon, Style} from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import XYZ from 'ol/source/XYZ';
import {Attribution} from 'ol/control';

const isitech = fromLonLat([4.82323, 45.72811]);
const fac = fromLonLat([3.11360, 45.76073]);
const lycee = fromLonLat([3.11583, 45.88622]);
const nicolas = fromLonLat([3.08140, 45.77547]);
const modaal = fromLonLat([4.84511,45.75206]);
const flyArray = [lycee,fac,isitech,nicolas,modaal];
const iconFeatures = [new Feature(new Point(lycee)), new Feature(new Point(fac)), new Feature(new Point(isitech)), new Feature(new Point(nicolas)), new Feature(new Point(modaal))];
iconFeatures.forEach(iconFeature=>{
    iconFeature.set('style', createStyle("./assets/marker.png", undefined));
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
var yScrollIndex = 0
var bottomArrow = document.getElementById('bottomArrow')
const scrollEvent = (e) => {
  //map.updateSize()
  if(e.target.offsetWidth>800){
    if (e.target.scrollTop/e.target.offsetHeight > 0.99 ) {
      document.getElementById("nav-bar").style.top = "15px";
      bottomArrow.style.bottom="-50px";
    } else {
      document.getElementById("nav-bar").style.top = "-50px";
      bottomArrow.style.bottom="30px";
    }
  }
  else {
    document.getElementById("nav-bar").style.top = "0px";
    bottomArrow.style.bottom="-50px";
    document.getElementById('main').addEventListener('touchend', endTouchEvent);
    document.getElementById('main').addEventListener('touchstart', function(ev) {
      if(isFlying)
        ev.preventDefault();
    }, false);
    return
  }
  yScrollIndex = e.target.scrollTop/e.target.offsetHeight
  switch(true){
    case yScrollIndex<0.5:
      document.querySelector(".photo").style.marginRight="70vw";
      document.getElementById("information").style.opacity="0"
      break
    case (yScrollIndex<=1.5 && yScrollIndex>=0.5):
      gotToStart=false
      document.getElementById("information").style.opacity=`${yScrollIndex-.5>.5?1-Math.abs((1-yScrollIndex)*2):(yScrollIndex-.5)*2}`
      document.querySelector(".photo").style.marginRight=`${window.innerWidth*.6*(Math.abs(yScrollIndex-1))}px`;
      setMenuSelected('nav-home')
      break
    case (yScrollIndex < 3 && yScrollIndex > 1.5): 
      document.querySelector(".photo").style.marginRight="70vw";
      document.getElementById("information").style.opacity="0"
      if(gotToEnd || gotToStart) break
      document.getElementById('main').addEventListener('wheel', wheelEvent);
      document.getElementById('main').addEventListener('scroll', wheelEvent);
      document.getElementById('main').addEventListener('mousewheel', wheelEvent);
      xScrollIndex>2?setMenuSelected('nav-work'):setMenuSelected('nav-school')
      break
    case (yScrollIndex<4 && yScrollIndex>=3):
      setMenuSelected('nav-capacities')
      document.getElementById("capa_left").style.marginRight = `${window.innerWidth*.6*(Math.abs(yScrollIndex-3))}px`;
      gotToEnd=false
      break
  }
}
function removeScrollEvent(){
  document.getElementById('main').removeEventListener('wheel', wheelEvent);
  document.getElementById('main').removeEventListener('scroll', wheelEvent);
  document.getElementById('main').addEventListener('scroll', scrollEvent);
  document.getElementById('main').removeEventListener('mousewheel', wheelEvent);
}
var isScrolling = false

const endTouchEvent = async (e) => {
    setTimeout(()=>{
      yScrollIndex = Math.round(document.getElementById('main').scrollTop/e.view.innerHeight)
      switch(yScrollIndex){
        case 1:
          setMenuSelected('nav-home')
          break
        case 2:
          xScrollIndex>2?setMenuSelected('nav-work'):setMenuSelected('nav-school')
          break
        case 3:
          setMenuSelected('nav-capacities')
          break
      }
      
    },900)
    setTimeout(()=>{
      const xPos = Math.round(document.getElementById('x-scroll').scrollLeft/e.view.innerWidth)
      if(xPos!=xScrollIndex){
        xScrollIndex = xPos
        if(!isFlying)
          fly()
      }
    },700)
}

const wheelEvent = async (e) => {
  if((xScrollIndex<0 &&  e.deltaY<0) || (xScrollIndex>flyArray.length-1 && e.deltaY>0)){
    removeScrollEvent()
  }
  else {
    if(e.cancelable){
      e.preventDefault();
      e.stopPropagation();
    }
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    if(isScrolling || isFlying)return
    isScrolling = true
    if(xScrollIndex==-1) xScrollIndex=0
    if(xScrollIndex==flyArray.length) xScrollIndex=flyArray.length
    if(e.deltaY>0)
    {
      if(xScrollIndex<flyArray.length)xScrollIndex++
    }
    else if(xScrollIndex>=0)xScrollIndex--
    if(xScrollIndex>=0 && xScrollIndex<flyArray.length){
      cardItems[xScrollIndex].scrollIntoView({ 
        behavior: 'smooth'
      })
      setMenuSelected(menuItems[xScrollIndex<3?1:2].id)
      fly()
    }
    setTimeout(()=>{
      isScrolling=false
    },2000)
  }
}
document.getElementById('main').addEventListener('scroll', scrollEvent);
let menuItems = document.querySelectorAll("nav ul li a");
menuItems = new Array(...menuItems);
let activeMenu = 'nav-home'
let gotToEnd = false
let gotToStart = false
onClick('nav', async function (e) {
  var target = e.target || e.srcElement;
  switch (target.id) {
    case "nav-home":
      if(activeMenu!='nav-home')
        {
          xScrollIndex=0
          gotToStart=true
          removeScrollEvent()
          setMenuSelected('nav-home')
        }
      break;
    case "nav-school":
      if(activeMenu!='nav-school'){
        xScrollIndex = 0
        setMenuSelected('nav-school')
        if(Math.round(yScrollIndex)==2)fly()
      }
      break;
    case "nav-work":
      if(activeMenu!='nav-work')
      {
        xScrollIndex = 4
        setMenuSelected('nav-work')
        if(Math.round(yScrollIndex)==2)fly()
      }
      break;
    case "nav-capacities":
      if(activeMenu!='nav-capacities')
        {
          xScrollIndex = flyArray.length-1
          gotToEnd=true
          removeScrollEvent()
          setMenuSelected('nav-capacities')
        }
      break;
  }
  document.getElementById("nav").classList.toggle('mobile-menu')
  menuHamburger.classList.replace("fa-xmark","fa-bars")

});
//Menu phone
const menuHamburger = document.querySelector(".menu")
const navLinks = document.getElementById("nav")

menuHamburger.addEventListener('click',()=>{
  navLinks.classList.toggle('mobile-menu')
  if(menuHamburger.classList.contains("fa-bars")){
    menuHamburger.classList.replace("fa-bars","fa-xmark")
    bottomArrow.style.bottom="-50px";
  }
  else {
    menuHamburger.classList.replace("fa-xmark","fa-bars")
    bottomArrow.style.bottom="30px";
  }
})
onClick('bottomArrow', async function (e) {
  setMenuSelected('nav-home')
  document.getElementById('home').scrollIntoView({ 
    behavior: 'smooth'
  })
})

// Init Maps
var view
if(window.innerWidth>800)
  view = new View({
    center: [lycee[0]+window.innerWidth-300,lycee[1]],
    zoom: 15,
  });
else
  view = new View({
    center: [lycee[0],lycee[1]-900],
    zoom: 15,
  });
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
const mapUrl=[{name:"topo-v2", type:"png"},{name:"streets-v2", type:"png"},{name:"voyager-v2", type:"png"},{name:"hybrid", type:"jpg"},{name:"openstreetmap", type:"jpg"},{name:"bright-v2", type:"png"}]
const key = 'Kn44eQqFgvbj0mWj8k17';
const backgroundLayers = mapUrl.map(layer=> 
  {
    return new TileLayer({
      preload: Infinity,
      name: layer.name,
      visible: layer.name=="topo-v2"?true:false,
      source: new XYZ({
        attributions: attributions,
        url:
          `https://api.maptiler.com/maps/${layer.name}/{z}/{x}/{y}.${layer.type}?key=${key}`,
        maxZoom: 20,
      }),
    })
  }
)
const map = new Map({
  controls: [new Attribution({text: attributions})],
  layers: [
    ...backgroundLayers,
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

onClick('map-background', async function (e) {
  var target = e.target || e.srcElement;
  setBackground(target)
})
function setBackground(target){
  const name = target.id
  if(name=="hybrid")
    document.querySelector(".menuMap label").classList.add("white")
  else document.querySelector(".menuMap label").classList.remove("white")
  target.classList.add("selected");
  const menu = document.querySelectorAll(".menuMap .menuMap-item")
  menu.forEach(m=> m.id!=name?m.classList.remove("selected"):null)
  backgroundLayers.forEach(layer => {
    if (layer.get("name") == name){
      layer.setVisible(true)
    }
    else{ 
      layer.setVisible(false)
    }
  })
  setTimeout(()=>{document.querySelector(".menuMap-toggler").checked = 0},200)
}
// Catch click event 
function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
}
// Fly method
var isFlying = false
async function fly(up) {
  let layer = map.getLayers()
    .getArray()
    .find(e => e.get("name") == "marker")
    .getSource()
  layer.clear()
  layer.addFeature(iconFeatures[xScrollIndex])
  await sleep(10)
  flyTo([flyArray[xScrollIndex][0]+(window.innerWidth>800?+window.innerWidth-300:0),flyArray[xScrollIndex][1]-(window.innerWidth<=800?900:0)], function () {});
};
function flyTo(location, done) {
    const duration = 2000;
    const zoom = 15;
    let parts = 2;
    let called = false;
    isFlying = true;
    function callback(complete) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
        isFlying = false;
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

consoleText(["Web Developer", "Front End Developer", "Back End Developer", "Apps Developer"], 'text');

function consoleText(words, id) {
  var visible = true;
  var con = document.getElementById('console');
  var letterCount = 1;
  var x = 1;
  var waiting = false;
  var target = document.getElementById(id)
  window.setInterval(function() {
    if (letterCount === 0 && waiting === false) {
      waiting = true;
      target.innerHTML = words[0].substring(0, letterCount)
      window.setTimeout(function() {
        var usedWord = words.shift();
        words.push(usedWord);
        x = 1;
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
  }, 100)
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


const imgs = document.getElementById('imgs')
const img = document.querySelectorAll('#imgs img')
var hover = false

imgs.addEventListener('mouseover', function(e){
  hover = true
})
imgs.addEventListener('mouseout', function(e){
  hover = false
})
onClick('carrousel-arrow-left', async function (e) {
  idx--
  changeImage()
  resetInterval()
})
onClick('carrousel-arrow-right', async function (e) {
  idx++
  changeImage()
  resetInterval()
})
let idx = 0
let interval = setInterval(run, 8000);

function run() {
    idx++

    changeImage()
}

function changeImage() {
    if(idx > img.length -1) {
        idx = 0
    }else if(idx < 0) {
        idx = img.length -1
    }
    if(!hover)
      imgs.style.transform = `translateX(calc(${-idx} * 100%))`
}

function resetInterval() {
    clearInterval(interval)
    interval = setInterval(run, 8000)
}
