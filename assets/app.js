/* Astro Night Planner 1.0 – stabile PWA-Fassung mit lokalen IndexedDB-Profilen */
'use strict';

const BUILD = Object.freeze(window.ANP_BUILD || {environment:'prod', appVersion:'1.0.0', release:'1.0', databaseName:'astro-night-planner-prod-v1', documentTitle:'Astro Night Planner 1.0'});
const ENV = BUILD.environment === 'test' ? 'test' : 'prod';
const APP_VERSION = BUILD.appVersion || '1.0.0';
const RELEASE = BUILD.release || '1.0';
const DB_NAME = BUILD.databaseName || `astro-night-planner-${ENV}-v1`;
const DB_VERSION = 1;
const LOCAL_CATALOG_URL = 'assets/catalog.generated.json';
const REMOTE_CATALOG_URL = 'https://raw.githubusercontent.com/deepskybackyard-AC/Astro-Night-Planner/refs/heads/main/src/data/catalog.generated.json';
const app = document.getElementById('app');
const importInput = document.getElementById('fileImport');
const deepClone = value => JSON.parse(JSON.stringify(value));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const WIND_PROFILES = {
  travel: { name: 'Leichtes Reisesetup', windGreen: 7, windYellow: 14, gustGreen: 11, gustYellow: 22 },
  normal: { name: 'Normales Setup', windGreen: 11, windYellow: 22, gustGreen: 18, gustYellow: 32 },
  robust: { name: 'Robuste Säule/Montierung', windGreen: 18, windYellow: 32, gustGreen: 29, gustYellow: 47 },
};
const WEATHER_MODEL_CONFIG = Object.freeze({
  icon: { name:'DWD ICON', model:'icon_seamless', defaultWeight:40 },
  ecmwf: { name:'ECMWF IFS', model:'ecmwf_ifs025', defaultWeight:40 },
  gfs: { name:'NOAA GFS', model:'gfs_seamless', defaultWeight:20 },
});
const WEATHER_VIEW_OPTIONS = [
  ['consensus','Modellkonsens'],
  ['icon','DWD ICON'],
  ['ecmwf','ECMWF IFS'],
  ['gfs','NOAA GFS'],
];
const DISPLAY_COLUMNS = [
  ['score','Bewertung'],['name','Objekt / Typ / Katalog'],['maxAltitude','Maximalhöhe'],
  ['visibleHours','Sichtbarkeitsdauer'],['meridian','Meridian'],['framing','Framing'],['miniChart','Mini-Höhenprofil'],
  ['bestTime','Beste Zeit'],['moonDistance','Mondabstand'],['weather','Wetterwert'],['size','Objektgröße'],['magnitude','Magnitude'],['filters','Filterempfehlung']
];
const DISPLAY_PROFILES = {
  compact: { name:'Kompakt', pageSize:20, columns:['score','name','maxAltitude','visibleHours','miniChart'] },
  standard: { name:'Standard', pageSize:20, columns:['score','name','maxAltitude','visibleHours','meridian','framing','miniChart'] },
  detailed: { name:'Detailliert', pageSize:20, columns:DISPLAY_COLUMNS.map(x=>x[0]) },
};

function standardProfile(){
  return {
    id:'standard', name:'Standard', schemaVersion:2, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(),
    equipment:{
      telescopes:[{id:'scope-askar200',name:'Askar 200 mm',focalLength:200,aperture:50}], selectedTelescopeId:'scope-askar200',
      cameras:[{id:'cam-qhy268m',name:'QHY268M',sensorWidth:23.45,sensorHeight:15.7,pixelSize:3.76}], selectedCameraId:'cam-qhy268m'
    },
    central:{
      windUnit:'kmh', activeWindProfile:'normal', windProfiles:deepClone(WIND_PROFILES),
      dew:{green:5,yellow:2}, jet:{green:36,yellow:72},
      weatherModels:{weights:{icon:40,ecmwf:40,gfs:20},defaultView:'consensus'},
      weights:{clouds:30,transparency:15,seeing:10,wind:10,dew:10,moon:10,altitude:10,duration:5},
      defaultPlanningWindow:'nautical', defaultLocationId:'loc-tuebingen', gpsBehavior:'last',
      listDisplay:{activeProfile:'standard',profiles:deepClone(DISPLAY_PROFILES)},
      objectSizeVisible:false, frameVisible:true, meteoblueCollapsed:true,
      detailPanels:{altitudeCollapsed:true,horizonCollapsed:true},
      collapsed:{weather:false,meteoblue:true,filters:false,framing:false},
      persistentStorageRequested:false
    },
    locations:[{id:'loc-tuebingen',name:'Tübingen',latitude:48.5216,longitude:9.0576,elevation:350,timezone:'Europe/Berlin',isDefault:true,
      horizon:[0,0,0,0,0,0,0,0],obstacles:[]}], selectedLocationId:'loc-tuebingen',
    planning:{dateKey:'',planningWindow:'nautical',temporaryWindProfile:null,temporaryDisplayProfile:null,temporaryWeatherView:null,
      search:'',catalogs:['Messier','NGC','IC','Sh2','Abell','Zusatzkatalog'],types:[],maxMagnitude:16,minAltitude:25,minVisibleHours:1.5,minMoonDistance:25,
      minSize:0,maxSize:1200,onlyFits:false,page:1,pageSize:20,selectedObjectId:'M31',detailsOpen:false,objectRotation:0,frameRotation:0,timeFraction:.5},
    ui:{mainTab:'plan',settingsTab:'equipment',scroll:{plan:0,settings:0}}
  };
}

const BUILTIN_OBJECTS = [
 ['M31','Andromedagalaxie',['NGC 224'],'Galaxie',0.712,41.269,3.44,190,60,'Andromeda',['L','RGB'],['Messier','NGC'],35],
 ['M33','Dreiecksnebel',['NGC 598'],'Galaxie',1.564,30.66,5.72,70.8,41.7,'Triangulum',['L','RGB','Ha'],['Messier','NGC'],23],
 ['M42','Orionnebel',['NGC 1976'],'Emissionsnebel',5.588,-5.391,4,85,60,'Orion',['Ha','OIII','RGB'],['Messier','NGC'],0],
 ['M45','Plejaden',[],'Offener Sternhaufen',3.792,24.117,1.6,110,110,'Taurus',['RGB','L'],['Messier'],0],
 ['M1','Krebsnebel',['NGC 1952'],'Supernovaüberrest',5.575,22.014,8.4,7,5,'Taurus',['Ha','OIII','RGB'],['Messier','NGC'],0],
 ['M13','Herkuleshaufen',['NGC 6205'],'Kugelsternhaufen',16.695,36.461,5.8,20,20,'Hercules',['L','RGB'],['Messier','NGC'],0],
 ['M92','Kugelsternhaufen M92',['NGC 6341'],'Kugelsternhaufen',17.285,43.136,6.4,14,14,'Hercules',['L','RGB'],['Messier','NGC'],0],
 ['M51','Whirlpool-Galaxie',['NGC 5194'],'Galaxie',13.498,47.195,8.4,11.2,6.9,'Canes Venatici',['L','RGB','Ha'],['Messier','NGC'],0],
 ['M81','Bodes Galaxie',['NGC 3031'],'Galaxie',9.926,69.065,6.9,26.9,14.1,'Ursa Major',['L','RGB','Ha'],['Messier','NGC'],157],
 ['M82','Zigarrengalaxie',['NGC 3034'],'Galaxie',9.932,69.679,8.4,11.2,4.3,'Ursa Major',['L','RGB','Ha'],['Messier','NGC'],65],
 ['M101','Feuerradgalaxie',['NGC 5457'],'Galaxie',14.053,54.349,7.9,28.8,26.9,'Ursa Major',['L','RGB','Ha'],['Messier','NGC'],39],
 ['M104','Sombrerogalaxie',['NGC 4594'],'Galaxie',12.667,-11.623,8,8.7,3.5,'Virgo',['L','RGB'],['Messier','NGC'],90],
 ['M27','Hantelnebel',['NGC 6853'],'Planetarischer Nebel',19.993,22.721,7.4,8,5.7,'Vulpecula',['OIII','Ha','RGB'],['Messier','NGC'],0],
 ['M57','Ringnebel',['NGC 6720'],'Planetarischer Nebel',18.893,33.03,8.8,1.4,1,'Lyra',['OIII','Ha','RGB'],['Messier','NGC'],0],
 ['M8','Lagunenebel',['NGC 6523'],'Emissionsnebel',18.063,-24.386,6,90,40,'Sagittarius',['Ha','OIII','RGB'],['Messier','NGC'],0],
 ['M16','Adlernebel',['NGC 6611'],'Sternhaufen mit Nebel',18.314,-13.806,6.4,35,28,'Serpens',['Ha','OIII','SII','RGB'],['Messier','NGC'],0],
 ['M17','Omeganebel',['NGC 6618'],'Emissionsnebel',18.347,-16.171,6,46,37,'Sagittarius',['Ha','OIII','SII','RGB'],['Messier','NGC'],0],
 ['M20','Trifidnebel',['NGC 6514'],'Sternhaufen mit Nebel',18.043,-23.029,6.3,28,28,'Sagittarius',['Ha','OIII','RGB'],['Messier','NGC'],0],
 ['M63','Sonnenblumengalaxie',['NGC 5055'],'Galaxie',13.264,42.029,8.6,12.6,7.2,'Canes Venatici',['L','RGB','Ha'],['Messier','NGC'],105],
 ['M64','Schwarzes Auge',['NGC 4826'],'Galaxie',12.945,21.683,8.5,10,5.4,'Coma Berenices',['L','RGB'],['Messier','NGC'],115],
 ['M65','Galaxie M65',['NGC 3623'],'Galaxie',11.316,13.093,9.3,8.7,2.5,'Leo',['L','RGB'],['Messier','NGC'],174],
 ['M66','Galaxie M66',['NGC 3627'],'Galaxie',11.338,12.991,8.9,9.1,4.2,'Leo',['L','RGB','Ha'],['Messier','NGC'],173],
 ['M97','Eulennebel',['NGC 3587'],'Planetarischer Nebel',11.247,55.019,9.9,3.4,3.3,'Ursa Major',['OIII','Ha','RGB'],['Messier','NGC'],0],
 ['NGC 7000','Nordamerikanebel',[],'Emissionsnebel',20.98,44.33,4,120,100,'Cygnus',['Ha','OIII','SII'],['NGC'],0],
 ['IC 5070','Pelikannebel',[],'Emissionsnebel',20.85,44.33,8,80,70,'Cygnus',['Ha','OIII','SII'],['IC'],0],
 ['NGC 6960','Westlicher Schleiernebel',['Hexenhandnebel'],'Supernovaüberrest',20.758,30.72,7,70,6,'Cygnus',['OIII','Ha','RGB'],['NGC'],0],
 ['NGC 6992','Östlicher Schleiernebel',[],'Supernovaüberrest',20.94,31.72,7,60,8,'Cygnus',['OIII','Ha','RGB'],['NGC'],0],
 ['IC 1805','Herznebel',[],'Emissionsnebel',2.55,61.45,6.5,150,150,'Cassiopeia',['Ha','OIII','SII'],['IC'],0],
 ['IC 1848','Seelennebel',[],'Emissionsnebel',2.85,60.4,6.5,150,75,'Cassiopeia',['Ha','OIII','SII'],['IC'],0],
 ['NGC 7635','Blasennebel',[],'Emissionsnebel',23.345,61.2,10,15,8,'Cassiopeia',['Ha','OIII','SII'],['NGC'],0],
 ['NGC 1499','Kaliforniennebel',[],'Emissionsnebel',4.05,36.42,5,145,40,'Perseus',['Ha','RGB'],['NGC'],0],
 ['NGC 2237','Rosettennebel',['NGC 2244'],'Sternhaufen mit Nebel',6.55,5.05,6,80,60,'Monoceros',['Ha','OIII','SII','RGB'],['NGC'],0],
 ['SH2-240','Spaghettinebel',['Simeis 147'],'Supernovaüberrest',5.67,28.0,12,180,180,'Taurus',['Ha','OIII'],['Sh2'],0],
 ['SH2-216','Sh2-216',[],'Planetarischer Nebel',4.72,46.7,12,100,90,'Perseus',['OIII','Ha'],['Sh2'],0],
 ['SH2-221','Sh2-221',['HB9'],'Supernovaüberrest',5.02,46.7,12,120,90,'Auriga',['Ha','OIII'],['Sh2'],0],
 ['CTB 1','CTB 1',['Abell 85'],'Supernovaüberrest',23.99,62.45,12,34,28,'Cassiopeia',['OIII','Ha'],['Abell','Zusatzkatalog'],0],
 ['Abell 39','Abell 39',[],'Planetarischer Nebel',16.455,27.91,13.7,2.8,2.8,'Hercules',['OIII','Ha'],['Abell'],0],
 ['Abell 21','Medusanebel',['Sh2-274'],'Planetarischer Nebel',7.49,13.25,10.3,12,10,'Gemini',['OIII','Ha'],['Abell','Sh2'],0],
 ['NGC 7293','Helixnebel',[],'Planetarischer Nebel',22.494,-20.837,7.6,25,20,'Aquarius',['OIII','Ha','RGB'],['NGC'],0],
 ['NGC 6888','Sichelnebel',[],'Emissionsnebel',20.201,38.355,7.4,20,10,'Cygnus',['OIII','Ha','SII'],['NGC'],0]
].map(r=>({id:r[0],name:r[1],aliases:r[2],type:r[3],raHours:r[4],decDeg:r[5],magnitude:r[6],majorArcMin:r[7],minorArcMin:r[8],constellation:r[9],recommendedFilters:r[10],catalogs:r[11],positionAngleDeg:r[12]}));

let db;
let profiles=[];
let profile;
let draft;
let catalog=[...BUILTIN_OBJECTS];
let weatherModels=[];
let weatherError='';
let currentComputedObjects=[];
let installPrompt=null;
let currentMainTab='plan';
let currentSettingsTab='equipment';
let selectedDateKey='';
let page=1;
let scrollByTab={plan:0,settings:0};
let dirtySections=new Set();
let swRegistration=null;

function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains('profiles'))d.createObjectStore('profiles',{keyPath:'id'});if(!d.objectStoreNames.contains('meta'))d.createObjectStore('meta',{keyPath:'key'});if(!d.objectStoreNames.contains('cache'))d.createObjectStore('cache',{keyPath:'key'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
function idb(store,mode='readonly'){return db.transaction(store,mode).objectStore(store)}
function idbGet(store,key){return new Promise((resolve,reject)=>{const r=idb(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function idbAll(store){return new Promise((resolve,reject)=>{const r=idb(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function idbPut(store,value){return new Promise((resolve,reject)=>{const r=idb(store,'readwrite').put(value);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function idbDelete(store,key){return new Promise((resolve,reject)=>{const r=idb(store,'readwrite').delete(key);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
async function saveProfile(p=profile){p.updatedAt=new Date().toISOString();await idbPut('profiles',deepClone(p));profiles=await idbAll('profiles');updateProfileSelectors();}
async function setActiveProfile(id){await idbPut('meta',{key:'activeProfileId',value:id});}

function normalizeProfile(p){
  const base=standardProfile();
  const out={...base,...p};
  out.equipment={...base.equipment,...(p.equipment||{})};
  out.central={...base.central,...(p.central||{})};
  out.central.windProfiles={...deepClone(WIND_PROFILES),...(p.central?.windProfiles||{})};
  out.central.dew={...base.central.dew,...(p.central?.dew||{})};
  out.central.jet={...base.central.jet,...(p.central?.jet||{})};
  out.central.weatherModels={
    ...base.central.weatherModels,
    ...(p.central?.weatherModels||{}),
    weights:{...base.central.weatherModels.weights,...(p.central?.weatherModels?.weights||{})}
  };
  out.central.weights={...base.central.weights,...(p.central?.weights||{})};
  out.central.listDisplay={...base.central.listDisplay,...(p.central?.listDisplay||{})};
  out.central.listDisplay.profiles={...deepClone(DISPLAY_PROFILES),...(p.central?.listDisplay?.profiles||{})};
  out.central.detailPanels={...base.central.detailPanels,...(p.central?.detailPanels||{})};
  out.central.collapsed={...base.central.collapsed,...(p.central?.collapsed||{})};
  out.locations=(p.locations?.length?p.locations:base.locations).map(x=>({
    ...x,
    horizon:Array.isArray(x.horizon)&&x.horizon.length===8?x.horizon:[0,0,0,0,0,0,0,0],
    obstacles:(x.obstacles||[]).map(o=>({...o}))
  }));
  out.planning={...base.planning,...(p.planning||{})};
  out.ui={...base.ui,...(p.ui||{})};
  out.schemaVersion=base.schemaVersion;
  return out;
}

async function init(){
  document.documentElement.dataset.environment=ENV;
  document.body.classList.toggle('env-test',ENV==='test');
  document.body.classList.toggle('env-prod',ENV==='prod');
  document.title=BUILD.documentTitle || `Astro Night Planner ${RELEASE}`;
  const headerVersion=document.getElementById('headerVersion');
  if(headerVersion)headerVersion.textContent=RELEASE;
  const headerEnvironment=document.getElementById('headerEnvironmentText');
  if(headerEnvironment){headerEnvironment.hidden=ENV==='prod';headerEnvironment.textContent=ENV==='test'?' · TESTVERSION':'';}
  const badge=document.getElementById('environmentBadge');
  badge.hidden=ENV==='prod';
  if(ENV==='test')badge.textContent=BUILD.badgeText || 'TESTVERSION';
  db=await openDb(); profiles=(await idbAll('profiles')).map(normalizeProfile);
  if(!profiles.length){const p=standardProfile();await idbPut('profiles',p);profiles=[p];}
  const active=await idbGet('meta','activeProfileId'); profile=profiles.find(x=>x.id===active?.value)||profiles.find(x=>x.id==='standard')||profiles[0];
  await setActiveProfile(profile.id); draft=deepClone(profile); currentMainTab=profile.ui?.mainTab||'plan'; currentSettingsTab=profile.ui?.settingsTab||'equipment';
  selectedDateKey=profile.planning.dateKey||dateKeyFor(new Date(),activeLocation().timezone); page=profile.planning.page||1;
  updateProfileSelectors(); bindGlobal(); render(); registerPwa(); loadCatalog(); fetchWeather();
}

function bindGlobal(){
  document.querySelectorAll('[data-main-tab]').forEach(button=>button.addEventListener('click',()=>switchMain(button.dataset.mainTab)));
  document.getElementById('headerProfileSelect').addEventListener('change',async event=>{
    const found=profiles.find(item=>item.id===event.target.value);
    if(!found)return;
    profile=normalizeProfile(found);
    draft=deepClone(profile);
    dirtySections.clear();
    await setActiveProfile(profile.id);
    selectedDateKey=profile.planning.dateKey||dateKeyFor(new Date(),activeLocation().timezone);
    page=1;
    render();
    fetchWeather();
  });
  importInput.addEventListener('change',handleImportFile);
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    installPrompt=event;
    document.getElementById('installButton').hidden=false;
  });
  document.getElementById('installButton').addEventListener('click',async()=>{
    if(installPrompt){
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt=null;
      document.getElementById('installButton').hidden=true;
    }
  });
  document.getElementById('reloadForUpdate').addEventListener('click',()=>location.reload());
  window.addEventListener('resize',layoutFramingOverlays,{passive:true});
}
function updateProfileSelectors(){
  const select=document.getElementById('headerProfileSelect'); if(!select)return;
  select.innerHTML=profiles.sort((a,b)=>a.name.localeCompare(b.name,'de')).map(p=>`<option value="${esc(p.id)}" ${profile&&p.id===profile.id?'selected':''}>${esc(p.name)}</option>`).join('');
  document.getElementById('headerProfileName').textContent=profile?.name||'Standard';
}
async function switchMain(tab){scrollByTab[currentMainTab]=scrollY;currentMainTab=tab;profile.ui.mainTab=tab;await saveProfile();render();requestAnimationFrame(()=>scrollTo({top:scrollByTab[tab]||0,behavior:'instant'}));}

function activeLocation(){return profile.locations.find(x=>x.id===profile.selectedLocationId)||profile.locations[0]||standardProfile().locations[0]}
function activeScope(){return profile.equipment.telescopes.find(x=>x.id===profile.equipment.selectedTelescopeId)}
function activeCamera(){return profile.equipment.cameras.find(x=>x.id===profile.equipment.selectedCameraId)}
function fov(){const s=activeScope(),c=activeCamera();if(!s||!c||!s.focalLength)return null;return {width:57.2958*c.sensorWidth/s.focalLength,height:57.2958*c.sensorHeight/s.focalLength,pixelScale:206.265*c.pixelSize/s.focalLength}}
function esc(v){return String(v??'').replace(/[&<>"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))}
function fmt(v,d=0){return Number.isFinite(v)?Number(v).toFixed(d):'–'}
function toRad(x){return x*Math.PI/180} function toDeg(x){return x*180/Math.PI}
function dateKeyFor(date,tz='Europe/Berlin'){return new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(date)}
function addDays(key,n){const d=new Date(`${key}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function fmtDate(key,tz){return new Intl.DateTimeFormat('de-DE',{timeZone:tz,weekday:'short',day:'2-digit',month:'2-digit'}).format(new Date(`${key}T12:00:00Z`))}
function fmtTime(date,tz){if(!date||isNaN(date))return'–';return new Intl.DateTimeFormat('de-DE',{timeZone:tz,hour:'2-digit',minute:'2-digit'}).format(date)}
function fmtDateTime(date,tz){return new Intl.DateTimeFormat('de-DE',{timeZone:tz,day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(date)}

function julian(date){return date.getTime()/86400000+2440587.5}
function gmst(date){const d=julian(date)-2451545;return ((18.697374558+24.06570982441908*d)%24+24)%24}
function altitude(raHours,decDeg,date,lat,lon){const ha=toRad((((gmst(date)+lon/15-raHours)%24+24)%24)*15);const p=toRad(lat),d=toRad(decDeg);return toDeg(Math.asin(clamp(Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(ha),-1,1)))}
function azimuth(raHours,decDeg,date,lat,lon){const ha=toRad((((gmst(date)+lon/15-raHours)%24+24)%24)*15);const p=toRad(lat),d=toRad(decDeg);const y=Math.sin(ha),x=Math.cos(ha)*Math.sin(p)-Math.tan(d)*Math.cos(p);return (toDeg(Math.atan2(y,x))+180+360)%360}
function sunCoords(date){const n=julian(date)-2451545;const L=(280.46+.9856474*n)%360;const g=toRad((357.528+.9856003*n)%360);const lambda=toRad(L+1.915*Math.sin(g)+.02*Math.sin(2*g));const eps=toRad(23.439-.0000004*n);const ra=Math.atan2(Math.cos(eps)*Math.sin(lambda),Math.cos(lambda));const dec=Math.asin(Math.sin(eps)*Math.sin(lambda));return {raHours:((toDeg(ra)/15)%24+24)%24,decDeg:toDeg(dec)}}
function sunAltitude(date,loc){const c=sunCoords(date);return altitude(c.raHours,c.decDeg,date,loc.latitude,loc.longitude)}
function moonCoords(date){const d=julian(date)-2451543.5;const N=toRad(125.1228-.0529538083*d);const i=toRad(5.1454);const w=toRad(318.0634+.1643573223*d);const a=60.2666;const e=.0549;const M=toRad((115.3654+13.0649929509*d)%360);let E=M+e*Math.sin(M)*(1+e*Math.cos(M));for(let k=0;k<3;k++)E=E-(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));const xv=a*(Math.cos(E)-e),yv=a*Math.sqrt(1-e*e)*Math.sin(E);const v=Math.atan2(yv,xv),r=Math.hypot(xv,yv);const xh=r*(Math.cos(N)*Math.cos(v+w)-Math.sin(N)*Math.sin(v+w)*Math.cos(i));const yh=r*(Math.sin(N)*Math.cos(v+w)+Math.cos(N)*Math.sin(v+w)*Math.cos(i));const zh=r*Math.sin(v+w)*Math.sin(i);const lon=Math.atan2(yh,xh),lat=Math.atan2(zh,Math.hypot(xh,yh));const eps=toRad(23.4393);const xe=Math.cos(lon)*Math.cos(lat),ye=Math.sin(lon)*Math.cos(lat)*Math.cos(eps)-Math.sin(lat)*Math.sin(eps),ze=Math.sin(lon)*Math.cos(lat)*Math.sin(eps)+Math.sin(lat)*Math.cos(eps);const ra=Math.atan2(ye,xe),dec=Math.atan2(ze,Math.hypot(xe,ye));return{raHours:((toDeg(ra)/15)%24+24)%24,decDeg:toDeg(dec)}}
function moonIllumination(date){const syn=29.53058867;const age=((julian(date)-2451550.1)%syn+syn)%syn;return (1-Math.cos(2*Math.PI*age/syn))/2*100}
function findCrossings(start,end,loc,threshold,fn=sunAltitude){const step=5*60000;let prevT=start,prev=fn(start,loc)-threshold;const out=[];for(let t=start.getTime()+step;t<=end.getTime();t+=step){const dt=new Date(t),v=fn(dt,loc)-threshold;if(prev===0||v===0||prev*v<0){const frac=Math.abs(prev)/(Math.abs(prev)+Math.abs(v));out.push({time:new Date(prevT.getTime()+frac*(dt-prevT)),descending:prev>v});}prev=v;prevT=dt;}return out}
function nightData(key,loc){const center=new Date(`${key}T12:00:00Z`),start=new Date(center.getTime()-2*3600000),end=new Date(center.getTime()+26*3600000);const cross=t=>findCrossings(start,end,loc,t);const c0=cross(-.833),c6=cross(-6),c12=cross(-12),c18=cross(-18);const desc=a=>a.find(x=>x.descending)?.time,asc=a=>[...a].reverse().find(x=>!x.descending)?.time;const sunset=desc(c0)||new Date(`${key}T18:00:00Z`),sunrise=asc(c0)||new Date(sunset.getTime()+12*3600000);const moonFn=(date,l)=>{const c=moonCoords(date);return altitude(c.raHours,c.decDeg,date,l.latitude,l.longitude)};const mc=findCrossings(sunset,sunrise,loc,0,moonFn);let moonMax=-90,moonTransit=null;for(let t=sunset.getTime();t<=sunrise.getTime();t+=10*60000){const a=moonFn(new Date(t),loc);if(a>moonMax){moonMax=a;moonTransit=new Date(t)}}return{sunset,sunrise,civilDusk:desc(c6)||sunset,civilDawn:asc(c6)||sunrise,nauticalDusk:desc(c12)||desc(c6)||sunset,nauticalDawn:asc(c12)||asc(c6)||sunrise,astronomicalDusk:desc(c18)||desc(c12)||sunset,astronomicalDawn:asc(c18)||asc(c12)||sunrise,moonrise:mc.find(x=>!x.descending)?.time,moonset:mc.find(x=>x.descending)?.time,moonTransit,moonMaxAltitude:moonMax,moonIllumination:moonIllumination(new Date((sunset.getTime()+sunrise.getTime())/2))}}
function planningWindow(night,key){switch(key){case'sunset':return{start:night.sunset,end:night.sunrise,label:'Sonnenuntergang bis Sonnenaufgang'};case'civil':return{start:night.civilDusk,end:night.civilDawn,label:'Bürgerliche Nacht'};case'astronomicalTwilight':return{start:night.nauticalDusk,end:night.nauticalDawn,label:'Nautische und astronomische Nacht'};case'astronomicalNight':return{start:night.astronomicalDusk,end:night.astronomicalDawn,label:'Astronomische Nacht'};default:return{start:night.nauticalDusk,end:night.nauticalDawn,label:'Nautischer Planungszeitraum'}}}
function angularSeparation(aRa,aDec,bRa,bDec){const a=toRad(aRa*15),b=toRad(bRa*15),da=toRad(aDec),db=toRad(bDec);return toDeg(Math.acos(clamp(Math.sin(da)*Math.sin(db)+Math.cos(da)*Math.cos(db)*Math.cos(a-b),-1,1)))}
function horizonAt(loc,az){const arr=loc.horizon||[0,0,0,0,0,0,0,0];const pos=((az%360)+360)%360/45;const i=Math.floor(pos)%8,j=(i+1)%8,f=pos-Math.floor(pos);return arr[i]*(1-f)+arr[j]*f}
function objectStats(obj,window,loc,minAlt){const points=[];let max=-90,best=window.start,visibleMs=0;const count=49;for(let i=0;i<count;i++){const t=new Date(window.start.getTime()+(window.end-window.start)*i/(count-1));const alt=altitude(obj.raHours,obj.decDeg,t,loc.latitude,loc.longitude);const az=azimuth(obj.raHours,obj.decDeg,t,loc.latitude,loc.longitude);const effectiveMin=Math.max(minAlt,horizonAt(loc,az));points.push({t,alt,az});if(alt>max){max=alt;best=t}if(i&&alt>=effectiveMin)visibleMs+=(window.end-window.start)/(count-1)}const moon=moonCoords(best);const moonAlt=altitude(moon.raHours,moon.decDeg,best,loc.latitude,loc.longitude);return{points,maxAltitude:max,bestTime:best,visibleHours:visibleMs/3600000,meridian:best,moonDistance:angularSeparation(obj.raHours,obj.decDeg,moon.raHours,moon.decDeg),moonAltitude:moonAlt}}

function currentWindProfile(){return profile.planning.temporaryWindProfile||profile.central.activeWindProfile}
function currentDisplayProfile(){return profile.planning.temporaryDisplayProfile||profile.central.listDisplay.activeProfile}

function currentWeatherView(){return profile.planning.temporaryWeatherView||profile.central.weatherModels?.defaultView||'consensus'}
function weatherViewLabel(view=currentWeatherView()){return WEATHER_VIEW_OPTIONS.find(([key])=>key===view)?.[1]||'Modellkonsens'}
function cardinal(azimuth){const names=['N','NO','O','SO','S','SW','W','NW'];return names[Math.round((((azimuth%360)+360)%360)/45)%8]}
function weightedValue(entries,key){
  const available=entries.filter(entry=>Number.isFinite(entry.row[key]));
  if(!available.length)return NaN;
  const configured=profile.central.weatherModels?.weights||{};
  let denominator=available.reduce((sum,entry)=>sum+Math.max(0,Number(configured[entry.model.key]??0)),0);
  if(denominator<=0)denominator=available.length;
  return available.reduce((sum,entry)=>{
    const configuredWeight=Math.max(0,Number(configured[entry.model.key]??0));
    const weight=denominator===available.length&&configuredWeight===0?1:configuredWeight;
    return sum+entry.row[key]*weight;
  },0)/denominator;
}
function weatherRowsForWindow(windowRange,view=currentWeatherView()){
  if(!weatherModels.length)return[];
  if(view!=='consensus'){
    const model=weatherModels.find(item=>item.key===view);
    if(!model)return[];
    return model.time.map((time,index)=>({...(model.values[index]||{}),time:new Date(time),model:model.name,modelKey:model.key}))
      .filter(row=>row.time>=windowRange.start&&row.time<=windowRange.end)
      .map(enrichWeatherRow);
  }
  const byTime=new Map();
  for(const model of weatherModels){
    model.time.forEach((time,index)=>{
      const timestamp=new Date(time).getTime();
      if(timestamp<windowRange.start.getTime()||timestamp>windowRange.end.getTime())return;
      if(!byTime.has(timestamp))byTime.set(timestamp,[]);
      byTime.get(timestamp).push({model,row:model.values[index]||{}});
    });
  }
  const keys=['temperature','dewPoint','humidity','cloud','cloudLow','cloudMid','cloudHigh','visibility','precip','wind','gust','jet'];
  return [...byTime.entries()].sort((a,b)=>a[0]-b[0]).map(([timestamp,entries])=>{
    const row={time:new Date(timestamp),model:'Modellkonsens',modelKey:'consensus'};
    keys.forEach(key=>row[key]=weightedValue(entries,key));
    return enrichWeatherRow(row);
  });
}
function enrichWeatherRow(row){
  const cloud=Number.isFinite(row.cloud)?row.cloud:0;
  const visibility=Number.isFinite(row.visibility)?row.visibility:0;
  const wind=Number.isFinite(row.wind)?row.wind:0;
  const high=Number.isFinite(row.cloudHigh)?row.cloudHigh:0;
  return {
    ...row,
    dewGap:Number.isFinite(row.temperature)&&Number.isFinite(row.dewPoint)?row.temperature-row.dewPoint:NaN,
    transparency:clamp((visibility/24000)*100-cloud*.45,0,100),
    seeing:clamp(82-wind*2.1-high*.12,0,100)
  };
}
function thresholdClass(value,green,yellow,lowerIsBetter=true){
  if(!Number.isFinite(value))return'';
  if(lowerIsBetter)return value<green?'good':value<=yellow?'warn':'bad';
  return value>green?'good':value>=yellow?'warn':'bad';
}
function windQualityClass(value,type='wind'){
  const thresholds=windThresholds();
  const green=type==='gust'?thresholds.gustGreen:thresholds.windGreen;
  const yellow=type==='gust'?thresholds.gustYellow:thresholds.windYellow;
  return thresholdClass(windFromKmh(value),green,yellow,true);
}
function weatherHourScore(row){
  const weights=profile.central.weights;
  const windClassScore=Math.min(
    windQualityClass(row.wind)==='good'?100:windQualityClass(row.wind)==='warn'?60:20,
    windQualityClass(row.gust,'gust')==='good'?100:windQualityClass(row.gust,'gust')==='warn'?60:20
  );
  const dewScore=row.dewGap>profile.central.dew.green?100:row.dewGap>=profile.central.dew.yellow?55:15;
  const parts=[
    [weights.clouds,100-(row.cloud||0)],
    [weights.transparency,row.transparency],
    [weights.seeing,row.seeing],
    [weights.wind,windClassScore],
    [weights.dew,dewScore]
  ];
  const denominator=parts.reduce((sum,[weight])=>sum+weight,0)||1;
  return clamp(parts.reduce((sum,[weight,value])=>sum+weight*(Number.isFinite(value)?value:50),0)/denominator,0,100);
}
function windUnitLabel(unit=profile.central.windUnit){return unit==='ms'?'m/s':'km/h'}
function windFromKmh(value,unit=profile.central.windUnit){return unit==='ms'?value/3.6:value}
function convertWindValue(value,fromUnit,toUnit){if(fromUnit===toUnit)return value;return toUnit==='ms'?value/3.6:value*3.6}
function windThresholds(){return profile.central.windProfiles[currentWindProfile()]||WIND_PROFILES.normal}
function weatherForWindow(windowRange,view=currentWeatherView()){
  const rows=weatherRowsForWindow(windowRange,view);
  if(!rows.length)return null;
  const finite=key=>rows.map(row=>row[key]).filter(Number.isFinite);
  const avg=key=>{const values=finite(key);return values.length?values.reduce((a,b)=>a+b,0)/values.length:NaN};
  const max=key=>{const values=finite(key);return values.length?Math.max(...values):NaN};
  const dewGap=avg('dewGap');
  const cloud=avg('cloud');
  const windKmh=avg('wind');
  const gustKmh=max('gust');
  const jetKmh=avg('jet');
  const visibility=avg('visibility');
  const wind=windFromKmh(windKmh),gust=windFromKmh(gustKmh),jet=windFromKmh(jetKmh);
  const transparency=avg('transparency');
  const seeing=avg('seeing');
  const thresholds=windThresholds();
  const windScore=Math.min(
    wind<thresholds.windGreen?100:wind<=thresholds.windYellow?60:20,
    gust<thresholds.gustGreen?100:gust<=thresholds.gustYellow?60:20
  );
  const dewScore=dewGap>profile.central.dew.green?100:dewGap>=profile.central.dew.yellow?55:15;
  return{rows,cloud,wind,gust,jet,windKmh,gustKmh,jetKmh,dewGap,visibility,transparency,seeing,windScore,dewScore,view};
}
function scoreObject(obj,stats,weather,window,night){const w=profile.central.weights;const duration=Math.max(.1,(window.end-window.start)/3600000);const altitudeScore=clamp((stats.maxAltitude-15)/60*100,0,100),durationScore=clamp(stats.visibleHours/duration*100,0,100);const moonPenalty=stats.moonAltitude<=0?100:clamp((stats.moonDistance-15)/75*100,0,100)*(1-night.moonIllumination/180);const cloud=weather?100-weather.cloud:55,trans=weather?weather.transparency:55,seeing=weather?weather.seeing:55,wind=weather?weather.windScore:55,dew=weather?weather.dewScore:55;const total=w.clouds*cloud+w.transparency*trans+w.seeing*seeing+w.wind*wind+w.dew*dew+w.moon*moonPenalty+w.altitude*altitudeScore+w.duration*durationScore;return clamp(total/100,0,100)}
function scoreClass(v){return v>=70?'good':v>=45?'warn':'bad'}
function fitsSensor(obj){const f=fov();if(!f||!obj.majorArcMin)return'–';const ratio=Math.max(obj.majorArcMin/60/f.width,obj.minorArcMin/60/f.height);return ratio<=.82?'gut':ratio<=1.05?'knapp':'zu groß'}

async function loadCatalog(){try{const cached=await idbGet('cache','catalog-v10');if(cached?.value?.length){catalog=mergeCatalog(cached.value);render()}let rows=null,lastError=null;for(const url of [LOCAL_CATALOG_URL,REMOTE_CATALOG_URL]){try{const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw new Error(`${url}: HTTP ${response.status}`);const candidate=await response.json();if(!Array.isArray(candidate)||!candidate.length)throw new Error(`${url}: ungültiger Katalog`);rows=candidate;break}catch(error){lastError=error}}if(!rows)throw lastError||new Error('Kein Katalog verfügbar');const converted=rows.map(r=>({id:r[0],name:r[1],aliases:r[2]||[],type:r[3],raHours:r[4],decDeg:r[5],magnitude:r[6]??null,surfaceBrightness:r[7]??null,majorArcMin:r[8]||0,minorArcMin:r[9]||r[8]||0,constellation:r[10]||'–',recommendedFilters:r[11]||[],catalogs:r[12]||['Zusatzkatalog'],positionAngleDeg:Number.isFinite(r[13])?r[13]:0}));catalog=mergeCatalog(converted);await idbPut('cache',{key:'catalog-v10',value:converted,updatedAt:new Date().toISOString()});render();}catch(err){console.warn('Katalog-Fallback aktiv',err)}}
function mergeCatalog(remote){const map=new Map();for(const o of [...remote,...BUILTIN_OBJECTS]){const key=o.id.replace(/\s/g,'').toUpperCase();map.set(key,{...(map.get(key)||{}),...o,aliases:[...new Set([...(map.get(key)?.aliases||[]),...(o.aliases||[])])],catalogs:[...new Set([...(map.get(key)?.catalogs||[]),...(o.catalogs||[])])]});}return [...map.values()]}

async function fetchWeather(){
  weatherError='';
  weatherModels=[];
  render();
  const loc=activeLocation();
  const vars='temperature_2m,dew_point_2m,relative_humidity_2m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,precipitation,wind_speed_10m,wind_gusts_10m,wind_speed_250hPa';
  const specs=Object.entries(WEATHER_MODEL_CONFIG);
  const settled=await Promise.allSettled(specs.map(async([key,config])=>{
    const url=new URL('https://api.open-meteo.com/v1/forecast');
    url.search=new URLSearchParams({
      latitude:loc.latitude,
      longitude:loc.longitude,
      elevation:loc.elevation||'',
      hourly:vars,
      models:config.model,
      wind_speed_unit:'kmh',
      timezone:'auto',
      forecast_days:'8'
    });
    const response=await fetch(url);
    if(!response.ok)throw new Error(`${config.name}: HTTP ${response.status}`);
    const json=await response.json();
    const hourly=json.hourly;
    return{
      key,
      name:config.name,
      time:hourly.time,
      values:hourly.time.map((_,index)=>({
        temperature:hourly.temperature_2m?.[index],
        dewPoint:hourly.dew_point_2m?.[index],
        humidity:hourly.relative_humidity_2m?.[index],
        cloud:hourly.cloud_cover?.[index],
        cloudLow:hourly.cloud_cover_low?.[index],
        cloudMid:hourly.cloud_cover_mid?.[index],
        cloudHigh:hourly.cloud_cover_high?.[index],
        visibility:hourly.visibility?.[index],
        precip:hourly.precipitation?.[index],
        wind:hourly.wind_speed_10m?.[index],
        gust:hourly.wind_gusts_10m?.[index],
        jet:hourly.wind_speed_250hPa?.[index]
      }))
    };
  }));
  weatherModels=settled.filter(result=>result.status==='fulfilled').map(result=>result.value);
  const failures=settled.filter(result=>result.status==='rejected');
  if(!weatherModels.length)weatherError='Keine Wettermodelle konnten geladen werden.';
  else if(failures.length)weatherError=`${failures.length} Wettermodell(e) derzeit nicht verfügbar.`;
  render();
}

function render(){
  document.querySelectorAll('[data-main-tab]').forEach(button=>button.classList.toggle('active',button.dataset.mainTab===currentMainTab));
  document.getElementById('headerProfileName').textContent=profile.name;
  app.innerHTML=currentMainTab==='plan'?renderPlan():renderSettings();
  bindRendered();
  drawMiniCharts();
  drawLargeCharts();
  drawSettingsHorizonCharts();
  layoutFramingOverlays();
  window.setTimeout(layoutFramingOverlays,80);
}
function dateKeys(){const today=dateKeyFor(new Date(),activeLocation().timezone);return Array.from({length:8},(_,i)=>addDays(today,i))}

function planningWindowOptions(selected){
  return [
    ['sunset','Sonnenuntergang–Sonnenaufgang'],
    ['civil','Bürgerliche Nacht'],
    ['nautical','Nautischer Planungszeitraum'],
    ['astronomicalTwilight','Nautisch + astronomisch'],
    ['astronomicalNight','Astronomische Nacht']
  ].map(([key,label])=>`<option value="${key}" ${selected===key?'selected':''}>${label}</option>`).join('');
}
function renderPlan(){
  const loc=activeLocation();
  const keys=dateKeys();
  if(!keys.includes(selectedDateKey))selectedDateKey=keys[0];
  const night=nightData(selectedDateKey,loc);
  const windowRange=planningWindow(night,profile.planning.planningWindow);
  const weather=weatherForWindow(windowRange);
  const objects=computeObjects(windowRange,night,weather);
  currentComputedObjects=objects;
  const display=profile.central.listDisplay.profiles[currentDisplayProfile()]||DISPLAY_PROFILES.standard;
  profile.planning.pageSize=display.pageSize||profile.planning.pageSize||20;
  const totalPages=Math.max(1,Math.ceil(objects.length/profile.planning.pageSize));
  page=clamp(page,1,totalPages);
  const start=(page-1)*profile.planning.pageSize;
  const shown=objects.slice(start,start+profile.planning.pageSize);
  if(profile.planning.detailsOpen&&!shown.some(item=>item.object.id===profile.planning.selectedObjectId)){
    profile.planning.detailsOpen=false;
  }
  const currentWeather=currentWeatherView();
  const defaultWeather=profile.central.weatherModels.defaultView||'consensus';
  return `<div data-page="plan">
    <section class="card">
      <div class="section-title-row">
        <div><h2>Planungsnacht</h2><div class="muted">${esc(loc.name)} · ${fmt(loc.latitude,4)}°, ${fmt(loc.longitude,4)}°</div></div>
        <button id="weatherRefresh">Wetter aktualisieren</button>
      </div>
      <div class="date-buttons">${keys.map((key,index)=>`<button data-date="${key}" class="${key===selectedDateKey?'active':''}">${index===0?'Heute':index===1?'Morgen':`+${index}`}<br><span class="small">${fmtDate(key,loc.timezone)}</span></button>`).join('')}</div>
      <div class="toolbar planning-window-toolbar">
        <label>Planungszeitraum
          <select id="planningWindowTop">${planningWindowOptions(profile.planning.planningWindow)}</select>
        </label>
        <div class="small muted">Die Auswahl steuert Objektbewertung, Sichtbarkeitsdauer, Wetterbewertung sowie die Höhenprofile.</div>
      </div>
      <div class="grid four" style="margin-top:14px">
        <div class="metric"><div class="label">Sonnenuntergang</div><div class="value">${fmtTime(night.sunset,loc.timezone)}</div></div>
        <div class="metric"><div class="label">Gewählter Zeitraum</div><div class="value">${fmtTime(windowRange.start,loc.timezone)}–${fmtTime(windowRange.end,loc.timezone)}</div><div class="small muted">${windowRange.label}</div></div>
        <div class="metric"><div class="label">Astronomische Dunkelheit</div><div class="value">${fmtTime(night.astronomicalDusk,loc.timezone)}–${fmtTime(night.astronomicalDawn,loc.timezone)}</div></div>
        <div class="metric"><div class="label">Sonnenaufgang</div><div class="value">${fmtTime(night.sunrise,loc.timezone)}</div></div>
      </div>
      <div class="grid four" style="margin-top:12px">
        <div class="metric"><div class="label">Mondaufgang</div><div class="value">${fmtTime(night.moonrise,loc.timezone)}</div></div>
        <div class="metric"><div class="label">Mondkulmination</div><div class="value">${fmtTime(night.moonTransit,loc.timezone)} · ${fmt(night.moonMaxAltitude)}°</div></div>
        <div class="metric"><div class="label">Monduntergang</div><div class="value">${fmtTime(night.moonset,loc.timezone)}</div></div>
        <div class="metric"><div class="label">Mondbeleuchtung</div><div class="value">${fmt(night.moonIllumination)} %</div></div>
      </div>
    </section>
    <section class="card">
      <div class="section-title-row"><h2>Profile für diese Planung</h2><span class="small muted">Temporäre Auswahl überschreibt den Standard nicht.</span></div>
      <div class="toolbar">
        <label>Aufnahmequalitätsprofil
          <select id="planWindProfile"><option value="">Standard: ${esc(profile.central.windProfiles[profile.central.activeWindProfile].name)}</option>${Object.entries(profile.central.windProfiles).map(([key,value])=>`<option value="${key}" ${profile.planning.temporaryWindProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select>
        </label>
        <button id="makeWindDefault" ${!profile.planning.temporaryWindProfile?'disabled':''}>Als Standard übernehmen</button>
        <label>Darstellungsprofil
          <select id="planDisplayProfile"><option value="">Standard: ${esc(profile.central.listDisplay.profiles[profile.central.listDisplay.activeProfile].name)}</option>${Object.entries(profile.central.listDisplay.profiles).map(([key,value])=>`<option value="${key}" ${profile.planning.temporaryDisplayProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select>
        </label>
        <button id="makeDisplayDefault" ${!profile.planning.temporaryDisplayProfile?'disabled':''}>Als Standard übernehmen</button>
        <label>Wetterdarstellung
          <select id="planWeatherView"><option value="">Standard: ${esc(weatherViewLabel(defaultWeather))}</option>${WEATHER_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${profile.planning.temporaryWeatherView===key?'selected':''}>${esc(label)}</option>`).join('')}</select>
        </label>
        <button id="makeWeatherDefault" ${!profile.planning.temporaryWeatherView?'disabled':''}>Als Standard übernehmen</button>
      </div>
      <div class="small muted" style="margin-top:8px">Aktuell: ${esc(weatherViewLabel(currentWeather))}</div>
    </section>
    ${renderWeather(windowRange,weather,loc,night)}
    ${renderMeteoblue(loc)}
    <section class="card">
      <div class="section-title-row"><h2>Objektauswahl</h2><span class="muted">${objects.length} Treffer aus ${catalog.length} Katalogobjekten</span></div>
      ${renderFilters()}
      ${pagination(totalPages,objects.length)}
      ${renderObjectTable(shown,display.columns,loc,windowRange,night)}
      ${pagination(totalPages,objects.length)}
    </section>
  </div>`;
}
function computeObjects(window,night,weather){const p=profile.planning,needle=p.search.trim().toLocaleLowerCase('de');return catalog.filter(o=>!p.catalogs?.length||o.catalogs.some(c=>p.catalogs.includes(c))).filter(o=>!p.types?.length||p.types.includes(o.type)).filter(o=>o.magnitude==null||o.magnitude<=p.maxMagnitude).filter(o=>!o.majorArcMin||(o.majorArcMin>=p.minSize&&o.majorArcMin<=p.maxSize)).filter(o=>!needle||[o.id,o.name,o.constellation,...(o.aliases||[])].join(' ').toLocaleLowerCase('de').includes(needle)).map(object=>{const stats=objectStats(object,window,activeLocation(),p.minAltitude);return{object,stats,score:scoreObject(object,stats,weather,window,night),fit:fitsSensor(object)}}).filter(x=>x.stats.maxAltitude>=p.minAltitude&&x.stats.visibleHours>=p.minVisibleHours&&(x.stats.moonDistance>=p.minMoonDistance||x.stats.moonAltitude<=0)&&(!p.onlyFits||['gut','knapp'].includes(x.fit))).sort((a,b)=>b.score-a.score)}
function renderFilters(){
  const cats=['Messier','NGC','IC','Sh2','Abell','Zusatzkatalog'];
  const types=[...new Set(catalog.map(object=>object.type))].sort((a,b)=>a.localeCompare(b,'de'));
  return `<details ${profile.central.collapsed.filters?'':'open'} id="filterDetails">
    <summary>Filter</summary>
    <div class="filters" style="margin-top:13px">
      <label>Suche<input id="objectSearch" value="${esc(profile.planning.search)}" placeholder="M31, NGC, Rosette …"></label>
      <label>Max. Magnitude (mag)<input id="maxMagnitude" type="number" step="0.1" value="${profile.planning.maxMagnitude}"></label>
      <label>Mindesthöhe (°)<input id="minAltitude" type="number" min="0" max="90" value="${profile.planning.minAltitude}"></label>
      <label>Mind. Sichtbarkeit (h)<input id="minVisibleHours" type="number" step="0.25" min="0" value="${profile.planning.minVisibleHours}"></label>
      <label>Mind. Mondabstand (°)<input id="minMoonDistance" type="number" min="0" max="180" value="${profile.planning.minMoonDistance}"></label>
      <label>Min. Objektgröße (′)<input id="minSize" type="number" min="0" value="${profile.planning.minSize}"></label>
      <label>Max. Objektgröße (′)<input id="maxSize" type="number" min="0" value="${profile.planning.maxSize}"></label>
    </div>
    <div class="divider"></div>
    <div class="small muted">Kataloge</div>
    <div class="chip-list">${cats.map(cat=>`<label class="chip"><input type="checkbox" data-catalog="${cat}" ${profile.planning.catalogs.includes(cat)?'checked':''}>${cat==='Sh2'?'Sharpless 2':cat==='Abell'?'Abell-PN':cat}</label>`).join('')}</div>
    <div class="small muted" style="margin-top:12px">Objekttypen (keine Auswahl = alle)</div>
    <div class="chip-list">${types.map(type=>`<label class="chip"><input type="checkbox" data-object-type="${esc(type)}" ${profile.planning.types.includes(type)?'checked':''}>${esc(type)}</label>`).join('')}</div>
    <label class="chip" style="margin-top:12px"><input id="onlyFits" type="checkbox" ${profile.planning.onlyFits?'checked':''}>Nur Objekte, die auf den Sensor passen</label>
  </details>`;
}
function pagination(totalPages,total){const pageSize=profile.planning.pageSize;const buttons=[];const from=Math.max(1,page-2),to=Math.min(totalPages,page+2);for(let i=from;i<=to;i++)buttons.push(`<button data-page-number="${i}" class="${i===page?'active':''}">${i}</button>`);return `<div class="pagination"><div class="result-summary"><span>${total} Treffer</span><label>Objekte/Seite <select id="pageSizeSelect"><option>10</option><option>20</option><option>50</option><option>100</option></select></label></div><div class="pages"><button data-page-number="1" ${page===1?'disabled':''}>«</button><button data-page-number="${page-1}" ${page===1?'disabled':''}>‹</button>${buttons.join('')}<button data-page-number="${page+1}" ${page===totalPages?'disabled':''}>›</button><button data-page-number="${totalPages}" ${page===totalPages?'disabled':''}>»</button></div></div>`}
function renderObjectTable(items,columns,loc,windowRange,night){
  const heads={
    score:'Bewertung',name:'Objekt',maxAltitude:'Max. Höhe',visibleHours:'Sichtbar',meridian:'Meridian',
    framing:'Framing',miniChart:'Höhenprofil',bestTime:'Beste Zeit',moonDistance:'Mondabstand',
    weather:'Wetter',size:'Größe',magnitude:'Mag.',filters:'Filter'
  };
  const body=items.map(item=>{
    const object=item.object;
    const isOpen=profile.planning.detailsOpen&&profile.planning.selectedObjectId===object.id;
    const row=`<tr class="object-row ${isOpen?'selected':''}" data-object-row="${esc(object.id)}" tabindex="0" aria-expanded="${isOpen?'true':'false'}">${columns.map(column=>objectCell(column,item,loc,windowRange,night)).join('')}</tr>`;
    const detail=isOpen?`<tr class="object-detail-row"><td colspan="${columns.length}">${renderObjectDetails(object,windowRange,loc,night)}</td></tr>`:'';
    return row+detail;
  }).join('');
  return `<div class="object-table-wrap"><table class="object-table"><thead><tr>${columns.map(column=>`<th>${heads[column]||column}</th>`).join('')}</tr></thead><tbody>${body||`<tr><td colspan="${columns.length}">Keine Objekte entsprechen den Filtern.</td></tr>`}</tbody></table></div>`;
}
function objectCell(column,item,loc,windowRange,night){
  const object=item.object;
  const stats=item.stats;
  switch(column){
    case'score':return`<td><span class="score-badge ${scoreClass(item.score)}">${fmt(item.score)}</span></td>`;
    case'name':return`<td><div class="object-name">${esc(object.id)} · ${esc(object.name)}</div><div class="small muted">${esc(object.type)} · ${esc(object.constellation)} · ${esc(object.catalogs.join(', '))}</div></td>`;
    case'maxAltitude':return`<td>${fmt(stats.maxAltitude)}°</td>`;
    case'visibleHours':return`<td>${fmt(stats.visibleHours,1)} h</td>`;
    case'meridian':return`<td>${fmtTime(stats.meridian,loc.timezone)}<br><span class="small muted">${fmt(stats.maxAltitude)}°</span></td>`;
    case'framing':return`<td><button data-frame-object="${esc(object.id)}">Rahmung · ${item.fit}</button></td>`;
    case'miniChart':return`<td><canvas class="mini-chart" width="230" height="92" data-points="${encodeURIComponent(JSON.stringify(stats.points.map(point=>[point.t.getTime(),point.alt])))}" data-start="${windowRange.start.getTime()}" data-end="${windowRange.end.getTime()}" data-astro-start="${night.astronomicalDusk.getTime()}" data-astro-end="${night.astronomicalDawn.getTime()}" data-naut-start="${night.nauticalDusk.getTime()}" data-naut-end="${night.nauticalDawn.getTime()}" data-min-alt="${profile.planning.minAltitude}"></canvas></td>`;
    case'bestTime':return`<td>${fmtTime(stats.bestTime,loc.timezone)}</td>`;
    case'moonDistance':return`<td>${fmt(stats.moonDistance)}°</td>`;
    case'weather':return`<td>${weatherModels.length?esc(weatherViewLabel()):'–'}</td>`;
    case'size':return`<td>${fmt(object.majorArcMin)}′ × ${fmt(object.minorArcMin)}′</td>`;
    case'magnitude':return`<td>${object.magnitude??'–'}${object.magnitude!=null?' mag':''}</td>`;
    case'filters':return`<td>${esc((object.recommendedFilters||[]).join(', ')||'–')}</td>`;
    default:return'<td>–</td>';
  }
}
function renderObjectDetails(o,windowRange,loc,night){
  const fullNight={start:night.sunset,end:night.sunrise};
  const fullStats=objectStats(o,fullNight,loc,profile.planning.minAltitude);
  const selectedStats=objectStats(o,windowRange,loc,profile.planning.minAltitude);
  const altitudePoints=fullStats.points.map(point=>[
    point.t.getTime(),
    Number(point.alt.toFixed(3)),
    Number(point.az.toFixed(3)),
    Number(horizonAt(loc,point.az).toFixed(3))
  ]);
  const horizonPoints=Array.from({length:73},(_,index)=>{
    const az=index*5;
    return[az,Number(horizonAt(loc,az).toFixed(3))];
  });
  const obstacles=(loc.obstacles||[]).map(item=>({
    name:item.name||'Hindernis',
    azimuth:Number(item.azimuth)||0,
    altitude:Number(item.altitude)||0
  }));
  return`<div class="object-detail-card" id="objectDetail-${esc(o.id)}">
    <div class="object-detail-header">
      <div><div class="eyebrow">Objektdetails</div><h2>${esc(o.id)} · ${esc(o.name)}</h2></div>
      <button type="button" class="close-detail-button" data-close-object-details aria-label="Detailansicht schließen">✕ Details schließen</button>
    </div>
    <div class="grid four object-detail-metrics">
      <div class="metric"><div class="label">Maximalhöhe im Planungszeitraum</div><div class="value">${fmt(selectedStats.maxAltitude)}°</div></div>
      <div class="metric"><div class="label">Beste Zeit</div><div class="value">${fmtTime(selectedStats.bestTime,loc.timezone)}</div></div>
      <div class="metric"><div class="label">Sichtbar über Grenzhöhe</div><div class="value">${fmt(selectedStats.visibleHours,1)} h</div></div>
      <div class="metric"><div class="label">Mondabstand</div><div class="value">${fmt(selectedStats.moonDistance)}°</div></div>
    </div>
    ${renderFraming(o,windowRange,loc)}
    <details class="object-chart-panel" ${profile.central.detailPanels?.altitudeCollapsed?'':'open'}>
      <summary>Höhenkurve</summary>
      <div class="chart-description">Sonnenuntergang bis Sonnenaufgang; der gewählte Planungszeitraum ist hervorgehoben. Ergänzend zur Uhrzeit wird die Himmelsrichtung angezeigt.</div>
      <canvas class="large-altitude-chart" width="1400" height="430"
        data-points="${encodeURIComponent(JSON.stringify(altitudePoints))}"
        data-start="${night.sunset.getTime()}" data-end="${night.sunrise.getTime()}"
        data-selected-start="${windowRange.start.getTime()}" data-selected-end="${windowRange.end.getTime()}"
        data-civil-start="${night.civilDusk.getTime()}" data-civil-end="${night.civilDawn.getTime()}"
        data-naut-start="${night.nauticalDusk.getTime()}" data-naut-end="${night.nauticalDawn.getTime()}"
        data-astro-start="${night.astronomicalDusk.getTime()}" data-astro-end="${night.astronomicalDawn.getTime()}"
        data-min-alt="${profile.planning.minAltitude}" data-timezone="${esc(loc.timezone)}"></canvas>
    </details>
    <details class="object-chart-panel" ${profile.central.detailPanels?.horizonCollapsed?'':'open'}>
      <summary>Horizontansicht</summary>
      <div class="chart-description">Objektbahn und persönlicher Horizont. Azimut wird sowohl in Grad als auch mit N, NO, O, SO, S, SW, W und NW beschriftet.</div>
      <canvas class="large-horizon-chart" width="1400" height="430"
        data-horizon="${encodeURIComponent(JSON.stringify(horizonPoints))}"
        data-track="${encodeURIComponent(JSON.stringify(altitudePoints.map(point=>[point[2],point[1],point[0]])))}"
        data-obstacles="${encodeURIComponent(JSON.stringify(obstacles))}"
        data-selected-start="${windowRange.start.getTime()}" data-selected-end="${windowRange.end.getTime()}"
        data-timezone="${esc(loc.timezone)}"></canvas>
    </details>
  </div>`;
}

function renderWeather(windowRange,summary,loc,night){
  const notice=weatherError?`<div class="notice warn">${esc(weatherError)}</div>`:'';
  if(!weatherModels.length)return`<section class="card"><h2>Wetter und Aufnahmequalität</h2>${notice}<div class="loading-card"><div class="spinner"></div><p>Wettermodelle werden geladen …</p></div></section>`;
  const selectedSummary=summary||weatherForWindow(windowRange);
  if(!selectedSummary)return`<section class="card"><h2>Wetter und Aufnahmequalität</h2>${notice}<div class="notice warn">Für diesen Planungszeitraum liegen noch keine stündlichen Modellwerte vor.</div></section>`;
  const unit=windUnitLabel();
  const fullNight={start:night.sunset,end:night.sunrise};
  const rows=weatherRowsForWindow(fullNight,currentWeatherView());
  const view=currentWeatherView();
  const modelWeights=profile.central.weatherModels?.weights||{};
  const weightText=Object.entries(WEATHER_MODEL_CONFIG).map(([key,cfg])=>`${cfg.name} ${Number(modelWeights[key]??0)} %`).join(' · ');
  const valueClass=(value,goodMin=70,warnMin=45)=>!Number.isFinite(value)?'':value>=goodMin?'good':value>=warnMin?'warn':'bad';
  const cloudClass=value=>thresholdClass(value,25,60,true);
  const dewClass=value=>thresholdClass(value,profile.central.dew.green,profile.central.dew.yellow,false);
  const jetClass=value=>thresholdClass(windFromKmh(value),profile.central.jet.green,profile.central.jet.yellow,true);
  const selectedJetClass=thresholdClass(selectedSummary.jet,profile.central.jet.green,profile.central.jet.yellow,true);
  return`<section class="card weather-card">
    <div class="section-title-row">
      <div><div class="eyebrow">Wettermodelle</div><h2>Wetter und Aufnahmequalität</h2></div>
      <div class="weather-model-summary"><strong>${esc(weatherViewLabel(view))}</strong><div class="small muted">${view==='consensus'?esc(weightText):'Einzelmodell ohne Mittelung'}</div></div>
    </div>
    ${notice}
    <div class="grid four weather-summary-grid">
      <div class="metric"><div class="label">Wolken gesamt</div><div class="value ${valueClass(100-selectedSummary.cloud)}">${fmt(selectedSummary.cloud)} %</div></div>
      <div class="metric"><div class="label">Transparenz-Tendenz</div><div class="value ${valueClass(selectedSummary.transparency)}">${fmt(selectedSummary.transparency)}/100</div></div>
      <div class="metric"><div class="label">Seeing-Tendenz</div><div class="value ${valueClass(selectedSummary.seeing)}">${fmt(selectedSummary.seeing)}/100</div></div>
      <div class="metric"><div class="label">Tauabstand</div><div class="value ${dewClass(selectedSummary.dewGap)}">${fmt(selectedSummary.dewGap,1)} °C</div></div>
      <div class="metric"><div class="label">Wind</div><div class="value ${windQualityClass(selectedSummary.windKmh)}">${fmt(selectedSummary.wind,1)} ${unit}</div></div>
      <div class="metric"><div class="label">Böen maximal</div><div class="value ${windQualityClass(selectedSummary.gustKmh,'gust')}">${fmt(selectedSummary.gust,1)} ${unit}</div></div>
      <div class="metric"><div class="label">Jetstream</div><div class="value ${selectedJetClass}">${fmt(selectedSummary.jet,1)} ${unit}</div></div>
      <div class="metric"><div class="label">Bewerteter Zeitraum</div><div class="value">${fmtTime(windowRange.start,loc.timezone)}–${fmtTime(windowRange.end,loc.timezone)}</div><div class="small muted">${esc(windowRange.label)}</div></div>
    </div>
    <details ${profile.central.collapsed.weather?'':'open'} id="weatherDetails">
      <summary>Stündlicher Verlauf von Sonnenuntergang bis Sonnenaufgang</summary>
      <div class="weather-scroll" style="margin-top:12px">
        <table class="weather-table weather-quality-table">
          <thead>
            <tr>
              <th rowspan="2">Uhrzeit</th><th rowspan="2">Qualität</th>
              <th colspan="4">Wolken</th><th rowspan="2">Temp.</th><th rowspan="2">Tauabstand</th>
              <th rowspan="2">Wind</th><th rowspan="2">Böen</th><th rowspan="2">Jetstream</th>
              <th rowspan="2">Seeing*</th><th rowspan="2">Transparenz*</th>
            </tr>
            <tr><th>gesamt</th><th>tief</th><th>mittel</th><th>hoch</th></tr>
          </thead>
          <tbody>${rows.map(row=>{
            const score=weatherHourScore(row);
            const rowInSelected=row.time>=windowRange.start&&row.time<=windowRange.end;
            return`<tr class="${rowInSelected?'selected-window-hour':''}">
              <td><strong>${fmtTime(row.time,loc.timezone)}</strong></td>
              <td><span class="quality-pill ${scoreClass(score)}">${fmt(score)}</span></td>
              <td class="weather-cell ${cloudClass(row.cloud)}">${fmt(row.cloud)} %</td>
              <td class="weather-cell ${cloudClass(row.cloudLow)}">${fmt(row.cloudLow)} %</td>
              <td class="weather-cell ${cloudClass(row.cloudMid)}">${fmt(row.cloudMid)} %</td>
              <td class="weather-cell ${cloudClass(row.cloudHigh)}">${fmt(row.cloudHigh)} %</td>
              <td>${fmt(row.temperature,1)} °C</td>
              <td class="weather-cell ${dewClass(row.dewGap)}">${fmt(row.dewGap,1)} °C</td>
              <td class="weather-cell ${windQualityClass(row.wind)}">${fmt(windFromKmh(row.wind),1)} ${unit}</td>
              <td class="weather-cell ${windQualityClass(row.gust,'gust')}">${fmt(windFromKmh(row.gust),1)} ${unit}</td>
              <td class="weather-cell ${jetClass(row.jet)}">${fmt(windFromKmh(row.jet),1)} ${unit}</td>
              <td class="weather-cell ${valueClass(row.seeing)}"><span class="quality-pill ${valueClass(row.seeing)}">${fmt(row.seeing)}</span></td>
              <td class="weather-cell ${valueClass(row.transparency)}"><span class="quality-pill ${valueClass(row.transparency)}">${fmt(row.transparency)}</span></td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>
      <div class="small muted weather-footnote">Die farbliche Bewertung bezieht sich auf die erwartete Aufnahmequalität. Der aktuell gewählte Planungszeitraum ist in der Tabelle hervorgehoben. * Seeing und Transparenz sind abgeleitete Tendenzen, keine gemessenen Bogensekundenwerte.</div>
    </details>
  </section>`;
}
function renderFraming(o,windowRange,loc){
  const setup=fov();
  const aspect=2.15;
  const setupW=setup?.width||1.5;
  const setupH=setup?.height||1;
  const objectW=Math.max(.02,(Number(o.majorArcMin)||1)/60);
  const objectH=Math.max(.02,(Number(o.minorArcMin)||Number(o.majorArcMin)||1)/60);
  const targetFov=clamp(Math.max(setupW,setupH*aspect,objectW,objectH*aspect,.08)*1.35,.08,120);
  const time=new Date(windowRange.start.getTime()+(windowRange.end-windowRange.start)*clamp(Number(profile.planning.timeFraction)||0,0,1));
  const currentAltitude=altitude(o.raHours,o.decDeg,time,loc.latitude,loc.longitude);
  const currentAzimuth=azimuth(o.raHours,o.decDeg,time,loc.latitude,loc.longitude);
  const query=new URLSearchParams({ra:String(o.raHours*15),dec:String(o.decDeg),fov:String(targetFov),survey:'P/DSS2/color'}).toString();
  return`<section class="object-detail-section framing-section" id="framingCard">
    <div class="section-title-row">
      <div><div class="eyebrow">Interaktives Himmelsbild</div><h3>Rahmung: ${esc(o.id)} · ${esc(o.name)}</h3><div class="muted">${esc(o.type)} · ${fmt(o.majorArcMin)}′ × ${fmt(o.minorArcMin)}′</div></div>
      <select id="framingObjectSelect" aria-label="Objekt für Rahmung">${catalog.slice().sort((a,b)=>a.id.localeCompare(b.id,'de',{numeric:true})).map(x=>`<option value="${esc(x.id)}" ${x.id===o.id?'selected':''}>${esc(x.id)} · ${esc(x.name)}</option>`).join('')}</select>
    </div>
    <div class="framing-view" data-target-fov="${targetFov}">
      <iframe title="Aladin Lite – ${esc(o.id)}" src="aladin-frame.html?${query}" loading="eager"></iframe>
      <div class="frame-overlay framing-scaled-overlay" data-width-deg="${setupW}" data-height-deg="${setupH}" data-rotation="${Number(profile.planning.frameRotation)||0}" style="display:${profile.central.frameVisible&&setup?'block':'none'}"></div>
      <div class="object-overlay framing-scaled-overlay" data-width-deg="${objectW}" data-height-deg="${objectH}" data-base-rotation="${Number(o.positionAngleDeg)||0}" data-rotation="${(Number(profile.planning.objectRotation)||0)+(Number(o.positionAngleDeg)||0)}" style="display:${profile.central.objectSizeVisible?'block':'none'}"></div>
      <div class="framing-info">
        <div><strong>${fmtTime(time,loc.timezone)}</strong><br>Höhe ${fmt(currentAltitude)}° · ${cardinal(currentAzimuth)}</div>
        <div>${setup?`Setup ${fmt(setup.width,2)}° × ${fmt(setup.height,2)}°<br>${fmt(setup.pixelScale,2)}″/px`:'Kein Setup gewählt'}</div>
      </div>
    </div>
    <div class="framing-controls">
      <label class="chip"><input id="frameVisible" type="checkbox" ${profile.central.frameVisible?'checked':''}>Setup-Rahmen anzeigen</label>
      <label>Kamerarotation <span id="frameRotationValue">${fmt(profile.planning.frameRotation)}°</span><input id="frameRotation" type="range" min="0" max="180" value="${profile.planning.frameRotation}"></label>
      <label class="chip"><input id="objectSizeVisible" type="checkbox" ${profile.central.objectSizeVisible?'checked':''}>Objektgröße anzeigen</label>
      <label>Objektrotation <span id="objectRotationValue">${fmt(profile.planning.objectRotation)}°</span><input id="objectRotation" class="short-range" type="range" min="0" max="180" value="${profile.planning.objectRotation}"></label>
      <label class="framing-time-control">Zeit im Planungsfenster <span id="framingTimeValue">${fmtTime(time,loc.timezone)}</span><input id="framingTime" type="range" min="0" max="100" value="${profile.planning.timeFraction*100}"></label>
    </div>
  </section>`;
}
function renderMeteoblue(loc){const q=encodeURIComponent(`${loc.name} ${loc.latitude},${loc.longitude}`);return`<section class="card"><details ${profile.central.meteoblueCollapsed?'':'open'} id="meteoblueDetails"><summary><strong>Meteoblue Astronomy Seeing</strong> · unabhängige Kontrollvorhersage</summary><div class="notice" style="margin-top:12px">Meteoblue wird bewusst nicht in die automatische Modellbewertung eingerechnet.</div><iframe title="Meteoblue Astronomy Seeing" src="https://www.meteoblue.com/de/wetter/outdoorsports/seeing/${q}" style="width:100%;height:720px;border:0;border-radius:12px;margin-top:12px;background:white"></iframe></details></section>`}

function renderSettings(){return`<div data-page="settings"><section class="card"><div class="section-title-row"><div><h2>Einstellungen</h2><div class="muted">Lokales Profil „${esc(profile.name)}“ · Speicherung in IndexedDB</div></div>${renderProfileBar()}</div><div class="settings-tabs" style="margin-top:16px">${[['equipment','Ausrüstung'],['central','Zentrale Einstellungen'],['locations','Standorte & Horizont'],['info','Info']].map(([k,n])=>`<button data-settings-tab="${k}" class="${currentSettingsTab===k?'active':''} ${dirtySections.has(k)?'dirty-dot':''}">${n}</button>`).join('')}</div></section><section class="settings-section ${currentSettingsTab==='equipment'?'active':''}">${renderEquipment()}</section><section class="settings-section ${currentSettingsTab==='central'?'active':''}">${renderCentral()}</section><section class="settings-section ${currentSettingsTab==='locations'?'active':''}">${renderLocations()}</section><section class="settings-section ${currentSettingsTab==='info'?'active':''}">${renderInfo()}</section></div>`}
function renderProfileBar(){return`<div class="profile-bar"><select id="settingsProfileSelect">${profiles.map(p=>`<option value="${esc(p.id)}" ${p.id===profile.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select><button id="newProfile">Neu</button><button id="duplicateProfile">Duplizieren</button><button id="renameProfile">Umbenennen</button><button id="deleteProfile" class="danger" ${profiles.length===1?'disabled':''}>Löschen</button></div>`}
function renderEquipment(){return`<div class="card"><div class="section-title-row"><h2>Teleskope</h2><button id="addTelescope">Teleskop hinzufügen</button></div><div class="equipment-list">${draft.equipment.telescopes.map(s=>`<div class="equipment-row" data-scope-row="${s.id}"><label>Name<input data-scope="name" value="${esc(s.name)}"></label><label>Brennweite mm<input data-scope="focalLength" type="number" value="${s.focalLength}"></label><label>Öffnung mm<input data-scope="aperture" type="number" value="${s.aperture||''}"></label><label class="chip"><input data-selected-scope type="radio" name="selectedScope" value="${s.id}" ${draft.equipment.selectedTelescopeId===s.id?'checked':''}>Aktiv</label><button data-delete-scope="${s.id}" class="danger">Entfernen</button></div>`).join('')}</div><div class="divider"></div><div class="section-title-row"><h2>Kameras</h2><button id="addCamera">Kamera hinzufügen</button></div><div class="equipment-list">${draft.equipment.cameras.map(c=>`<div class="equipment-row" data-camera-row="${c.id}"><label>Name<input data-camera="name" value="${esc(c.name)}"></label><label>Sensorbreite mm<input data-camera="sensorWidth" type="number" step="0.01" value="${c.sensorWidth}"></label><label>Sensorhöhe mm<input data-camera="sensorHeight" type="number" step="0.01" value="${c.sensorHeight}"></label><label>Pixel µm<input data-camera="pixelSize" type="number" step="0.01" value="${c.pixelSize}"></label><label class="chip"><input data-selected-camera type="radio" name="selectedCamera" value="${c.id}" ${draft.equipment.selectedCameraId===c.id?'checked':''}>Aktiv</label><button data-delete-camera="${c.id}" class="danger">Entfernen</button></div>`).join('')}</div><div class="divider"></div><div class="section-title-row"><span class="save-state">${dirtySections.has('equipment')?'Ungespeicherte Änderungen':'Gespeichert'}</span><button data-save-section="equipment" class="primary">Ausrüstung speichern</button></div></div>`}
function renderCentral(){
  const c=draft.central;
  const total=Object.values(c.weights).reduce((a,b)=>a+Number(b||0),0);
  const weatherTotal=Object.values(c.weatherModels?.weights||{}).reduce((a,b)=>a+Number(b||0),0);
  return`<div class="card">
    <div class="section-title-row"><h2>Wind und Aufnahmequalität</h2><span class="save-state">${dirtySections.has('centralWind')?'Ungespeicherte Änderungen':'Gespeichert'}</span></div>
    <div class="grid two">
      <label>Einheit für Wind, Böen und Jetstream<select id="windUnit"><option value="kmh" ${c.windUnit==='kmh'?'selected':''}>km/h</option><option value="ms" ${c.windUnit==='ms'?'selected':''}>m/s</option></select></label>
      <label>Aktives Aufnahmequalitätsprofil<select id="activeWindProfile">${Object.entries(c.windProfiles).map(([key,value])=>`<option value="${key}" ${c.activeWindProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label>
    </div>
    <div class="grid three" style="margin-top:12px">${Object.entries(c.windProfiles).map(([key,value])=>`<div class="metric"><strong>${esc(value.name)}</strong>
      <label>Wind grün unter (${windUnitLabel(c.windUnit)})<input data-wind-profile="${key}" data-field="windGreen" type="number" value="${value.windGreen}"></label>
      <label>Wind gelb bis (${windUnitLabel(c.windUnit)})<input data-wind-profile="${key}" data-field="windYellow" type="number" value="${value.windYellow}"></label>
      <label>Böen grün unter (${windUnitLabel(c.windUnit)})<input data-wind-profile="${key}" data-field="gustGreen" type="number" value="${value.gustGreen}"></label>
      <label>Böen gelb bis (${windUnitLabel(c.windUnit)})<input data-wind-profile="${key}" data-field="gustYellow" type="number" value="${value.gustYellow}"></label>
    </div>`).join('')}</div>
    <div class="grid two" style="margin-top:12px">
      <div class="metric"><strong>Tauabstand</strong><label>Grün über (°C)<input id="dewGreen" type="number" value="${c.dew.green}"></label><label>Gelb ab (°C)<input id="dewYellow" type="number" value="${c.dew.yellow}"></label></div>
      <div class="metric"><strong>Jetstream</strong><label>Grün unter (${windUnitLabel(c.windUnit)})<input id="jetGreen" type="number" value="${c.jet.green}"></label><label>Gelb bis (${windUnitLabel(c.windUnit)})<input id="jetYellow" type="number" value="${c.jet.yellow}"></label></div>
    </div>
    <div class="section-title-row" style="margin-top:14px"><span></span><button data-save-section="centralWind" class="primary">Rubrik speichern</button></div>
  </div>
  <div class="card">
    <div class="section-title-row"><div><h2>Wettermodelle</h2><div class="small muted">Gewichtung für den Modellkonsens je Prognosestunde</div></div><span class="weight-total ${weatherTotal===100?'ok':'error'}">Summe: ${weatherTotal} %</span></div>
    <div class="notice">Der Modellkonsens mittelt DWD ICON, ECMWF IFS und NOAA GFS nach diesen Anteilen. Default: 40 % / 40 % / 20 %.</div>
    <div class="grid three" style="margin-top:12px">${Object.entries(WEATHER_MODEL_CONFIG).map(([key,value])=>`<label>${esc(value.name)} (%)<input data-weather-weight="${key}" type="number" min="0" max="100" step="1" value="${Number(c.weatherModels?.weights?.[key]??value.defaultWeight)}"></label>`).join('')}</div>
    <div class="grid two" style="margin-top:12px">
      <label>Standarddarstellung in der Planung<select id="defaultWeatherView">${WEATHER_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.weatherModels?.defaultView===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <div class="notice good">In der Planung kann temporär auf ein einzelnes Modell umgeschaltet und die Auswahl dort als neuer Standard übernommen werden.</div>
    </div>
    <div class="section-title-row" style="margin-top:14px"><span class="save-state">${dirtySections.has('weatherModels')?'Ungespeicherte Änderungen':'Gespeichert'}</span><button data-save-section="weatherModels" class="primary" ${weatherTotal!==100?'disabled':''}>Wettermodelle speichern</button></div>
  </div>
  <div class="card">
    <div class="section-title-row"><h2>Deep-Sky-Gewichtung</h2><span class="weight-total ${total===100?'ok':'error'}">Summe: ${total} %</span></div>
    <div class="notice">Nur ganzzahlige Eingabefelder. Speichern ist nur bei exakt 100 % möglich.</div>
    <div class="weight-grid" style="margin-top:12px">${Object.entries({clouds:'Wolken',transparency:'Transparenz',seeing:'Seeing',wind:'Wind/Böen',dew:'Tauabstand',moon:'Mond',altitude:'Objekthöhe',duration:'Sichtbarkeitsdauer'}).map(([key,name])=>`<label>${name} (%)<input data-weight="${key}" type="number" min="0" max="100" step="1" value="${c.weights[key]}"></label>`).join('')}</div>
    <div class="section-title-row" style="margin-top:14px"><span class="save-state">${dirtySections.has('weights')?'Ungespeicherte Änderungen':'Gespeichert'}</span><button data-save-section="weights" class="primary" ${total!==100?'disabled':''}>Gewichtung speichern</button></div>
  </div>
  <div class="card">
    <div class="section-title-row"><h2>Anzeige und Planung</h2><span class="save-state">${dirtySections.has('display')?'Ungespeicherte Änderungen':'Gespeichert'}</span></div>
    <div class="grid two">
      <label>Standard-Planungszeitraum<select id="defaultPlanningWindow">${[['sunset','Sonnenuntergang–Sonnenaufgang'],['civil','Bürgerliche Nacht'],['nautical','Nautischer Planungszeitraum'],['astronomicalTwilight','Nautisch + astronomisch'],['astronomicalNight','Astronomische Nacht']].map(([key,name])=>`<option value="${key}" ${c.defaultPlanningWindow===key?'selected':''}>${name}</option>`).join('')}</select></label>
      <label>Darstellungsprofil – Aktiv<select id="activeDisplayProfile">${Object.entries(c.listDisplay.profiles).map(([key,value])=>`<option value="${key}" ${c.listDisplay.activeProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label>
    </div>
    <div class="grid three" style="margin-top:12px">${Object.entries(c.listDisplay.profiles).map(([key,value])=>`<div class="metric"><strong>${esc(value.name)}</strong><label>Objekte/Seite<select data-display-page-size="${key}">${[10,20,50,100].map(number=>`<option ${value.pageSize===number?'selected':''}>${number}</option>`).join('')}</select></label><div class="small muted" style="margin:8px 0">Sichtbare Spalten</div>${DISPLAY_COLUMNS.map(([id,name])=>`<label class="chip"><input type="checkbox" data-display-column-profile="${key}" data-column="${id}" ${value.columns.includes(id)?'checked':''}>${name}</label>`).join('')}</div>`).join('')}</div>
    <div class="grid two" style="margin-top:12px">
      <label class="chip"><input id="defaultFrameVisible" type="checkbox" ${c.frameVisible?'checked':''}>Setup-Rahmen standardmäßig anzeigen</label>
      <label class="chip"><input id="defaultObjectVisible" type="checkbox" ${c.objectSizeVisible?'checked':''}>Objektgröße standardmäßig anzeigen</label>
      <label class="chip"><input id="defaultMeteoblueCollapsed" type="checkbox" ${c.meteoblueCollapsed?'checked':''}>Meteoblue standardmäßig eingeklappt</label>
      <label class="chip"><input id="defaultAltitudeCollapsed" type="checkbox" ${c.detailPanels?.altitudeCollapsed?'checked':''}>Höhenkurve initial eingeklappt</label>
      <label class="chip"><input id="defaultHorizonCollapsed" type="checkbox" ${c.detailPanels?.horizonCollapsed?'checked':''}>Horizontansicht initial eingeklappt</label>
    </div>
    <div class="section-title-row" style="margin-top:14px"><button id="resetDisplayProfiles">Auf Standard zurücksetzen</button><button data-save-section="display" class="primary">Rubrik speichern</button></div>
  </div>`;
}
function renderLocations(){
  const loc=draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0];
  const dirs=['N','NO','O','SO','S','SW','W','NW'];
  const horizonPoints=Array.from({length:73},(_,index)=>{
    const azimuth=index*5;
    const position=azimuth/45;
    const lower=Math.floor(position)%8;
    const upper=(lower+1)%8;
    const fraction=position-Math.floor(position);
    const altitude=(Number(loc.horizon?.[lower])||0)*(1-fraction)+(Number(loc.horizon?.[upper])||0)*fraction;
    return[azimuth,altitude];
  });
  const obstacles=(loc.obstacles||[]).map(item=>({name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0}));
  return`<div class="card">
    <div class="section-title-row"><h2>Gespeicherte Aufnahmeorte</h2><button id="addLocation">Standort hinzufügen</button></div>
    <div class="toolbar">
      <label>Standort<select id="locationSelect">${draft.locations.map(item=>`<option value="${item.id}" ${item.id===loc.id?'selected':''}>${esc(item.name)}</option>`).join('')}</select></label>
      <label>Standardstandort<select id="defaultLocationSelect">${draft.locations.map(item=>`<option value="${item.id}" ${item.id===draft.central.defaultLocationId?'selected':''}>${esc(item.name)}</option>`).join('')}</select></label>
      <label>GPS-Verhalten<select id="gpsBehavior"><option value="last" ${draft.central.gpsBehavior==='last'?'selected':''}>Letzten Standort verwenden</option><option value="default" ${draft.central.gpsBehavior==='default'?'selected':''}>Immer Standardstandort</option><option value="ask" ${draft.central.gpsBehavior==='ask'?'selected':''}>Bei jedem Start fragen</option></select></label>
    </div>
    <div class="grid two" style="margin-top:12px">
      <label>Name<input id="locName" value="${esc(loc.name)}"></label>
      <label>Zeitzone<input id="locTimezone" value="${esc(loc.timezone)}"></label>
      <label>Breitengrad (°)<input id="locLat" type="number" step="0.0001" value="${loc.latitude}"></label>
      <label>Längengrad (°)<input id="locLon" type="number" step="0.0001" value="${loc.longitude}"></label>
      <label>Höhe über Meer (m)<input id="locElevation" type="number" value="${loc.elevation||0}"></label>
      <div class="inline" style="align-self:end"><button id="useGps">GPS verwenden</button><button id="searchLocation">Ort suchen</button><button id="deleteLocation" class="danger" ${draft.locations.length===1?'disabled':''}>Standort löschen</button></div>
    </div>
  </div>
  <div class="card">
    <div class="section-title-row"><div><div class="eyebrow">Persönlicher Horizont</div><h2>${esc(loc.name)}</h2></div><span class="save-state">${dirtySections.has('locations')?'Ungespeicherte Änderungen':'Gespeichert'}</span></div>
    <canvas class="settings-horizon-chart" width="1400" height="390"
      data-horizon="${encodeURIComponent(JSON.stringify(horizonPoints))}"
      data-obstacles="${encodeURIComponent(JSON.stringify(obstacles))}"></canvas>
    <div class="horizon-grid" style="margin-top:16px">${dirs.map((direction,index)=>`<label><span class="direction-label">${index*45}° = ${direction}</span>Horizonthöhe (°)<input data-horizon="${index}" type="number" min="0" max="90" value="${loc.horizon[index]||0}"></label>`).join('')}</div>
    <div class="divider"></div>
    <div class="section-title-row"><h3>Hindernisse</h3><button id="addObstacle">Hindernis hinzufügen</button></div>
    <div class="obstacle-list">${loc.obstacles.map(item=>`<div class="obstacle-row" data-obstacle="${item.id}"><label>Bezeichnung<input data-obstacle-field="name" value="${esc(item.name)}"></label><label>Azimut (°)<input data-obstacle-field="azimuth" type="number" min="0" max="360" value="${item.azimuth}"></label><label>Höhe (°)<input data-obstacle-field="altitude" type="number" min="0" max="90" value="${item.altitude}"></label><button data-delete-obstacle="${item.id}" class="danger">Entfernen</button></div>`).join('')||'<div class="muted">Keine zusätzlichen Hindernisse erfasst.</div>'}</div>
    <div class="section-title-row" style="margin-top:14px"><span></span><button data-save-section="locations" class="primary">Standort und Horizont speichern</button></div>
  </div>`;
}
function renderInfo(){
  return`<div class="card"><h2>Astro Night Planner 1.0</h2><p>Stabile, installierbare PWA für Nachtplanung, astronomisches Wetter, Mond und Dämmerung, Deep-Sky-Auswahl, persönliche Ausrüstung, Standorte, Horizont und Rahmung.</p><div class="storage-status"><div class="metric"><div class="label">Umgebung</div><div class="value">${ENV==='prod'?'Produktion':'Test'}</div></div><div class="metric"><div class="label">Datenbank</div><div class="value small">${DB_NAME}</div></div><div class="metric"><div class="label">Version</div><div class="value">${APP_VERSION}</div></div></div></div>
  <div class="card"><h2>Profile, Sicherung und Wiederherstellung</h2><div class="data-actions"><button id="exportProfile">Aktuelles Profil exportieren</button><button id="exportAll">Komplette Sicherung exportieren</button><button id="importProfile">Profil/Sicherung importieren</button><button id="requestPersistence">Persistenten Speicher anfordern</button></div><div id="storageMessage" class="notice" style="margin-top:12px">Die Daten liegen lokal im Browser. Test- und Produktivversion verwenden getrennte Datenbanken und Caches.</div></div>
  <div class="card help-article"><h2>Browserbasierte Hilfe</h2><div class="help-toc"><a href="#help-plan">Planung</a><a href="#help-weather">Wetter</a><a href="#help-objects">Objektliste</a><a href="#help-framing">Rahmung</a><a href="#help-horizon">Horizont</a><a href="#help-profiles">Profile & Sicherung</a><a href="docs/ASTRO_NIGHT_PLANNER_HANDBUCH.html" target="_blank">Handbuch öffnen</a></div>
  <section id="help-plan"><h3>Planung</h3><p>Wähle Standort, Datum und Planungszeitraum direkt in der Planungsansicht. Die Auswahl steuert Objektbewertung, Wetterbewertung und sämtliche Höhenprofile. Der unter „Zentrale Einstellungen“ gespeicherte Standard wird unmittelbar auf die Planung angewendet.</p></section>
  <section id="help-weather"><h3>Wetter</h3><p>Der Standard „Modellkonsens“ bildet je Prognosestunde einen gewichteten Wert aus DWD ICON, ECMWF IFS und NOAA GFS. Die Gewichte werden unter „Zentrale Einstellungen → Wettermodelle“ festgelegt. In der Planung kann vorübergehend auf ein einzelnes Modell umgeschaltet und diese Auswahl als Standard gespeichert werden. Meteoblue steht direkt unter den übrigen Wetterdaten als unabhängige Kontrollansicht.</p></section>
  <section id="help-objects"><h3>Objektliste und Details</h3><p>Ein Klick auf eine beliebige freie Stelle einer Objektzeile öffnet die Details unmittelbar unter dieser Zeile. Mit „Details schließen“ oder einem erneuten Klick auf dieselbe Zeile wird die Ansicht geschlossen. Höhenkurve und Horizontansicht sind auf- und zuklappbar; ihr initialer Zustand wird in den zentralen Anzeigeeinstellungen festgelegt.</p></section>
  <section id="help-framing"><h3>Rahmung</h3><p>Aladin Lite wird auf die Koordinaten des gewählten Objekts zentriert und so gezoomt, dass Setup-Rahmen beziehungsweise Objektgröße sichtbar sind. Setup-Rahmen und Objektellipse lassen sich unabhängig ein- oder ausblenden und getrennt rotieren.</p></section>
  <section id="help-horizon"><h3>Persönlicher Horizont</h3><p>Unter „Standorte & Horizont“ zeigt eine Vorschaugrafik den aus den acht Richtungswerten und den Hindernissen entstehenden Horizont. Große Höhen- und Horizontgrafiken beschriften den Azimut sowohl in Grad als auch mit N, NO, O, SO, S, SW, W und NW.</p></section>
  <section id="help-profiles"><h3>Profile und Datensicherung</h3><p>Jedes lokale Benutzerprofil enthält Ausrüstung, Standorte, Horizont, Filter, Wettermodellgewichte, Darstellungsprofile und Anzeigeoptionen. Exportiere regelmäßig eine vollständige Sicherung.</p></section></div>`;
}

async function setObjectDetails(objectId,open=true,scroll=true){
  profile.planning.selectedObjectId=objectId;
  profile.planning.detailsOpen=open;
  await saveProfile();
  render();
  if(scroll){
    requestAnimationFrame(()=>{
      const row=[...document.querySelectorAll('[data-object-row]')].find(item=>item.dataset.objectRow===objectId);
      (open?row?.nextElementSibling:row)?.scrollIntoView({behavior:'smooth',block:open?'nearest':'center'});
    });
  }
}

function bindRendered(){
  document.querySelectorAll('[data-date]').forEach(button=>button.onclick=async()=>{
    selectedDateKey=button.dataset.date;
    profile.planning.dateKey=selectedDateKey;
    profile.planning.detailsOpen=false;
    page=1;
    await saveProfile();
    render();
    fetchWeather();
  });
  document.getElementById('weatherRefresh')?.addEventListener('click',fetchWeather);
  const planningWindowTop=document.getElementById('planningWindowTop');
  if(planningWindowTop)planningWindowTop.onchange=async()=>{
    profile.planning.planningWindow=planningWindowTop.value;
    profile.planning.detailsOpen=false;
    page=1;
    await saveProfile();
    render();
  };
  const immediate=[
    ['objectSearch','search','value'],['maxMagnitude','maxMagnitude','number'],['minAltitude','minAltitude','number'],
    ['minVisibleHours','minVisibleHours','number'],['minMoonDistance','minMoonDistance','number'],
    ['minSize','minSize','number'],['maxSize','maxSize','number'],['onlyFits','onlyFits','checked']
  ];
  for(const[id,key,type]of immediate){
    const element=document.getElementById(id);
    if(!element)continue;
    element.addEventListener(id==='objectSearch'?'input':'change',async()=>{
      profile.planning[key]=type==='number'?Number(element.value):type==='checked'?element.checked:element.value;
      profile.planning.detailsOpen=false;
      page=1;
      await saveProfile();
      render();
    });
  }
  document.querySelectorAll('[data-catalog]').forEach(element=>element.onchange=async()=>{
    profile.planning.catalogs=element.checked?[...new Set([...profile.planning.catalogs,element.dataset.catalog])]:profile.planning.catalogs.filter(item=>item!==element.dataset.catalog);
    profile.planning.detailsOpen=false;
    page=1;
    await saveProfile();
    render();
  });
  document.querySelectorAll('[data-object-type]').forEach(element=>element.onchange=async()=>{
    profile.planning.types=element.checked?[...new Set([...profile.planning.types,element.dataset.objectType])]:profile.planning.types.filter(item=>item!==element.dataset.objectType);
    profile.planning.detailsOpen=false;
    page=1;
    await saveProfile();
    render();
  });
  document.querySelectorAll('[data-page-number]').forEach(button=>button.onclick=async()=>{
    page=clamp(Number(button.dataset.pageNumber),1,999);
    profile.planning.page=page;
    profile.planning.detailsOpen=false;
    await saveProfile();
    render();
    document.querySelector('.object-table-wrap')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
  document.querySelectorAll('#pageSizeSelect').forEach(select=>{
    select.value=String(profile.planning.pageSize);
    select.onchange=async()=>{
      const key=currentDisplayProfile();
      profile.central.listDisplay.profiles[key].pageSize=Number(select.value);
      profile.planning.pageSize=Number(select.value);
      profile.planning.detailsOpen=false;
      page=1;
      await saveProfile();
      render();
    };
  });
  document.querySelectorAll('[data-object-row]').forEach(row=>{
    const activate=event=>{
      if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
      if(event.target.closest('button,input,select,a,label'))return;
      event.preventDefault();
      const sameOpen=profile.planning.detailsOpen&&profile.planning.selectedObjectId===row.dataset.objectRow;
      setObjectDetails(row.dataset.objectRow,!sameOpen,true);
    };
    row.addEventListener('click',activate);
    row.addEventListener('keydown',activate);
  });
  document.querySelectorAll('[data-frame-object]').forEach(button=>button.onclick=event=>{
    event.stopPropagation();
    setObjectDetails(button.dataset.frameObject,true,true);
  });
  document.querySelectorAll('[data-close-object-details]').forEach(button=>button.onclick=async event=>{
    event.stopPropagation();
    profile.planning.detailsOpen=false;
    await saveProfile();
    render();
    requestAnimationFrame(()=>{
      [...document.querySelectorAll('[data-object-row]')].find(item=>item.dataset.objectRow===profile.planning.selectedObjectId)?.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });
  bindPlanProfiles();
  bindFraming();
  bindDetails();
  bindSettings();
}
function bindPlanProfiles(){
  const wind=document.getElementById('planWindProfile');
  const display=document.getElementById('planDisplayProfile');
  const weather=document.getElementById('planWeatherView');
  if(wind)wind.onchange=async()=>{profile.planning.temporaryWindProfile=wind.value||null;await saveProfile();render()};
  if(display)display.onchange=async()=>{profile.planning.temporaryDisplayProfile=display.value||null;profile.planning.detailsOpen=false;page=1;await saveProfile();render()};
  if(weather)weather.onchange=async()=>{profile.planning.temporaryWeatherView=weather.value||null;await saveProfile();render()};
  document.getElementById('makeWindDefault')?.addEventListener('click',async()=>{
    if(!profile.planning.temporaryWindProfile)return;
    profile.central.activeWindProfile=profile.planning.temporaryWindProfile;
    profile.planning.temporaryWindProfile=null;
    await saveProfile();
    draft=deepClone(profile);
    render();
  });
  document.getElementById('makeDisplayDefault')?.addEventListener('click',async()=>{
    if(!profile.planning.temporaryDisplayProfile)return;
    profile.central.listDisplay.activeProfile=profile.planning.temporaryDisplayProfile;
    profile.planning.temporaryDisplayProfile=null;
    profile.planning.detailsOpen=false;
    page=1;
    await saveProfile();
    draft=deepClone(profile);
    render();
  });
  document.getElementById('makeWeatherDefault')?.addEventListener('click',async()=>{
    if(!profile.planning.temporaryWeatherView)return;
    profile.central.weatherModels.defaultView=profile.planning.temporaryWeatherView;
    profile.planning.temporaryWeatherView=null;
    await saveProfile();
    draft=deepClone(profile);
    render();
  });
}
function bindFraming(){
  const select=document.getElementById('framingObjectSelect');
  if(select)select.onchange=async()=>{
    const objectIndex=currentComputedObjects.findIndex(item=>item.object.id===select.value);
    if(objectIndex>=0){
      const displayProfile=profile.central.listDisplay.profiles[currentDisplayProfile()]||DISPLAY_PROFILES.standard;const size=Math.max(1,Number(displayProfile.pageSize)||Number(profile.planning.pageSize)||20);
      page=Math.floor(objectIndex/size)+1;
      profile.planning.page=page;
    }
    profile.planning.selectedObjectId=select.value;
    profile.planning.detailsOpen=true;
    await saveProfile();
    render();
    requestAnimationFrame(()=>document.getElementById(`objectDetail-${select.value}`)?.scrollIntoView({behavior:'smooth',block:'nearest'}));
  };
  const frameVisible=document.getElementById('frameVisible');
  if(frameVisible)frameVisible.onchange=async()=>{
    profile.central.frameVisible=frameVisible.checked;
    await saveProfile();
    draft=deepClone(profile);
    render();
  };
  const objectVisible=document.getElementById('objectSizeVisible');
  if(objectVisible)objectVisible.onchange=async()=>{
    profile.central.objectSizeVisible=objectVisible.checked;
    await saveProfile();
    draft=deepClone(profile);
    render();
  };
  const bindRange=(id,key,scale,labelId,suffix='°')=>{
    const element=document.getElementById(id);
    const label=document.getElementById(labelId);
    if(!element)return;
    element.oninput=()=>{
      const value=Number(element.value)*scale;
      profile.planning[key]=value;
      if(label)label.textContent=id==='framingTime'?`${Math.round(value*100)} %`:`${fmt(value)}${suffix}`;
      if(key==='frameRotation'||key==='objectRotation'){
        const overlays=document.querySelectorAll(key==='frameRotation'?'.frame-overlay':'.object-overlay');
        overlays.forEach(overlay=>{
          const extra=key==='objectRotation'?Number(overlay.dataset.baseRotation||0):0;
          overlay.dataset.rotation=String(value+extra);
        });
        layoutFramingOverlays();
      }
    };
    element.onchange=async()=>{profile.planning[key]=Number(element.value)*scale;await saveProfile();render()};
  };
  bindRange('frameRotation','frameRotation',1,'frameRotationValue');
  bindRange('objectRotation','objectRotation',1,'objectRotationValue');
  bindRange('framingTime','timeFraction',.01,'framingTimeValue','');
}
function bindDetails(){const f=document.getElementById('filterDetails');if(f)f.ontoggle=async()=>{profile.central.collapsed.filters=!f.open;await saveProfile()};const w=document.getElementById('weatherDetails');if(w)w.ontoggle=async()=>{profile.central.collapsed.weather=!w.open;await saveProfile()};const m=document.getElementById('meteoblueDetails');if(m)m.ontoggle=async()=>{profile.central.meteoblueCollapsed=!m.open;await saveProfile();draft=deepClone(profile)}}
function bindSettings(){
  document.querySelectorAll('[data-settings-tab]').forEach(b=>b.onclick=async()=>{currentSettingsTab=b.dataset.settingsTab;profile.ui.settingsTab=currentSettingsTab;await saveProfile();render()});
  const ps=document.getElementById('settingsProfileSelect');if(ps)ps.onchange=()=>{document.getElementById('headerProfileSelect').value=ps.value;document.getElementById('headerProfileSelect').dispatchEvent(new Event('change'))};
  document.getElementById('newProfile')?.addEventListener('click',createProfile);document.getElementById('duplicateProfile')?.addEventListener('click',duplicateProfile);document.getElementById('renameProfile')?.addEventListener('click',renameProfile);document.getElementById('deleteProfile')?.addEventListener('click',deleteProfile);
  bindEquipmentDraft();bindCentralDraft();bindLocationDraft();bindInfoActions();
  document.querySelectorAll('[data-save-section]').forEach(b=>b.onclick=()=>saveDraftSection(b.dataset.saveSection));
}
function markDirty(section){dirtySections.add(section);render()}
function bindEquipmentDraft(){document.querySelectorAll('[data-scope-row]').forEach(row=>row.querySelectorAll('[data-scope]').forEach(e=>e.onchange=()=>{const s=draft.equipment.telescopes.find(x=>x.id===row.dataset.scopeRow);s[e.dataset.scope]=e.type==='number'?Number(e.value):e.value;dirtySections.add('equipment')}));document.querySelectorAll('[data-camera-row]').forEach(row=>row.querySelectorAll('[data-camera]').forEach(e=>e.onchange=()=>{const c=draft.equipment.cameras.find(x=>x.id===row.dataset.cameraRow);c[e.dataset.camera]=e.type==='number'?Number(e.value):e.value;dirtySections.add('equipment')}));document.querySelectorAll('[data-selected-scope]').forEach(e=>e.onchange=()=>{draft.equipment.selectedTelescopeId=e.value;dirtySections.add('equipment')});document.querySelectorAll('[data-selected-camera]').forEach(e=>e.onchange=()=>{draft.equipment.selectedCameraId=e.value;dirtySections.add('equipment')});document.getElementById('addTelescope')?.addEventListener('click',()=>{const id=uid('scope');draft.equipment.telescopes.push({id,name:'Neues Teleskop',focalLength:500,aperture:80});draft.equipment.selectedTelescopeId=id;dirtySections.add('equipment');render()});document.getElementById('addCamera')?.addEventListener('click',()=>{const id=uid('cam');draft.equipment.cameras.push({id,name:'Neue Kamera',sensorWidth:23.5,sensorHeight:15.7,pixelSize:3.76});draft.equipment.selectedCameraId=id;dirtySections.add('equipment');render()});document.querySelectorAll('[data-delete-scope]').forEach(b=>b.onclick=()=>{draft.equipment.telescopes=draft.equipment.telescopes.filter(x=>x.id!==b.dataset.deleteScope);draft.equipment.selectedTelescopeId=draft.equipment.telescopes[0]?.id||'';dirtySections.add('equipment');render()});document.querySelectorAll('[data-delete-camera]').forEach(b=>b.onclick=()=>{draft.equipment.cameras=draft.equipment.cameras.filter(x=>x.id!==b.dataset.deleteCamera);draft.equipment.selectedCameraId=draft.equipment.cameras[0]?.id||'';dirtySections.add('equipment');render()})}
function bindCentralDraft(){
  const set=(id,handler,section,eventName='change')=>{
    const element=document.getElementById(id);
    if(element)element.addEventListener(eventName,()=>{handler(element);dirtySections.add(section)});
  };
  const unit=document.getElementById('windUnit');
  if(unit)unit.onchange=()=>{
    const from=draft.central.windUnit,to=unit.value;
    if(from!==to){
      for(const value of Object.values(draft.central.windProfiles)){
        for(const key of['windGreen','windYellow','gustGreen','gustYellow'])value[key]=Math.round(convertWindValue(Number(value[key]),from,to)*10)/10;
      }
      draft.central.jet.green=Math.round(convertWindValue(Number(draft.central.jet.green),from,to)*10)/10;
      draft.central.jet.yellow=Math.round(convertWindValue(Number(draft.central.jet.yellow),from,to)*10)/10;
      draft.central.windUnit=to;
      dirtySections.add('centralWind');
      render();
    }
  };
  set('activeWindProfile',element=>draft.central.activeWindProfile=element.value,'centralWind');
  set('dewGreen',element=>draft.central.dew.green=Number(element.value),'centralWind');
  set('dewYellow',element=>draft.central.dew.yellow=Number(element.value),'centralWind');
  set('jetGreen',element=>draft.central.jet.green=Number(element.value),'centralWind');
  set('jetYellow',element=>draft.central.jet.yellow=Number(element.value),'centralWind');
  document.querySelectorAll('[data-wind-profile]').forEach(element=>element.onchange=()=>{
    draft.central.windProfiles[element.dataset.windProfile][element.dataset.field]=Number(element.value);
    dirtySections.add('centralWind');
  });
  document.querySelectorAll('[data-weather-weight]').forEach(element=>element.onchange=()=>{
    draft.central.weatherModels.weights[element.dataset.weatherWeight]=Math.round(Number(element.value));
    dirtySections.add('weatherModels');
    render();
  });
  set('defaultWeatherView',element=>draft.central.weatherModels.defaultView=element.value,'weatherModels');
  document.querySelectorAll('[data-weight]').forEach(element=>element.onchange=()=>{
    draft.central.weights[element.dataset.weight]=Math.round(Number(element.value));
    dirtySections.add('weights');
    render();
  });
  set('defaultPlanningWindow',element=>draft.central.defaultPlanningWindow=element.value,'display');
  set('activeDisplayProfile',element=>draft.central.listDisplay.activeProfile=element.value,'display');
  set('defaultFrameVisible',element=>draft.central.frameVisible=element.checked,'display');
  set('defaultObjectVisible',element=>draft.central.objectSizeVisible=element.checked,'display');
  set('defaultMeteoblueCollapsed',element=>draft.central.meteoblueCollapsed=element.checked,'display');
  set('defaultAltitudeCollapsed',element=>draft.central.detailPanels.altitudeCollapsed=element.checked,'display');
  set('defaultHorizonCollapsed',element=>draft.central.detailPanels.horizonCollapsed=element.checked,'display');
  document.querySelectorAll('[data-display-page-size]').forEach(element=>element.onchange=()=>{
    draft.central.listDisplay.profiles[element.dataset.displayPageSize].pageSize=Number(element.value);
    dirtySections.add('display');
  });
  document.querySelectorAll('[data-display-column-profile]').forEach(element=>element.onchange=()=>{
    const array=draft.central.listDisplay.profiles[element.dataset.displayColumnProfile].columns;
    draft.central.listDisplay.profiles[element.dataset.displayColumnProfile].columns=element.checked?[...new Set([...array,element.dataset.column])]:array.filter(item=>item!==element.dataset.column);
    dirtySections.add('display');
  });
  document.getElementById('resetDisplayProfiles')?.addEventListener('click',()=>{
    draft.central.listDisplay.profiles=deepClone(DISPLAY_PROFILES);
    draft.central.listDisplay.activeProfile='standard';
    dirtySections.add('display');
    render();
  });
}
function bindLocationDraft(){
  const location=()=>draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0];
  const mark=()=>{dirtySections.add('locations');syncSettingsHorizonCanvas()};
  const set=(id,field,numeric=false)=>{
    const element=document.getElementById(id);
    if(element)element.onchange=()=>{location()[field]=numeric?Number(element.value):element.value;mark()};
  };
  const locationSelect=document.getElementById('locationSelect');
  if(locationSelect)locationSelect.onchange=()=>{draft.selectedLocationId=locationSelect.value;render()};
  set('locName','name');
  set('locTimezone','timezone');
  set('locLat','latitude',true);
  set('locLon','longitude',true);
  set('locElevation','elevation',true);
  const defaultSelect=document.getElementById('defaultLocationSelect');
  if(defaultSelect)defaultSelect.onchange=()=>{draft.central.defaultLocationId=defaultSelect.value;dirtySections.add('locations')};
  const gpsBehavior=document.getElementById('gpsBehavior');
  if(gpsBehavior)gpsBehavior.onchange=()=>{draft.central.gpsBehavior=gpsBehavior.value;dirtySections.add('locations')};
  document.querySelectorAll('[data-horizon]').forEach(element=>{
    const update=()=>{location().horizon[Number(element.dataset.horizon)]=clamp(Number(element.value)||0,0,90);mark()};
    element.oninput=update;
    element.onchange=update;
  });
  document.getElementById('addLocation')?.addEventListener('click',()=>{
    const id=uid('loc');
    draft.locations.push({id,name:'Neuer Standort',latitude:48.5,longitude:9,elevation:0,timezone:'Europe/Berlin',horizon:[0,0,0,0,0,0,0,0],obstacles:[]});
    draft.selectedLocationId=id;
    dirtySections.add('locations');
    render();
  });
  document.getElementById('deleteLocation')?.addEventListener('click',()=>{
    draft.locations=draft.locations.filter(item=>item.id!==location().id);
    draft.selectedLocationId=draft.locations[0].id;
    dirtySections.add('locations');
    render();
  });
  document.getElementById('useGps')?.addEventListener('click',()=>navigator.geolocation?.getCurrentPosition(position=>{
    location().latitude=position.coords.latitude;
    location().longitude=position.coords.longitude;
    location().elevation=position.coords.altitude||location().elevation;
    dirtySections.add('locations');
    render();
  },error=>alert(`GPS nicht verfügbar: ${error.message}`)));
  document.getElementById('searchLocation')?.addEventListener('click',async()=>{
    const name=prompt('Ort oder Postleitzahl:');
    if(!name)return;
    try{
      const response=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=de&format=json`);
      const json=await response.json();
      const result=json.results?.[0];
      if(!result)throw new Error('Kein Treffer');
      Object.assign(location(),{name:`${result.name}${result.admin1?`, ${result.admin1}`:''}`,latitude:result.latitude,longitude:result.longitude,elevation:result.elevation||0,timezone:result.timezone||'Europe/Berlin'});
      dirtySections.add('locations');
      render();
    }catch(error){alert(error.message)}
  });
  document.getElementById('addObstacle')?.addEventListener('click',()=>{
    location().obstacles.push({id:uid('obs'),name:'Baum/Gebäude',azimuth:180,altitude:20});
    dirtySections.add('locations');
    render();
  });
  document.querySelectorAll('[data-obstacle]').forEach(row=>row.querySelectorAll('[data-obstacle-field]').forEach(element=>{
    const update=()=>{
      const obstacle=location().obstacles.find(item=>item.id===row.dataset.obstacle);
      obstacle[element.dataset.obstacleField]=element.type==='number'?Number(element.value):element.value;
      mark();
    };
    element.oninput=update;
    element.onchange=update;
  }));
  document.querySelectorAll('[data-delete-obstacle]').forEach(button=>button.onclick=()=>{
    location().obstacles=location().obstacles.filter(item=>item.id!==button.dataset.deleteObstacle);
    dirtySections.add('locations');
    render();
  });
}
async function saveDraftSection(section){
  if(section==='equipment'){
    profile.equipment=deepClone(draft.equipment);
    dirtySections.delete('equipment');
  }
  if(section==='centralWind'){
    profile.central.windUnit=draft.central.windUnit;
    profile.central.activeWindProfile=draft.central.activeWindProfile;
    profile.central.windProfiles=deepClone(draft.central.windProfiles);
    profile.central.dew=deepClone(draft.central.dew);
    profile.central.jet=deepClone(draft.central.jet);
    dirtySections.delete('centralWind');
  }
  if(section==='weatherModels'){
    const total=Object.values(draft.central.weatherModels.weights).reduce((sum,value)=>sum+Number(value),0);
    if(total!==100){alert('Die Gewichtung der Wettermodelle muss exakt 100 % ergeben.');return}
    profile.central.weatherModels=deepClone(draft.central.weatherModels);
    profile.planning.temporaryWeatherView=null;
    dirtySections.delete('weatherModels');
  }
  if(section==='weights'){
    const total=Object.values(draft.central.weights).reduce((sum,value)=>sum+Number(value),0);
    if(total!==100){alert('Die Gewichtung muss exakt 100 % ergeben.');return}
    profile.central.weights=deepClone(draft.central.weights);
    dirtySections.delete('weights');
  }
  if(section==='display'){
    profile.central.defaultPlanningWindow=draft.central.defaultPlanningWindow;
    profile.planning.planningWindow=draft.central.defaultPlanningWindow;
    profile.central.listDisplay=deepClone(draft.central.listDisplay);
    profile.central.frameVisible=draft.central.frameVisible;
    profile.central.objectSizeVisible=draft.central.objectSizeVisible;
    profile.central.meteoblueCollapsed=draft.central.meteoblueCollapsed;
    profile.central.detailPanels=deepClone(draft.central.detailPanels);
    profile.planning.detailsOpen=false;
    page=1;
    dirtySections.delete('display');
  }
  if(section==='locations'){
    profile.locations=deepClone(draft.locations);
    profile.selectedLocationId=draft.selectedLocationId;
    profile.central.defaultLocationId=draft.central.defaultLocationId;
    profile.central.gpsBehavior=draft.central.gpsBehavior;
    dirtySections.delete('locations');
  }
  await saveProfile();
  draft=deepClone(profile);
  render();
  if(section==='locations')fetchWeather();
}

async function createProfile(){const name=prompt('Name des neuen Profils:','Neues Profil');if(!name)return;const p=standardProfile();p.id=uid('profile');p.name=name.trim();await idbPut('profiles',p);profiles=await idbAll('profiles');profile=p;draft=deepClone(p);await setActiveProfile(p.id);updateProfileSelectors();render()}
async function duplicateProfile(){const name=prompt('Name der Kopie:',`${profile.name} – Kopie`);if(!name)return;const p=deepClone(profile);p.id=uid('profile');p.name=name.trim();p.createdAt=new Date().toISOString();await idbPut('profiles',p);profiles=await idbAll('profiles');profile=p;draft=deepClone(p);await setActiveProfile(p.id);updateProfileSelectors();render()}
async function renameProfile(){const name=prompt('Neuer Profilname:',profile.name);if(!name)return;profile.name=name.trim();draft.name=profile.name;await saveProfile();render()}
async function deleteProfile(){if(profiles.length===1||!confirm(`Profil „${profile.name}“ wirklich löschen?`))return;await idbDelete('profiles',profile.id);profiles=await idbAll('profiles');profile=normalizeProfile(profiles[0]);draft=deepClone(profile);await setActiveProfile(profile.id);updateProfileSelectors();render()}
function bindInfoActions(){document.getElementById('exportProfile')?.addEventListener('click',()=>downloadJson(`astro-night-planner-profil-${safeName(profile.name)}.json`,{kind:'astro-night-planner-profile',appVersion:APP_VERSION,exportedAt:new Date().toISOString(),profile}));document.getElementById('exportAll')?.addEventListener('click',async()=>downloadJson(`astro-night-planner-sicherung-${new Date().toISOString().slice(0,10)}.json`,{kind:'astro-night-planner-backup',appVersion:APP_VERSION,environment:ENV,exportedAt:new Date().toISOString(),profiles:await idbAll('profiles'),activeProfileId:profile.id}));document.getElementById('importProfile')?.addEventListener('click',()=>importInput.click());document.getElementById('requestPersistence')?.addEventListener('click',async()=>{const el=document.getElementById('storageMessage');if(!navigator.storage?.persist){el.textContent='Dieser Browser unterstützt die Anforderung persistenten Speichers nicht.';return}const granted=await navigator.storage.persist();profile.central.persistentStorageRequested=granted;await saveProfile();el.textContent=granted?'Persistenter Speicher wurde gewährt.':'Der Browser hat persistenten Speicher nicht gewährt; regelmäßige Exporte bleiben wichtig.'})}
function downloadJson(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function safeName(s){return s.toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'-').replace(/^-|-$/g,'')}
async function handleImportFile(){const file=importInput.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(data.kind==='astro-night-planner-backup'&&Array.isArray(data.profiles)){if(!confirm(`${data.profiles.length} Profile aus der Sicherung wiederherstellen? Gleichnamige IDs werden überschrieben.`))return;for(const p of data.profiles)await idbPut('profiles',normalizeProfile(p));profiles=await idbAll('profiles');profile=normalizeProfile(profiles.find(x=>x.id===data.activeProfileId)||profiles[0]);await setActiveProfile(profile.id)}else{const raw=data.profile||data;if(!raw.name)throw new Error('Kein gültiges Profil');const p=normalizeProfile(raw);if(profiles.some(x=>x.id===p.id))p.id=uid('profile');await idbPut('profiles',p);profiles=await idbAll('profiles');profile=p;await setActiveProfile(p.id)}draft=deepClone(profile);dirtySections.clear();updateProfileSelectors();render();alert('Import erfolgreich.')}catch(e){alert(`Import fehlgeschlagen: ${e.message}`)}finally{importInput.value=''}}

function drawMiniCharts(){document.querySelectorAll('.mini-chart').forEach(canvas=>{const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;const points=JSON.parse(decodeURIComponent(canvas.dataset.points));const start=Number(canvas.dataset.start),end=Number(canvas.dataset.end),astroS=Number(canvas.dataset.astroStart),astroE=Number(canvas.dataset.astroEnd),nautS=Number(canvas.dataset.nautStart),nautE=Number(canvas.dataset.nautEnd),minAlt=Number(canvas.dataset.minAlt);ctx.clearRect(0,0,w,h);const x=t=>(t-start)/(end-start)*w,y=a=>h-8-clamp(a,0,90)/90*(h-16);ctx.fillStyle='#263343';ctx.fillRect(0,0,w,h);const band=(s,e,fill)=>{ctx.fillStyle=fill;ctx.fillRect(clamp(x(s),0,w),0,clamp(x(e),0,w)-clamp(x(s),0,w),h)};band(nautS,nautE,'#1b2735');band(astroS,astroE,'#101924');for(const t of [nautS,astroS,astroE,nautE]){ctx.beginPath();ctx.strokeStyle='#73849a';ctx.setLineDash([3,3]);ctx.moveTo(x(t),0);ctx.lineTo(x(t),h);ctx.stroke()}ctx.setLineDash([5,4]);ctx.strokeStyle='#d7ad47';ctx.beginPath();ctx.moveTo(0,y(minAlt));ctx.lineTo(w,y(minAlt));ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#7ec1ff';ctx.lineWidth=2;ctx.beginPath();points.forEach(([t,a],i)=>i?ctx.lineTo(x(t),y(a)):ctx.moveTo(x(t),y(a)));ctx.stroke();const max=points.reduce((m,p)=>p[1]>m[1]?p:m,points[0]);ctx.fillStyle='#f0c75e';ctx.beginPath();ctx.arc(x(max[0]),y(max[1]),3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#aabbd0';ctx.font='10px sans-serif';ctx.fillText('0°',2,h-2);ctx.fillText('90°',2,10)})}

function decodeCanvasData(value,fallback=[]){
  try{return JSON.parse(decodeURIComponent(value||''))}catch{return fallback}
}

function chartPalette(){
  return{
    background:'#07111d',grid:'#263a51',text:'#a9bdd2',accent:'#6fc9ff',accent2:'#4ad18b',
    selected:'rgba(121,184,255,.13)',civil:'#1b2a3d',nautical:'#142235',astronomical:'#0b1727',
    warning:'#f0c75e',danger:'#f17070',horizonFill:'rgba(74,209,139,.14)'
  };
}

function drawLargeCharts(){
  const palette=chartPalette();
  document.querySelectorAll('.large-altitude-chart').forEach(canvas=>{
    const context=canvas.getContext('2d');
    const width=canvas.width,height=canvas.height;
    const points=decodeCanvasData(canvas.dataset.points);
    if(!points.length)return;
    const margin={left:62,right:22,top:22,bottom:70};
    const plotW=width-margin.left-margin.right,plotH=height-margin.top-margin.bottom;
    const start=Number(canvas.dataset.start),end=Number(canvas.dataset.end);
    const selectedStart=Number(canvas.dataset.selectedStart),selectedEnd=Number(canvas.dataset.selectedEnd);
    const x=time=>margin.left+(time-start)/(end-start)*plotW;
    const y=altitudeValue=>margin.top+(90-clamp(altitudeValue,0,90))/90*plotH;
    context.clearRect(0,0,width,height);
    context.fillStyle=palette.background;
    context.fillRect(0,0,width,height);
    const band=(bandStart,bandEnd,fill)=>{
      const left=clamp(x(Number(bandStart)),margin.left,margin.left+plotW);
      const right=clamp(x(Number(bandEnd)),margin.left,margin.left+plotW);
      if(right<=left)return;
      context.fillStyle=fill;
      context.fillRect(left,margin.top,right-left,plotH);
    };
    band(canvas.dataset.civilStart,canvas.dataset.civilEnd,palette.civil);
    band(canvas.dataset.nautStart,canvas.dataset.nautEnd,palette.nautical);
    band(canvas.dataset.astroStart,canvas.dataset.astroEnd,palette.astronomical);
    band(selectedStart,selectedEnd,palette.selected);
    context.strokeStyle=palette.accent;
    context.lineWidth=2;
    context.setLineDash([8,5]);
    context.strokeRect(clamp(x(selectedStart),margin.left,margin.left+plotW),margin.top,Math.max(1,clamp(x(selectedEnd),margin.left,margin.left+plotW)-clamp(x(selectedStart),margin.left,margin.left+plotW)),plotH);
    context.setLineDash([]);
    context.font='15px system-ui, sans-serif';
    context.textBaseline='middle';
    for(let altitudeValue=0;altitudeValue<=90;altitudeValue+=15){
      const py=y(altitudeValue);
      context.strokeStyle=palette.grid;
      context.lineWidth=1;
      context.beginPath();
      context.moveTo(margin.left,py);
      context.lineTo(margin.left+plotW,py);
      context.stroke();
      context.fillStyle=palette.text;
      context.textAlign='right';
      context.fillText(`${altitudeValue}°`,margin.left-10,py);
    }
    const ticks=8;
    for(let index=0;index<=ticks;index++){
      const time=start+(end-start)*index/ticks;
      const px=x(time);
      context.strokeStyle=palette.grid;
      context.beginPath();
      context.moveTo(px,margin.top);
      context.lineTo(px,margin.top+plotH);
      context.stroke();
      const nearest=points.reduce((best,point)=>Math.abs(point[0]-time)<Math.abs(best[0]-time)?point:best,points[0]);
      context.fillStyle=palette.text;
      context.textAlign=index===0?'left':index===ticks?'right':'center';
      context.textBaseline='top';
      context.fillText(fmtTime(new Date(time),canvas.dataset.timezone),px,margin.top+plotH+10);
      context.fillStyle='#d4e7fa';
      context.fillText(`${cardinal(nearest[2])} · ${fmt(nearest[2])}°`,px,margin.top+plotH+33);
    }
    const minAltitude=Number(canvas.dataset.minAlt);
    context.setLineDash([8,5]);
    context.strokeStyle=palette.warning;
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(margin.left,y(minAltitude));
    context.lineTo(margin.left+plotW,y(minAltitude));
    context.stroke();
    context.setLineDash([]);
    context.fillStyle=palette.warning;
    context.textAlign='left';
    context.textBaseline='bottom';
    context.fillText(`Mindesthöhe ${fmt(minAltitude)}°`,margin.left+8,y(minAltitude)-4);
    context.strokeStyle=palette.accent2;
    context.lineWidth=2;
    context.setLineDash([5,4]);
    context.beginPath();
    points.forEach((point,index)=>index?context.lineTo(x(point[0]),y(point[3])):context.moveTo(x(point[0]),y(point[3])));
    context.stroke();
    context.setLineDash([]);
    context.strokeStyle=palette.accent;
    context.lineWidth=4;
    context.beginPath();
    points.forEach((point,index)=>index?context.lineTo(x(point[0]),y(point[1])):context.moveTo(x(point[0]),y(point[1])));
    context.stroke();
    const maxPoint=points.reduce((best,point)=>point[1]>best[1]?point:best,points[0]);
    context.fillStyle=palette.warning;
    context.beginPath();
    context.arc(x(maxPoint[0]),y(maxPoint[1]),6,0,Math.PI*2);
    context.fill();
    context.fillStyle='#d9ebff';
    context.textAlign='left';
    context.textBaseline='bottom';
    context.fillText(`Maximum ${fmt(maxPoint[1])}° · ${fmtTime(new Date(maxPoint[0]),canvas.dataset.timezone)} · ${cardinal(maxPoint[2])}`,x(maxPoint[0])+10,y(maxPoint[1])-7);
    context.strokeStyle='#38516d';
    context.lineWidth=1;
    context.strokeRect(margin.left,margin.top,plotW,plotH);
    context.fillStyle=palette.text;
    context.textAlign='left';
    context.textBaseline='top';
    context.fillText('Objekthöhe',margin.left,2);
    context.fillStyle=palette.accent2;
    context.fillText('— persönlicher Horizont',margin.left+110,2);
  });
  document.querySelectorAll('.large-horizon-chart').forEach(canvas=>drawHorizonChart(canvas,true));
}

function drawHorizonChart(canvas,withTrack=false){
  const palette=chartPalette();
  const context=canvas.getContext('2d');
  const width=canvas.width,height=canvas.height;
  const horizon=decodeCanvasData(canvas.dataset.horizon);
  const obstacles=decodeCanvasData(canvas.dataset.obstacles);
  const track=withTrack?decodeCanvasData(canvas.dataset.track):[];
  const margin={left:62,right:22,top:22,bottom:68};
  const plotW=width-margin.left-margin.right,plotH=height-margin.top-margin.bottom;
  const x=azimuthValue=>margin.left+clamp(azimuthValue,0,360)/360*plotW;
  const y=altitudeValue=>margin.top+(90-clamp(altitudeValue,0,90))/90*plotH;
  context.clearRect(0,0,width,height);
  context.fillStyle=palette.background;
  context.fillRect(0,0,width,height);
  context.font='15px system-ui, sans-serif';
  for(let altitudeValue=0;altitudeValue<=90;altitudeValue+=15){
    const py=y(altitudeValue);
    context.strokeStyle=palette.grid;
    context.lineWidth=1;
    context.beginPath();context.moveTo(margin.left,py);context.lineTo(margin.left+plotW,py);context.stroke();
    context.fillStyle=palette.text;context.textAlign='right';context.textBaseline='middle';context.fillText(`${altitudeValue}°`,margin.left-10,py);
  }
  const directions=['N','NO','O','SO','S','SW','W','NW','N'];
  directions.forEach((direction,index)=>{
    const azimuthValue=index*45,px=x(azimuthValue);
    context.strokeStyle=palette.grid;
    context.beginPath();context.moveTo(px,margin.top);context.lineTo(px,margin.top+plotH);context.stroke();
    context.fillStyle='#d6e8fa';context.textAlign=index===0?'left':index===8?'right':'center';context.textBaseline='top';
    context.fillText(direction,px,margin.top+plotH+8);
    context.fillStyle=palette.text;context.fillText(`${azimuthValue}°`,px,margin.top+plotH+31);
  });
  if(horizon.length){
    context.beginPath();
    context.moveTo(x(horizon[0][0]),y(0));
    horizon.forEach(point=>context.lineTo(x(point[0]),y(point[1])));
    context.lineTo(x(horizon[horizon.length-1][0]),y(0));
    context.closePath();
    context.fillStyle=palette.horizonFill;
    context.fill();
    context.strokeStyle=palette.accent2;
    context.lineWidth=4;
    context.beginPath();
    horizon.forEach((point,index)=>index?context.lineTo(x(point[0]),y(point[1])):context.moveTo(x(point[0]),y(point[1])));
    context.stroke();
  }
  obstacles.forEach(obstacle=>{
    const center=((Number(obstacle.azimuth)%360)+360)%360;
    const halfWidth=6;
    const left=center-halfWidth,right=center+halfWidth;
    context.fillStyle='rgba(241,112,112,.28)';
    const drawBlock=(from,to)=>{
      context.fillRect(x(from),y(obstacle.altitude),x(to)-x(from),y(0)-y(obstacle.altitude));
      context.strokeStyle=palette.danger;context.lineWidth=2;context.strokeRect(x(from),y(obstacle.altitude),x(to)-x(from),y(0)-y(obstacle.altitude));
    };
    if(left<0){drawBlock(0,right);drawBlock(360+left,360)}
    else if(right>360){drawBlock(left,360);drawBlock(0,right-360)}
    else drawBlock(left,right);
    context.fillStyle=palette.danger;context.textAlign='center';context.textBaseline='bottom';context.fillText(String(obstacle.name||'Hindernis'),x(center),y(obstacle.altitude)-4);
  });
  if(track.length){
    const selectedStart=Number(canvas.dataset.selectedStart),selectedEnd=Number(canvas.dataset.selectedEnd);
    context.strokeStyle=palette.accent;
    context.lineWidth=3;
    context.beginPath();
    let previous=null;
    track.forEach(point=>{
      if(previous&&Math.abs(point[0]-previous[0])>180){context.stroke();context.beginPath();previous=null}
      if(previous)context.lineTo(x(point[0]),y(point[1]));else context.moveTo(x(point[0]),y(point[1]));
      previous=point;
    });
    context.stroke();
    const selected=track.filter(point=>point[2]>=selectedStart&&point[2]<=selectedEnd);
    if(selected.length){
      context.strokeStyle=palette.warning;
      context.lineWidth=5;
      context.beginPath();
      let previousSelected=null;
      selected.forEach(point=>{
        if(previousSelected&&Math.abs(point[0]-previousSelected[0])>180){context.stroke();context.beginPath();previousSelected=null}
        if(previousSelected)context.lineTo(x(point[0]),y(point[1]));else context.moveTo(x(point[0]),y(point[1]));
        previousSelected=point;
      });
      context.stroke();
    }
  }
  context.strokeStyle='#38516d';
  context.lineWidth=1;
  context.strokeRect(margin.left,margin.top,plotW,plotH);
  context.fillStyle=palette.text;
  context.textAlign='left';
  context.textBaseline='top';
  context.fillText(withTrack?'Horizont (grün) · Objektbahn (blau) · Planungszeitraum (gelb)':'Persönlicher Horizont und Hindernisse',margin.left,2);
}

function drawSettingsHorizonCharts(){
  document.querySelectorAll('.settings-horizon-chart').forEach(canvas=>drawHorizonChart(canvas,false));
}

function syncSettingsHorizonCanvas(){
  const canvas=document.querySelector('.settings-horizon-chart');
  if(!canvas)return;
  const location=draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0];
  const points=Array.from({length:73},(_,index)=>{
    const azimuthValue=index*5;
    const position=azimuthValue/45;
    const lower=Math.floor(position)%8,upper=(lower+1)%8,fraction=position-Math.floor(position);
    const altitudeValue=(Number(location.horizon?.[lower])||0)*(1-fraction)+(Number(location.horizon?.[upper])||0)*fraction;
    return[azimuthValue,altitudeValue];
  });
  canvas.dataset.horizon=encodeURIComponent(JSON.stringify(points));
  canvas.dataset.obstacles=encodeURIComponent(JSON.stringify((location.obstacles||[]).map(item=>({name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0}))));
  drawSettingsHorizonCharts();
}

function layoutFramingOverlays(){
  document.querySelectorAll('.framing-view').forEach(view=>{
    const horizontalFov=Number(view.dataset.targetFov)||1;
    const verticalFov=horizontalFov*Math.max(1,view.clientHeight)/Math.max(1,view.clientWidth);
    view.querySelectorAll('.framing-scaled-overlay').forEach(overlay=>{
      const widthDeg=Number(overlay.dataset.widthDeg)||0;
      const heightDeg=Number(overlay.dataset.heightDeg)||0;
      overlay.style.width=`${clamp(widthDeg/horizontalFov*100,.3,96)}%`;
      overlay.style.height=`${clamp(heightDeg/verticalFov*100,.3,96)}%`;
      overlay.style.transform=`translate(-50%,-50%) rotate(${Number(overlay.dataset.rotation)||0}deg)`;
    });
  });
}

async function registerPwa(){
  if(!('serviceWorker'in navigator))return;
  const hadController=Boolean(navigator.serviceWorker.controller);
  try{
    swRegistration=await navigator.serviceWorker.register('sw.js');
    swRegistration.addEventListener('updatefound',()=>{
      const worker=swRegistration.installing;
      worker?.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&hadController&&navigator.serviceWorker.controller){
          document.getElementById('updateBanner').hidden=false;
        }
      });
    });
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(hadController)document.getElementById('updateBanner').hidden=false;
    });
  }catch(error){
    console.warn('Service Worker konnte nicht registriert werden',error);
  }
}

init().catch(err=>{console.error(err);app.innerHTML=`<section class="card"><h2>Start fehlgeschlagen</h2><div class="notice bad">${esc(err.message||err)}</div><p>Bitte Browserdaten für diese Seite prüfen oder die App neu laden.</p></section>`});
