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
const CLOUD_MAP_VIEW_OPTIONS = WEATHER_VIEW_OPTIONS;
const CLOUD_MAP_LAYER_OPTIONS = [
  ['cloud','Gesamtbewölkung'],
  ['cloudLow','Tiefe Wolken'],
  ['cloudMid','Mittlere Wolken'],
  ['cloudHigh','Hohe Wolken'],
];
const CLOUD_MAP_MODE_OPTIONS = [
  ['clouds','Wolkenverteilung'],
  ['uncertainty','Modellabweichung'],
];
const CLOUD_MAP_GRID_OPTIONS = [
  [5,'25 Kartenpunkte (sparsam)'],
  [7,'49 Kartenpunkte (Standard)'],
  [9,'81 Kartenpunkte (detailliert)'],
];
const CLOUD_MAP_RADIUS_OPTIONS = [
  [60,'60 km'],
  [120,'120 km (Standard)'],
  [200,'200 km'],
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
    id:'standard', name:'Standard', schemaVersion:4, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(),
    equipment:{
      telescopes:[{id:'scope-askar200',name:'Askar 200 mm',focalLength:200,aperture:50}], selectedTelescopeId:'scope-askar200',
      cameras:[{id:'cam-qhy268m',name:'QHY268M',sensorWidth:23.45,sensorHeight:15.7,pixelSize:3.76}], selectedCameraId:'cam-qhy268m',
      mounts:[{id:'mount-standard',name:'Parallaktische Montierung',type:'Parallaktisch',maxPayloadKg:null}], selectedMountId:'mount-standard'
    },
    central:{
      windUnit:'kmh', activeWindProfile:'normal', windProfiles:deepClone(WIND_PROFILES),
      dew:{green:5,yellow:2}, jet:{green:36,yellow:72},
      weatherModels:{weights:{icon:40,ecmwf:40,gfs:20},defaultView:'consensus'},
      cloudMap:{gridSize:7,radiusKm:120,defaultView:'consensus',defaultLayer:'cloud',defaultMode:'clouds',animationMs:900,timeStepMinutes:30,collapsed:false,meteoblueMapCollapsed:true},
      weights:{clouds:30,transparency:15,seeing:10,wind:10,dew:10,moon:10,altitude:10,duration:5},
      defaultPlanningWindow:'nautical', defaultLocationId:'loc-tuebingen', gpsBehavior:'last',
      framing:{minMarginPercent:10,autoRotate:true},
      listDisplay:{activeProfile:'standard',profiles:deepClone(DISPLAY_PROFILES)},
      objectSizeVisible:false, frameVisible:true, meteoblueCollapsed:true,
      detailPanels:{altitudeCollapsed:true,horizonCollapsed:true},
      collapsed:{weather:false,meteoblue:true,filters:false,framing:false},
      persistentStorageRequested:false
    },
    locations:[{id:'loc-tuebingen',name:'Tübingen',latitude:48.5216,longitude:9.0576,elevation:341,timezone:'Europe/Berlin',isDefault:true,
      geonameId:2820860,country:'Deutschland',meteobluePath:'tübingen_deutschland_2820860',
      horizon:[0,0,0,0,0,0,0,0],horizonProfile:Array(73).fill(0),obstacles:[],
      horizonProfiles:[{id:'horizon-standard',name:'Freier Horizont',horizonProfile:Array(73).fill(0),obstacles:[]}],defaultHorizonProfileId:'horizon-standard',selectedHorizonProfileId:'horizon-standard'}], selectedLocationId:'loc-tuebingen',
    planning:{dateKey:'',locationId:null,planningWindow:'nautical',temporaryWindProfile:null,temporaryDisplayProfile:null,temporaryWeatherView:null,temporaryTelescopeId:null,temporaryCameraId:null,temporaryHorizonProfileId:null,cloudMapTimeStepMinutes:null,
      temporaryCloudMapView:null,cloudMapLayer:'cloud',cloudMapMode:'clouds',cloudMapFrame:0,
      search:'',catalogs:['Messier','NGC','IC','Sh2','Abell','Zusatzkatalog'],types:[],maxMagnitude:16,minAltitude:25,minVisibleHours:1.5,minMoonDistance:25,
      minSize:0,maxSize:1200,onlyFits:false,page:1,pageSize:20,selectedObjectId:'M31',detailsOpen:false,objectRotation:0,frameRotation:0,timeFraction:.5,
      detailTimeFraction:0,showGroundHorizon:true},
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
let cloudMapData=null;
let cloudMapError='';
let cloudMapLoading=false;
let cloudMapRequestId=0;
let cloudMapAbortController=null;
let cloudMapAnimationTimer=null;
let cloudMapSaveTimer=null;
let locationComparisonData=null;
let locationComparisonLoading=false;
let locationComparisonError='';
let currentComputedObjects=[];
let installPrompt=null;
let currentMainTab='plan';
let currentSettingsTab='equipment';
let selectedDateKey='';
let page=1;
let scrollByTab={plan:0,settings:0};
let dirtySections=new Set();
let swRegistration=null;
let saveFeedbackSections=new Set();
let horizonUndoStack=[];
let backupInProgress=false;
let backupConfig={enabled:false,afterSave:true,daily:true,keep:10,reminderDays:7,lastSuccessAt:null,lastError:'',lastDailyDate:null,targetName:'',permission:'none'};
let backupDraft=deepClone(backupConfig);
let storageInfo={persistent:null,usage:null,quota:null,fileSystemSupported:typeof window.showDirectoryPicker==='function',handleAvailable:false,permission:'none'};

function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains('profiles'))d.createObjectStore('profiles',{keyPath:'id'});if(!d.objectStoreNames.contains('meta'))d.createObjectStore('meta',{keyPath:'key'});if(!d.objectStoreNames.contains('cache'))d.createObjectStore('cache',{keyPath:'key'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
function idb(store,mode='readonly'){return db.transaction(store,mode).objectStore(store)}
function idbGet(store,key){return new Promise((resolve,reject)=>{const r=idb(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function idbAll(store){return new Promise((resolve,reject)=>{const r=idb(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function idbPut(store,value){return new Promise((resolve,reject)=>{const r=idb(store,'readwrite').put(value);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function idbDelete(store,key){return new Promise((resolve,reject)=>{const r=idb(store,'readwrite').delete(key);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
async function metaValue(key,fallback=null){const entry=await idbGet('meta',key);return entry?.value??fallback}
async function setMetaValue(key,value){await idbPut('meta',{key,value})}
function formatBytes(value){if(!Number.isFinite(value))return'–';const units=['B','KB','MB','GB'];let number=value,index=0;while(number>=1024&&index<units.length-1){number/=1024;index++}return`${number.toFixed(index?1:0)} ${units[index]}`}
function backupFileStamp(date=new Date()){return date.toISOString().replace(/[:.]/g,'-').slice(0,19)}
async function buildBackupPayload(){return{kind:'astro-night-planner-backup',appVersion:APP_VERSION,environment:ENV,exportedAt:new Date().toISOString(),profiles:await idbAll('profiles'),activeProfileId:profile?.id||null,backupSchemaVersion:3,backupSettings:{afterSave:Boolean(backupConfig.afterSave),daily:Boolean(backupConfig.daily),keep:Number(backupConfig.keep)||10,reminderDays:Number(backupConfig.reminderDays)||7}}}
async function getBackupDirectoryHandle(){return metaValue('backupDirectoryHandle',null)}
async function fileHandlePermission(handle,{request=false}={}){
  if(!handle)return'none';
  try{
    let permission=await handle.queryPermission?.({mode:'readwrite'})||'prompt';
    if(permission!=='granted'&&request&&handle.requestPermission)permission=await handle.requestPermission({mode:'readwrite'});
    return permission;
  }catch{return'denied'}
}
async function refreshStorageInfo(){
  storageInfo.fileSystemSupported=typeof window.showDirectoryPicker==='function';
  try{storageInfo.persistent=await navigator.storage?.persisted?.()??null}catch{storageInfo.persistent=null}
  try{const estimate=await navigator.storage?.estimate?.();storageInfo.usage=estimate?.usage??null;storageInfo.quota=estimate?.quota??null}catch{storageInfo.usage=null;storageInfo.quota=null}
  const handle=await getBackupDirectoryHandle();
  storageInfo.handleAvailable=Boolean(handle);
  storageInfo.permission=await fileHandlePermission(handle);
  if(handle?.name&&!backupConfig.targetName)backupConfig.targetName=handle.name;
}
async function saveBackupConfig(){await setMetaValue('backupConfig',deepClone(backupConfig))}
async function writeJsonFile(directoryHandle,name,data){
  const fileHandle=await directoryHandle.getFileHandle(name,{create:true});
  const writable=await fileHandle.createWritable();
  await writable.write(JSON.stringify(data,null,2));
  await writable.close();
}
async function rotateBackupFiles(directoryHandle,keep){
  if(!directoryHandle?.entries||keep<1)return;
  const names=[];
  for await(const [name,entry]of directoryHandle.entries()){
    if(entry.kind==='file'&&/^astro-night-planner-\d{4}-\d{2}-\d{2}T/.test(name)&&name.endsWith('.json'))names.push(name);
  }
  names.sort().reverse();
  for(const name of names.slice(keep))await directoryHandle.removeEntry(name).catch(()=>{});
}
async function performExternalBackup({requestPermission=false,forceDated=false,manualFallback=false}={}){
  if(backupInProgress)return false;
  backupInProgress=true;
  try{
    const payload=await buildBackupPayload();
    const handle=await getBackupDirectoryHandle();
    if(!handle){
      if(manualFallback){downloadJson(`astro-night-planner-sicherung-${new Date().toISOString().slice(0,10)}.json`,payload);return true}
      throw new Error('Kein externer Sicherungsordner ausgewählt.');
    }
    const permission=await fileHandlePermission(handle,{request:requestPermission});
    storageInfo.permission=permission;
    if(permission!=='granted')throw new Error(permission==='denied'?'Der Zugriff auf den Sicherungsordner wurde verweigert.':'Der Sicherungsordner muss erneut freigegeben werden.');
    const now=new Date(),today=now.toISOString().slice(0,10);
    await writeJsonFile(handle,'astro-night-planner-aktuell.json',payload);
    if(forceDated||backupConfig.daily&&backupConfig.lastDailyDate!==today){
      await writeJsonFile(handle,`astro-night-planner-${backupFileStamp(now)}.json`,payload);
      backupConfig.lastDailyDate=today;
      await rotateBackupFiles(handle,clamp(Number(backupConfig.keep)||10,1,50));
    }
    backupConfig.lastSuccessAt=now.toISOString();backupConfig.lastError='';backupConfig.targetName=handle.name||backupConfig.targetName;backupConfig.permission='granted';
    await saveBackupConfig();backupDraft=deepClone(backupConfig);await refreshStorageInfo();
    return true;
  }catch(error){
    backupConfig.lastError=error?.message||String(error);backupConfig.permission=storageInfo.permission||'none';
    await saveBackupConfig().catch(()=>{});backupDraft=deepClone(backupConfig);
    return false;
  }finally{backupInProgress=false}
}
async function maybeAutomaticBackup(reason='daily'){
  if(!backupConfig.enabled)return false;
  const now=Date.now();
  const dailyDue=!backupConfig.lastSuccessAt||now-new Date(backupConfig.lastSuccessAt).getTime()>=24*3600000;
  if(reason==='settings'&&backupConfig.afterSave)return performExternalBackup();
  if(reason==='daily'&&backupConfig.daily&&dailyDue)return performExternalBackup();
  return false;
}
function backupAgeText(){
  if(!backupConfig.lastSuccessAt)return'Noch keine Sicherung erstellt';
  return new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(backupConfig.lastSuccessAt));
}
async function saveProfile(p=profile){p.updatedAt=new Date().toISOString();await idbPut('profiles',deepClone(p));profiles=await idbAll('profiles');updateProfileSelectors();}
async function setActiveProfile(id){await idbPut('meta',{key:'activeProfileId',value:id});}

function normalizeProfile(p){
  const base=standardProfile();
  const out={...base,...p};
  out.equipment={...base.equipment,...(p.equipment||{})};
  out.equipment.telescopes=Array.isArray(p.equipment?.telescopes)&&p.equipment.telescopes.length?p.equipment.telescopes:base.equipment.telescopes;
  out.equipment.cameras=Array.isArray(p.equipment?.cameras)&&p.equipment.cameras.length?p.equipment.cameras:base.equipment.cameras;
  out.equipment.mounts=Array.isArray(p.equipment?.mounts)&&p.equipment.mounts.length?p.equipment.mounts:base.equipment.mounts;
  if(!out.equipment.selectedTelescopeId||!out.equipment.telescopes.some(item=>item.id===out.equipment.selectedTelescopeId))out.equipment.selectedTelescopeId=out.equipment.telescopes[0]?.id||'';
  if(!out.equipment.selectedCameraId||!out.equipment.cameras.some(item=>item.id===out.equipment.selectedCameraId))out.equipment.selectedCameraId=out.equipment.cameras[0]?.id||'';
  if(!out.equipment.selectedMountId||!out.equipment.mounts.some(item=>item.id===out.equipment.selectedMountId))out.equipment.selectedMountId=out.equipment.mounts[0]?.id||'';
  out.central={...base.central,...(p.central||{})};
  out.central.windProfiles={...deepClone(WIND_PROFILES),...(p.central?.windProfiles||{})};
  out.central.dew={...base.central.dew,...(p.central?.dew||{})};
  out.central.jet={...base.central.jet,...(p.central?.jet||{})};
  out.central.framing={...base.central.framing,...(p.central?.framing||{})};
  out.central.weatherModels={...base.central.weatherModels,...(p.central?.weatherModels||{}),weights:{...base.central.weatherModels.weights,...(p.central?.weatherModels?.weights||{})}};
  out.central.cloudMap={...base.central.cloudMap,...(p.central?.cloudMap||{})};
  out.central.weights={...base.central.weights,...(p.central?.weights||{})};
  out.central.listDisplay={...base.central.listDisplay,...(p.central?.listDisplay||{})};
  out.central.listDisplay.profiles={...deepClone(DISPLAY_PROFILES),...(p.central?.listDisplay?.profiles||{})};
  out.central.detailPanels={...base.central.detailPanels,...(p.central?.detailPanels||{})};
  out.central.collapsed={...base.central.collapsed,...(p.central?.collapsed||{})};
  out.locations=(p.locations?.length?p.locations:base.locations).map((x,locationIndex)=>{
    const horizon=Array.isArray(x.horizon)&&x.horizon.length===8?x.horizon.map(value=>clamp(Number(value)||0,0,90)):[0,0,0,0,0,0,0,0];
    const legacyValues=Array.isArray(x.horizonProfile)&&x.horizonProfile.length===73?x.horizonProfile.map(value=>clamp(Number(value)||0,0,90)):Array.from({length:73},(_,index)=>{const position=index*5/45,lower=Math.floor(position)%8,upper=(lower+1)%8,fraction=position-Math.floor(position);return horizon[lower]*(1-fraction)+horizon[upper]*fraction});
    legacyValues[72]=legacyValues[0];
    let profiles=Array.isArray(x.horizonProfiles)&&x.horizonProfiles.length?x.horizonProfiles.map((entry,index)=>{
      const values=Array.isArray(entry.horizonProfile)&&entry.horizonProfile.length===73?entry.horizonProfile.map(value=>clamp(Number(value)||0,0,90)):legacyValues.slice();
      values[72]=values[0];
      return{id:entry.id||`horizon-${locationIndex}-${index}`,name:String(entry.name||`Horizont ${index+1}`),horizonProfile:values,obstacles:(entry.obstacles||[]).map(item=>({...item}))};
    }):[{id:x.defaultHorizonProfileId||`horizon-${locationIndex}-standard`,name:'Standardhorizont',horizonProfile:legacyValues.slice(),obstacles:(x.obstacles||[]).map(item=>({...item}))}];
    const defaultId=profiles.some(item=>item.id===x.defaultHorizonProfileId)?x.defaultHorizonProfileId:profiles[0].id;
    const selectedId=profiles.some(item=>item.id===x.selectedHorizonProfileId)?x.selectedHorizonProfileId:defaultId;
    const selected=profiles.find(item=>item.id===selectedId)||profiles[0];
    return{...x,horizonProfiles:profiles,defaultHorizonProfileId:defaultId,selectedHorizonProfileId:selectedId,horizonProfile:selected.horizonProfile.slice(),horizon:Array.from({length:8},(_,index)=>Number(selected.horizonProfile[index*9]||0)),obstacles:selected.obstacles.map(item=>({...item}))};
  });
  out.planning={...base.planning,...(p.planning||{})};
  if(out.planning.locationId&&!out.locations.some(item=>item.id===out.planning.locationId))out.planning.locationId=null;
  if(out.planning.temporaryTelescopeId&&!out.equipment.telescopes.some(item=>item.id===out.planning.temporaryTelescopeId))out.planning.temporaryTelescopeId=null;
  if(out.planning.temporaryCameraId&&!out.equipment.cameras.some(item=>item.id===out.planning.temporaryCameraId))out.planning.temporaryCameraId=null;
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
  const storedBackupConfig=await metaValue('backupConfig',null);
  backupConfig={...backupConfig,...(storedBackupConfig||{})};backupDraft=deepClone(backupConfig);
  const active=await idbGet('meta','activeProfileId'); profile=profiles.find(x=>x.id===active?.value)||profiles.find(x=>x.id==='standard')||profiles[0];
  await setActiveProfile(profile.id); draft=deepClone(profile); currentMainTab=profile.ui?.mainTab||'plan'; currentSettingsTab=profile.ui?.settingsTab||'equipment';
  selectedDateKey=profile.planning.dateKey||dateKeyFor(new Date(),activeLocation().timezone); page=profile.planning.page||1;
  await refreshStorageInfo();
  updateProfileSelectors(); bindGlobal(); render(); registerPwa(); loadCatalog(); fetchWeather();
  window.setTimeout(()=>maybeAutomaticBackup('daily'),1200);
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
async function switchMain(tab){scrollByTab[currentMainTab]=scrollY;if(tab!=='plan')stopCloudMapAnimation();currentMainTab=tab;profile.ui.mainTab=tab;await saveProfile();render();if(tab==='plan'&&!cloudMapData)fetchCloudMap();requestAnimationFrame(()=>scrollTo({top:scrollByTab[tab]||0,behavior:'instant'}));}

function activeLocation(){const id=profile.planning?.locationId||profile.central?.defaultLocationId||profile.selectedLocationId;return profile.locations.find(x=>x.id===id)||profile.locations[0]||standardProfile().locations[0]}
function activeScope(){const id=profile.planning?.temporaryTelescopeId||profile.equipment.selectedTelescopeId;return profile.equipment.telescopes.find(x=>x.id===id)||profile.equipment.telescopes[0]}
function activeCamera(){const id=profile.planning?.temporaryCameraId||profile.equipment.selectedCameraId;return profile.equipment.cameras.find(x=>x.id===id)||profile.equipment.cameras[0]}
function activeMount(){return profile.equipment.mounts?.find(x=>x.id===profile.equipment.selectedMountId)}
function fov(){const s=activeScope(),c=activeCamera();if(!s||!c||!s.focalLength)return null;return {width:57.2958*c.sensorWidth/s.focalLength,height:57.2958*c.sensorHeight/s.focalLength,pixelScale:206.265*c.pixelSize/s.focalLength}}
function esc(v){return String(v??'').replace(/[&<>"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))}
function fmt(v,d=0){return Number.isFinite(v)?Number(v).toFixed(d):'–'}
function toRad(x){return x*Math.PI/180} function toDeg(x){return x*180/Math.PI}
function dateKeyFor(date,tz='Europe/Berlin'){return new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(date)}
function addDays(key,n){const d=new Date(`${key}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function fmtDate(key,tz){return new Intl.DateTimeFormat('de-DE',{timeZone:tz,weekday:'short',day:'2-digit',month:'2-digit'}).format(new Date(`${key}T12:00:00Z`))}
function fmtTime(date,tz){if(!date||isNaN(date))return'–';return new Intl.DateTimeFormat('de-DE',{timeZone:tz,hour:'2-digit',minute:'2-digit'}).format(date)}
function fmtDateTime(date,tz){return new Intl.DateTimeFormat('de-DE',{timeZone:tz,day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(date)}
function clockInputValue(date,tz){
  if(!date||isNaN(date))return'00:00';
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
  const get=type=>parts.find(part=>part.type===type)?.value||'00';
  return`${get('hour')}:${get('minute')}`;
}
function localMinuteOfDay(date,tz){
  const [hour,minute]=clockInputValue(date,tz).split(':').map(Number);
  return hour*60+minute;
}
function nearestFractionForClock(clock,start,end,tz){
  const [hour,minute]=String(clock||'00:00').split(':').map(Number);
  const target=hour*60+minute;
  let bestTime=start.getTime(),bestDistance=Infinity;
  for(let time=start.getTime();time<=end.getTime();time+=60000){
    const value=localMinuteOfDay(new Date(time),tz);
    const distance=Math.min(Math.abs(value-target),1440-Math.abs(value-target));
    if(distance<bestDistance){bestDistance=distance;bestTime=time}
  }
  return clamp((bestTime-start.getTime())/Math.max(1,end-start),0,1);
}

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
function horizonProfilesFor(loc){
  if(!loc)return[];
  if(!Array.isArray(loc.horizonProfiles)||!loc.horizonProfiles.length){
    const values=Array.isArray(loc.horizonProfile)&&loc.horizonProfile.length===73?loc.horizonProfile.slice():Array(73).fill(0);
    values[72]=values[0];
    loc.horizonProfiles=[{id:uid('horizon'),name:'Standardhorizont',horizonProfile:values,obstacles:(loc.obstacles||[]).map(item=>({...item}))}];
    loc.defaultHorizonProfileId=loc.horizonProfiles[0].id;loc.selectedHorizonProfileId=loc.horizonProfiles[0].id;
  }
  return loc.horizonProfiles;
}
function horizonProfileFor(loc,preferredId=null){
  const profiles=horizonProfilesFor(loc);
  const id=preferredId||((loc===activeLocation())?profile.planning?.temporaryHorizonProfileId:null)||loc.selectedHorizonProfileId||loc.defaultHorizonProfileId;
  return profiles.find(item=>item.id===id)||profiles.find(item=>item.id===loc.defaultHorizonProfileId)||profiles[0];
}
function ensureHorizonProfile(loc,preferredId=null){const entry=horizonProfileFor(loc,preferredId);if(!entry)return Array(73).fill(0);if(!Array.isArray(entry.horizonProfile)||entry.horizonProfile.length!==73)entry.horizonProfile=Array(73).fill(0);entry.horizonProfile[72]=entry.horizonProfile[0];return entry.horizonProfile}
function horizonObstacles(loc,preferredId=null){return(horizonProfileFor(loc,preferredId)?.obstacles||[])}
function horizonAt(loc,az,preferredId=null){const normalized=((az%360)+360)%360;const values=ensureHorizonProfile(loc,preferredId);const pos=normalized/5,i=Math.floor(pos),j=Math.min(72,i+1),f=pos-i;return Number(values[i]||0)*(1-f)+Number(values[j]||0)*f}
function syncCardinalHorizon(loc,preferredId=null){const values=ensureHorizonProfile(loc,preferredId);values[72]=values[0];const entry=horizonProfileFor(loc,preferredId);loc.horizonProfile=values.slice();loc.horizon=Array.from({length:8},(_,index)=>Number(values[index*9]||0));loc.obstacles=(entry?.obstacles||[]).map(item=>({...item}))}


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
  const cloud=clamp(Number.isFinite(row.cloud)?row.cloud:0,0,100);
  const visibility=Number.isFinite(row.visibility)?row.visibility:0;
  const wind=Number.isFinite(row.wind)?row.wind:0;
  const high=Number.isFinite(row.cloudHigh)?row.cloudHigh:0;
  const atmosphericTransparency=clamp((visibility/24000)*100,0,100);
  const cloudTransmission=Math.pow(clamp(1-cloud/100,0,1),.8);
  const effectiveTransparency=clamp(atmosphericTransparency*cloudTransmission,0,100);
  return {
    ...row,
    dewGap:Number.isFinite(row.temperature)&&Number.isFinite(row.dewPoint)?row.temperature-row.dewPoint:NaN,
    atmosphericTransparency,
    effectiveTransparency,
    transparency:effectiveTransparency,
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
  const atmosphericTransparency=avg('atmosphericTransparency');
  const seeing=avg('seeing');
  const thresholds=windThresholds();
  const windScore=Math.min(
    wind<thresholds.windGreen?100:wind<=thresholds.windYellow?60:20,
    gust<thresholds.gustGreen?100:gust<=thresholds.gustYellow?60:20
  );
  const dewScore=dewGap>profile.central.dew.green?100:dewGap>=profile.central.dew.yellow?55:15;
  return{rows,cloud,wind,gust,jet,windKmh,gustKmh,jetKmh,dewGap,visibility,transparency,atmosphericTransparency,seeing,windScore,dewScore,view};
}
function scoreObject(obj,stats,weather,window,night){const w=profile.central.weights;const duration=Math.max(.1,(window.end-window.start)/3600000);const altitudeScore=clamp((stats.maxAltitude-15)/60*100,0,100),durationScore=clamp(stats.visibleHours/duration*100,0,100);const moonPenalty=stats.moonAltitude<=0?100:clamp((stats.moonDistance-15)/75*100,0,100)*(1-night.moonIllumination/180);const cloud=weather?100-weather.cloud:55,trans=weather?weather.transparency:55,seeing=weather?weather.seeing:55,wind=weather?weather.windScore:55,dew=weather?weather.dewScore:55;const total=w.clouds*cloud+w.transparency*trans+w.seeing*seeing+w.wind*wind+w.dew*dew+w.moon*moonPenalty+w.altitude*altitudeScore+w.duration*durationScore;return clamp(total/100,0,100)}
function scoreClass(v){return v>=70?'good':v>=45?'warn':'bad'}
function framingSettings(){return{minMarginPercent:10,autoRotate:true,...(profile.central?.framing||{})}}
function normalizedAngle180(value){let result=Number(value)||0;result%=180;if(result<0)result+=180;return result}
function framingAtRotation(obj,rotation){
  const frame=fov();
  if(!frame||!Number(obj.majorArcMin))return{status:'–',code:'unknown',minMargin:NaN,rotation:normalizedAngle180(rotation)};
  const major=Math.max(.0001,Number(obj.majorArcMin)/60),minor=Math.max(.0001,Number(obj.minorArcMin||obj.majorArcMin)/60);
  const a=major/2,b=minor/2,pa=normalizedAngle180((Number(obj.positionAngleDeg)||0)+(Number(profile.planning.objectRotation)||0));
  const delta=toRad(pa-normalizedAngle180(rotation));
  const extentW=Math.sqrt(Math.pow(a*Math.cos(delta),2)+Math.pow(b*Math.sin(delta),2));
  const extentH=Math.sqrt(Math.pow(a*Math.sin(delta),2)+Math.pow(b*Math.cos(delta),2));
  const marginW=(frame.width/2-extentW)/frame.width*100;
  const marginH=(frame.height/2-extentH)/frame.height*100;
  const minMargin=Math.min(marginW,marginH),target=clamp(Number(framingSettings().minMarginPercent)||10,0,45);
  let code,status;
  if(minMargin<0){code='too-large';status='Objekt zu groß für das Bildfeld'}
  else if(minMargin<5){code='extremely-tight';status='Objekt passt nur äußerst knapp'}
  else if(minMargin<target){code='near-edge';status='Objekt nahe am Bildrand'}
  else if(minMargin>=30){code='wide';status='Viel Umfeld'}
  else{code='good';status='Gut gerahmt'}
  return{status,code,minMargin,marginW,marginH,rotation:normalizedAngle180(rotation),major,minor,frame};
}
function optimalFrameRotation(obj){
  if(!framingSettings().autoRotate||!Number.isFinite(Number(obj.positionAngleDeg)))return normalizedAngle180(profile.planning.frameRotation||0);
  let best=null;
  for(let rotation=0;rotation<180;rotation+=1){const result=framingAtRotation(obj,rotation);if(!best||result.minMargin>best.minMargin)best=result}
  return best?.rotation||0;
}
function framingAnalysis(obj,{rotation=null,optimize=true}={}){const chosen=rotation==null?(optimize?optimalFrameRotation(obj):Number(profile.planning.frameRotation)||0):rotation;return framingAtRotation(obj,chosen)}
function fitsSensor(obj){return framingAnalysis(obj).status}

async function loadCatalog(){try{const cached=await idbGet('cache','catalog-v10');if(cached?.value?.length){catalog=mergeCatalog(cached.value);render()}let rows=null,lastError=null;for(const url of [LOCAL_CATALOG_URL,REMOTE_CATALOG_URL]){try{const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw new Error(`${url}: HTTP ${response.status}`);const candidate=await response.json();if(!Array.isArray(candidate)||!candidate.length)throw new Error(`${url}: ungültiger Katalog`);rows=candidate;break}catch(error){lastError=error}}if(!rows)throw lastError||new Error('Kein Katalog verfügbar');const converted=rows.map(r=>({id:r[0],name:r[1],aliases:r[2]||[],type:r[3],raHours:r[4],decDeg:r[5],magnitude:r[6]??null,surfaceBrightness:r[7]??null,majorArcMin:r[8]||0,minorArcMin:r[9]||r[8]||0,constellation:r[10]||'–',recommendedFilters:r[11]||[],catalogs:r[12]||['Zusatzkatalog'],positionAngleDeg:Number.isFinite(r[13])?r[13]:0}));catalog=mergeCatalog(converted);await idbPut('cache',{key:'catalog-v10',value:converted,updatedAt:new Date().toISOString()});render();}catch(err){console.warn('Katalog-Fallback aktiv',err)}}
function mergeCatalog(remote){const map=new Map();for(const o of [...remote,...BUILTIN_OBJECTS]){const key=o.id.replace(/\s/g,'').toUpperCase();map.set(key,{...(map.get(key)||{}),...o,aliases:[...new Set([...(map.get(key)?.aliases||[]),...(o.aliases||[])])],catalogs:[...new Set([...(map.get(key)?.catalogs||[]),...(o.catalogs||[])])]});}return [...map.values()]}

async function fetchWeather(){
  weatherError='';
  weatherModels=[];
  cloudMapData=null;
  cloudMapError='';
  locationComparisonData=null;
  locationComparisonError='';
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
  fetchCloudMap();
}

function cloudMapSettings(source=profile){
  const base=standardProfile().central.cloudMap;
  return{...base,...(source?.central?.cloudMap||{})};
}
function currentCloudMapView(){
  return profile.planning.temporaryCloudMapView||profile.central.cloudMap?.defaultView||'consensus';
}
function cloudMapRange(night){
  const rawStart=night.sunset.getTime()-4*3600000;
  const start=new Date(Math.floor(rawStart/3600000)*3600000);
  return{start,end:new Date(start.getTime()+23*3600000),times:Array.from({length:24},(_,index)=>new Date(start.getTime()+index*3600000))};
}
function cloudMapTimeStepMinutes(){return[15,30,60].includes(Number(profile.planning.cloudMapTimeStepMinutes))?Number(profile.planning.cloudMapTimeStepMinutes):clamp(Number(cloudMapSettings().timeStepMinutes)||30,15,60)}
function cloudDisplayTimes(){if(!cloudMapData?.times?.length)return[];const raw=cloudMapData.times.map(value=>new Date(value).getTime()),step=cloudMapTimeStepMinutes()*60000,start=raw[0],end=raw[raw.length-1];const result=[];for(let time=start;time<=end+1;time+=step)result.push(new Date(Math.min(time,end)).toISOString());return result}
function cloudRawPosition(displayIndex){return clamp((Number(displayIndex)||0)*cloudMapTimeStepMinutes()/60,0,Math.max(0,(cloudMapData?.times?.length||1)-1))}
function cloudMapGrid(loc,settings){
  const size=clamp(Number(settings.gridSize)||7,5,9);
  const radius=clamp(Number(settings.radiusKm)||120,40,250);
  const latPerKm=1/111.32;
  const lonPerKm=1/(111.32*Math.max(.2,Math.cos(toRad(loc.latitude))));
  const points=[];
  for(let y=0;y<size;y++){
    const northKm=radius-(2*radius*y/(size-1));
    for(let x=0;x<size;x++){
      const eastKm=-radius+(2*radius*x/(size-1));
      points.push({
        x,y,
        latitude:loc.latitude+northKm*latPerKm,
        longitude:loc.longitude+eastKm*lonPerKm,
        northKm,eastKm
      });
    }
  }
  return{size,radius,points};
}
function parseCloudApiTime(value){
  const text=String(value||'');
  return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(text)?text:`${text}Z`);
}
function nearestTimeIndex(times,target){
  if(!times.length)return-1;
  let lo=0,hi=times.length-1;
  while(lo<hi){
    const mid=Math.floor((lo+hi)/2);
    if(times[mid]<target)lo=mid+1;else hi=mid;
  }
  if(lo>0&&Math.abs(times[lo-1]-target)<Math.abs(times[lo]-target))return lo-1;
  return lo;
}
function cloudMapCacheKey(loc,settings){
  return`cloud-map-v2:${selectedDateKey}:${loc.latitude.toFixed(3)}:${loc.longitude.toFixed(3)}:${settings.gridSize}:${settings.radiusKm}`;
}
async function fetchCloudModel(key,config,grid,frameTimes,signal){
  const layerKeys=['cloud','cloudLow','cloudMid','cloudHigh','precip'];
  const frames=frameTimes.map(()=>Object.fromEntries(layerKeys.map(layer=>[layer,new Array(grid.points.length).fill(NaN)])));
  const chunkSize=40;
  for(let offset=0;offset<grid.points.length;offset+=chunkSize){
    const chunk=grid.points.slice(offset,offset+chunkSize);
    const startDate=frameTimes[0].toISOString().slice(0,10);
    const endDate=frameTimes.at(-1).toISOString().slice(0,10);
    const url=new URL('https://api.open-meteo.com/v1/forecast');
    url.search=new URLSearchParams({
      latitude:chunk.map(point=>point.latitude.toFixed(4)).join(','),
      longitude:chunk.map(point=>point.longitude.toFixed(4)).join(','),
      hourly:'cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,precipitation',
      models:config.model,
      timezone:'GMT',
      start_date:startDate,
      end_date:endDate
    });
    const response=await fetch(url,{signal});
    if(!response.ok)throw new Error(`${config.name}: HTTP ${response.status}`);
    const payload=await response.json();
    const results=Array.isArray(payload)?payload:[payload];
    for(let localIndex=0;localIndex<results.length;localIndex++){
      const result=results[localIndex];
      const pointIndex=offset+localIndex;
      if(pointIndex>=grid.points.length||!result?.hourly?.time)continue;
      const sourceTimes=result.hourly.time.map(value=>parseCloudApiTime(value).getTime());
      frameTimes.forEach((frameTime,frameIndex)=>{
        const sourceIndex=nearestTimeIndex(sourceTimes,frameTime.getTime());
        const hourly=result.hourly;
        frames[frameIndex].cloud[pointIndex]=Number(hourly.cloud_cover?.[sourceIndex]);
        frames[frameIndex].cloudLow[pointIndex]=Number(hourly.cloud_cover_low?.[sourceIndex]);
        frames[frameIndex].cloudMid[pointIndex]=Number(hourly.cloud_cover_mid?.[sourceIndex]);
        frames[frameIndex].cloudHigh[pointIndex]=Number(hourly.cloud_cover_high?.[sourceIndex]);
        frames[frameIndex].precip[pointIndex]=Number(hourly.precipitation?.[sourceIndex]);
      });
    }
  }
  return{key,name:config.name,frames};
}
async function fetchCloudMap(force=false){
  if(!profile||currentMainTab!=='plan')return;
  const requestId=++cloudMapRequestId;
  const loc=activeLocation();
  const settings=cloudMapSettings();
  const night=nightData(selectedDateKey,loc);
  const range=cloudMapRange(night);
  const grid=cloudMapGrid(loc,settings);
  const key=cloudMapCacheKey(loc,settings);
  if(!force){
    try{
      const cached=await idbGet('cache',key);
      if(cached?.value&&Date.now()-new Date(cached.updatedAt||0).getTime()<90*60000){
        cloudMapData=cached.value;
        cloudMapError='';
        cloudMapLoading=false;
        render();
        return;
      }
    }catch(error){console.warn('Wolkenkarten-Cache nicht lesbar',error)}
  }
  cloudMapLoading=true;
  cloudMapError='';
  cloudMapData=null;
  render();
  cloudMapAbortController?.abort();
  const controller=new AbortController();
  cloudMapAbortController=controller;
  try{
    const settled=await Promise.allSettled(Object.entries(WEATHER_MODEL_CONFIG).map(([modelKey,config])=>fetchCloudModel(modelKey,config,grid,range.times,controller.signal)));
    if(requestId!==cloudMapRequestId)return;
    const models={};
    settled.forEach(result=>{if(result.status==='fulfilled')models[result.value.key]=result.value});
    const failures=settled.filter(result=>result.status==='rejected');
    if(!Object.keys(models).length)throw new Error('Keine Wolkenkartendaten konnten geladen werden.');
    cloudMapData={
      key,locationId:loc.id,locationName:loc.name,latitude:loc.latitude,longitude:loc.longitude,
      selectedDateKey,gridSize:grid.size,radiusKm:grid.radius,points:grid.points,times:range.times.map(time=>time.toISOString()),
      models,updatedAt:new Date().toISOString()
    };
    cloudMapError=failures.length?`${failures.length} Modell(e) der Wolkenkarte derzeit nicht verfügbar.`:'';
    try{await idbPut('cache',{key,value:cloudMapData,updatedAt:new Date().toISOString()})}catch(error){console.warn('Wolkenkarte konnte nicht zwischengespeichert werden',error)}
  }catch(error){
    if(requestId!==cloudMapRequestId)return;
    cloudMapError=error?.message||'Wolkenkarte konnte nicht geladen werden.';
  }finally{
    if(requestId===cloudMapRequestId){cloudMapLoading=false;cloudMapAbortController=null;render()}
  }
}
function cloudFrameValues(view,layer,frameIndex){
  if(!cloudMapData)return{values:[],spread:[]};
  const rawPosition=Number(frameIndex)||0,lower=clamp(Math.floor(rawPosition),0,cloudMapData.times.length-1),upper=clamp(Math.ceil(rawPosition),0,cloudMapData.times.length-1),fraction=rawPosition-lower;
  const interpolate=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)?a+(b-a)*fraction:Number.isFinite(a)?a:b;
  const modelValues=(model,key)=>{const a=model?.frames?.[lower]?.[layer]||[],b=model?.frames?.[upper]?.[layer]||a;return new Array(cloudMapData.points.length).fill(NaN).map((_,index)=>interpolate(Number(a[index]),Number(b[index])))};
  if(view!=='consensus'){const values=modelValues(cloudMapData.models[view],view);return{values,spread:new Array(values.length).fill(0)}}
  const weights=profile.central.weatherModels?.weights||{},count=cloudMapData.points.length,values=new Array(count).fill(NaN),spread=new Array(count).fill(NaN);
  const available=Object.entries(cloudMapData.models).map(([key,model])=>[key,modelValues(model,key)]);
  for(let index=0;index<count;index++){
    const entries=available.map(([key,array])=>({value:Number(array[index]),weight:Number(weights[key]||0)})).filter(entry=>Number.isFinite(entry.value));
    if(!entries.length)continue;
    const positive=entries.filter(entry=>entry.weight>0),weightedEntries=positive.length?positive:entries.map(entry=>({...entry,weight:1})),weightSum=weightedEntries.reduce((sum,entry)=>sum+entry.weight,0);
    const mean=weightedEntries.reduce((sum,entry)=>sum+entry.value*entry.weight,0)/weightSum;values[index]=mean;spread[index]=Math.sqrt(weightedEntries.reduce((sum,entry)=>sum+Math.pow(entry.value-mean,2)*entry.weight,0)/weightSum);
  }
  return{values,spread};
}
function cloudFrameStats(view,layer,frameIndex){
  const data=cloudFrameValues(view,layer,frameIndex);
  const finite=data.values.filter(Number.isFinite);
  const spreads=data.spread.filter(Number.isFinite);
  const center=Math.floor((cloudMapData?.points.length||1)/2);
  return{
    ...data,
    average:finite.length?finite.reduce((a,b)=>a+b,0)/finite.length:NaN,
    center:Number(data.values[center]),
    uncertainty:spreads.length?spreads.reduce((a,b)=>a+b,0)/spreads.length:NaN
  };
}
function estimateCloudMovement(view,layer,displayFrameIndex){
  if(!cloudMapData?.times?.length)return null;
  const size=cloudMapData.gridSize,rawCenter=cloudRawPosition(displayFrameIndex),base=clamp(Math.floor(rawCenter),0,cloudMapData.times.length-2),pairs=[];
  const normalized=(values)=>{const finite=values.filter(Number.isFinite);const mean=finite.reduce((a,b)=>a+b,0)/Math.max(1,finite.length),sd=Math.sqrt(finite.reduce((sum,v)=>sum+(v-mean)**2,0)/Math.max(1,finite.length))||1;return values.map(v=>Number.isFinite(v)?(v-mean)/sd:0)};
  const correlationShift=(a,b)=>{a=normalized(a);b=normalized(b);let best=null,second=null;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){if(dx===0&&dy===0)continue;let sum=0,count=0;for(let y=0;y<size;y++)for(let x=0;x<size;x++){const xx=x+dx,yy=y+dy;if(xx<0||xx>=size||yy<0||yy>=size)continue;sum+=a[y*size+x]*b[yy*size+xx];count++}const score=count?sum/count:-Infinity;const candidate={dx,dy,score};if(!best||score>best.score){second=best;best=candidate}else if(!second||score>second.score)second=candidate}if(!best)return null;return{...best,separation:best.score-(second?.score??best.score)}};
  for(let offset=-1;offset<=1;offset++){const index=base+offset;if(index<0||index>=cloudMapData.times.length-1)continue;const a=cloudFrameValues(view,layer,index).values,b=cloudFrameValues(view,layer,index+1).values,shift=correlationShift(a,b);if(shift&&shift.score>.12)pairs.push(shift)}
  if(!pairs.length)return{reliable:false,direction:'Bewegungsrichtung unsicher',distance:0,confidence:0};
  const spacing=2*cloudMapData.radiusKm/Math.max(1,size-1),vectors=pairs.map(item=>({east:item.dx*spacing,north:-item.dy*spacing,weight:Math.max(.01,item.score+item.separation)}));
  const weight=vectors.reduce((sum,item)=>sum+item.weight,0),east=vectors.reduce((sum,item)=>sum+item.east*item.weight,0)/weight,north=vectors.reduce((sum,item)=>sum+item.north*item.weight,0)/weight,distance=Math.hypot(east,north);
  const agreement=vectors.reduce((sum,item)=>{const len=Math.hypot(item.east,item.north)||1;return sum+(item.east*east+item.north*north)/(len*Math.max(distance,.001))*item.weight},0)/weight;
  const confidence=clamp((pairs.reduce((sum,item)=>sum+item.score,0)/pairs.length)*.7+agreement*.3,0,1);
  if(distance<spacing*.25||confidence<.32)return{reliable:false,direction:'Bewegungsrichtung unsicher',distance,confidence};
  const azimuth=(toDeg(Math.atan2(east,north))+360)%360;
  return{reliable:true,distance,east,north,azimuth,direction:`Richtung ${cardinal(azimuth)}`,cardinal:cardinal(azimuth),confidence};
}
function scheduleCloudMapProfileSave(){
  clearTimeout(cloudMapSaveTimer);
  cloudMapSaveTimer=setTimeout(()=>saveProfile(),500);
}
function render(){
  document.querySelectorAll('[data-main-tab]').forEach(button=>button.classList.toggle('active',button.dataset.mainTab===currentMainTab));
  document.getElementById('headerProfileName').textContent=profile.name;
  app.innerHTML=currentMainTab==='plan'?renderPlan():renderSettings();
  bindRendered();
  drawMiniCharts();
  drawLargeCharts();
  drawCloudMap();
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
  const loc=activeLocation(),keys=dateKeys();
  if(!keys.includes(selectedDateKey))selectedDateKey=keys[0];
  const night=nightData(selectedDateKey,loc),windowRange=planningWindow(night,profile.planning.planningWindow),weather=weatherForWindow(windowRange),objects=computeObjects(windowRange,night,weather);
  currentComputedObjects=objects;
  const display=profile.central.listDisplay.profiles[currentDisplayProfile()]||DISPLAY_PROFILES.standard;
  profile.planning.pageSize=display.pageSize||profile.planning.pageSize||20;
  const totalPages=Math.max(1,Math.ceil(objects.length/profile.planning.pageSize));page=clamp(page,1,totalPages);
  const start=(page-1)*profile.planning.pageSize,shown=objects.slice(start,start+profile.planning.pageSize);
  if(profile.planning.detailsOpen&&!shown.some(item=>item.object.id===profile.planning.selectedObjectId))profile.planning.detailsOpen=false;
  const currentWeather=currentWeatherView(),defaultWeather=profile.central.weatherModels.defaultView||'consensus';
  const locationOptions=profile.locations.map(item=>`<option value="${esc(item.id)}" ${item.id===loc.id?'selected':''}>${esc(item.name)}${item.id===profile.central.defaultLocationId?' (Standard)':''}</option>`).join('');
  const scope=activeScope(),camera=activeCamera(),mount=activeMount(),horizon=horizonProfileFor(loc);
  const scopeOptions=profile.equipment.telescopes.map(item=>`<option value="${esc(item.id)}" ${item.id===scope?.id?'selected':''}>${esc(item.name)}${item.id===profile.equipment.selectedTelescopeId?' (Standard)':''}</option>`).join('');
  const cameraOptions=profile.equipment.cameras.map(item=>`<option value="${esc(item.id)}" ${item.id===camera?.id?'selected':''}>${esc(item.name)}${item.id===profile.equipment.selectedCameraId?' (Standard)':''}</option>`).join('');
  const horizonOptions=horizonProfilesFor(loc).map(item=>`<option value="${esc(item.id)}" ${item.id===horizon?.id?'selected':''}>${esc(item.name)}${item.id===loc.defaultHorizonProfileId?' (Standard)':''}</option>`).join('');
  return `<div data-page="plan">
    <section class="card">
      <div class="section-title-row"><div><h2>Planungsnacht</h2><div class="muted">Standort und Datum gelten nur für diese Planung. Den Standardstandort legst du in den Einstellungen fest.</div></div><button id="weatherRefresh">Wetter aktualisieren</button></div>
      <div class="planning-night-selector" style="margin-top:14px"><label class="planning-location-select">Standort für diese Planung<select id="planningLocationSelect">${locationOptions}</select><span class="planning-location-coordinates">${fmt(loc.latitude,4)}°, ${fmt(loc.longitude,4)}° · ${fmt(Number(loc.elevation)||0)} m</span></label><div class="date-buttons">${keys.map((key,index)=>`<button data-date="${key}" class="${key===selectedDateKey?'active':''}">${index===0?'Heute':index===1?'Morgen':`+${index}`}<br><span class="small">${fmtDate(key,loc.timezone)}</span></button>`).join('')}</div></div>
      <div class="grid four" style="margin-top:14px"><div class="metric"><div class="label">Sonnenuntergang</div><div class="value">${fmtTime(night.sunset,loc.timezone)}</div></div><div class="metric"><div class="label">Gewählter Zeitraum</div><div class="value">${fmtTime(windowRange.start,loc.timezone)}–${fmtTime(windowRange.end,loc.timezone)}</div><div class="small muted">${windowRange.label}</div></div><div class="metric"><div class="label">Astronomische Dunkelheit</div><div class="value">${fmtTime(night.astronomicalDusk,loc.timezone)}–${fmtTime(night.astronomicalDawn,loc.timezone)}</div></div><div class="metric"><div class="label">Sonnenaufgang</div><div class="value">${fmtTime(night.sunrise,loc.timezone)}</div></div></div>
      <div class="grid four" style="margin-top:12px"><div class="metric"><div class="label">Mondaufgang</div><div class="value">${fmtTime(night.moonrise,loc.timezone)}</div></div><div class="metric"><div class="label">Mondkulmination</div><div class="value">${fmtTime(night.moonTransit,loc.timezone)} · ${fmt(night.moonMaxAltitude)}°</div></div><div class="metric"><div class="label">Monduntergang</div><div class="value">${fmtTime(night.moonset,loc.timezone)}</div></div><div class="metric"><div class="label">Mondbeleuchtung</div><div class="value">${fmt(night.moonIllumination)} %</div></div></div>
    </section>
    <section class="card">
      <div class="section-title-row"><h2>Profile für diese Planung</h2><span class="small muted">Alle Auswahlen sind temporär. Dauerhafte Standards werden ausschließlich in den Einstellungen geändert.</span></div>
      <div class="toolbar planning-profile-toolbar">
        <label>Planungszeitraum<select id="planningWindowTop">${planningWindowOptions(profile.planning.planningWindow)}</select></label>
        <label>Teleskop<select id="planTelescope">${scopeOptions}</select></label>
        <label>Kamera<select id="planCamera">${cameraOptions}</select></label>
        <label>Horizontprofil<select id="planHorizonProfile">${horizonOptions}</select></label>
        <label>Aufnahmequalitätsprofil<select id="planWindProfile"><option value="">Standard: ${esc(profile.central.windProfiles[profile.central.activeWindProfile].name)}</option>${Object.entries(profile.central.windProfiles).map(([key,value])=>`<option value="${key}" ${profile.planning.temporaryWindProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label>
        <label>Darstellungsprofil<select id="planDisplayProfile"><option value="">Standard: ${esc(profile.central.listDisplay.profiles[profile.central.listDisplay.activeProfile].name)}</option>${Object.entries(profile.central.listDisplay.profiles).map(([key,value])=>`<option value="${key}" ${profile.planning.temporaryDisplayProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label>
        <label>Wetterdarstellung<select id="planWeatherView"><option value="">Standard: ${esc(weatherViewLabel(defaultWeather))}</option>${WEATHER_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${profile.planning.temporaryWeatherView===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      </div>
      <div class="small muted" style="margin-top:8px">Aktiv: ${esc(scope?.name||'–')} · ${esc(camera?.name||'–')} · ${esc(mount?.name||'keine Montierung')} · ${esc(horizon?.name||'kein Horizont')}. Änderungen wirken sofort auf Objektliste, Rahmungsbewertung und Detailansicht.</div>
    </section>
    ${renderWeather(windowRange,weather,loc,night)}${renderCloudMap(windowRange,loc,night)}${renderMeteoblue(loc)}
    <section class="card"><div class="section-title-row"><h2>Objektauswahl</h2><span class="muted">${objects.length} Treffer aus ${catalog.length} Katalogobjekten</span></div>${renderFilters()}${pagination(totalPages,objects.length)}${renderObjectTable(shown,display.columns,loc,windowRange,night)}${pagination(totalPages,objects.length)}</section>
  </div>`;
}
function computeObjects(window,night,weather){const p=profile.planning,needle=p.search.trim().toLocaleLowerCase('de');return catalog.filter(o=>!p.catalogs?.length||o.catalogs.some(c=>p.catalogs.includes(c))).filter(o=>!p.types?.length||p.types.includes(o.type)).filter(o=>o.magnitude==null||o.magnitude<=p.maxMagnitude).filter(o=>!o.majorArcMin||(o.majorArcMin>=p.minSize&&o.majorArcMin<=p.maxSize)).filter(o=>!needle||[o.id,o.name,o.constellation,...(o.aliases||[])].join(' ').toLocaleLowerCase('de').includes(needle)).map(object=>{const stats=objectStats(object,window,activeLocation(),p.minAltitude),framing=framingAnalysis(object);return{object,stats,score:scoreObject(object,stats,weather,window,night),fit:framing.status,framing}}).filter(x=>x.stats.maxAltitude>=p.minAltitude&&x.stats.visibleHours>=p.minVisibleHours&&(x.stats.moonDistance>=p.minMoonDistance||x.stats.moonAltitude<=0)&&(!p.onlyFits||x.framing.code!=='too-large')).sort((a,b)=>b.score-a.score)}
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
    case'framing':return`<td><button data-frame-object="${esc(object.id)}">${esc(item.fit)}</button><div class="small muted">Mindestrand ${Number.isFinite(item.framing?.minMargin)?fmt(item.framing.minMargin,1)+' %':'–'}</div></td>`;
    case'miniChart':return`<td><canvas class="mini-chart" width="230" height="92" data-points="${encodeURIComponent(JSON.stringify(stats.points.map(point=>[point.t.getTime(),point.alt])))}" data-start="${windowRange.start.getTime()}" data-end="${windowRange.end.getTime()}" data-civil-start="${night.civilDusk.getTime()}" data-civil-end="${night.civilDawn.getTime()}" data-astro-start="${night.astronomicalDusk.getTime()}" data-astro-end="${night.astronomicalDawn.getTime()}" data-naut-start="${night.nauticalDusk.getTime()}" data-naut-end="${night.nauticalDawn.getTime()}" data-min-alt="${profile.planning.minAltitude}"></canvas></td>`;
    case'bestTime':return`<td>${fmtTime(stats.bestTime,loc.timezone)}</td>`;
    case'moonDistance':return`<td>${fmt(stats.moonDistance)}°</td>`;
    case'weather':return`<td>${weatherModels.length?esc(weatherViewLabel()):'–'}</td>`;
    case'size':return`<td>${fmt(object.majorArcMin)}′ × ${fmt(object.minorArcMin)}′</td>`;
    case'magnitude':return`<td>${object.magnitude??'–'}${object.magnitude!=null?' mag':''}</td>`;
    case'filters':return`<td>${esc((object.recommendedFilters||[]).join(', ')||'–')}</td>`;
    default:return'<td>–</td>';
  }
}

function detailTimeState(o,night,loc){
  const fraction=clamp(Number(profile.planning.detailTimeFraction)||0,0,1);
  const time=new Date(night.sunset.getTime()+(night.sunrise-night.sunset)*fraction);
  const altitudeValue=altitude(o.raHours,o.decDeg,time,loc.latitude,loc.longitude);
  const azimuthValue=azimuth(o.raHours,o.decDeg,time,loc.latitude,loc.longitude);
  return{fraction,time,altitude:altitudeValue,azimuth:azimuthValue};
}
function hourlyObjectSamples(o,night,loc){
  const samples=[];
  let previousKey='';
  for(let time=night.sunset.getTime();time<=night.sunrise.getTime();time+=60000){
    const date=new Date(time);
    const clock=clockInputValue(date,loc.timezone);
    if(clock.endsWith(':00')&&clock!==previousKey){
      const altitudeValue=altitude(o.raHours,o.decDeg,date,loc.latitude,loc.longitude);
      const azimuthValue=azimuth(o.raHours,o.decDeg,date,loc.latitude,loc.longitude);
      samples.push({time,clock,altitude:altitudeValue,azimuth:azimuthValue});
      previousKey=clock;
    }
  }
  return samples;
}
function renderDetailTimeControls(o,night,loc,variant='altitude'){
  const state=detailTimeState(o,night,loc);
  const points=objectStats(o,{start:night.sunset,end:night.sunrise},loc,profile.planning.minAltitude).points.map(point=>[
    point.t.getTime(),Number(point.alt.toFixed(3)),Number(point.az.toFixed(3))
  ]);
  return`<div class="detail-time-controller" data-detail-time-controller data-start="${night.sunset.getTime()}" data-end="${night.sunrise.getTime()}" data-timezone="${esc(loc.timezone)}" data-points="${encodeURIComponent(JSON.stringify(points))}">
    <div class="detail-time-head">
      <div><div class="eyebrow">Gewählte Aufnahmezeit</div><strong data-detail-time-label>${fmtDateTime(state.time,loc.timezone)}</strong><div class="small muted" data-detail-time-position>Höhe ${fmt(state.altitude)}° · Azimut ${fmt(state.azimuth)}° (${cardinal(state.azimuth)})</div></div>
      <div class="detail-time-actions">
        <button type="button" data-detail-time-step="-15">−15 min</button>
        <label>Uhrzeit<input type="time" data-detail-time-clock value="${clockInputValue(state.time,loc.timezone)}"></label>
        <button type="button" data-detail-time-step="15">+15 min</button>
        ${variant==='horizon'?`<label class="chip"><input type="checkbox" data-detail-ground-toggle ${profile.planning.showGroundHorizon!==false?'checked':''}>Boden/Horizont anzeigen</label>`:''}
      </div>
    </div>
    <input class="detail-time-slider" type="range" min="0" max="1000" step="1" value="${Math.round(state.fraction*1000)}" data-detail-time-slider aria-label="Zeit zwischen Sonnenuntergang und Sonnenaufgang">
    <div class="detail-time-limits"><span>${fmtTime(night.sunset,loc.timezone)}</span><span>${fmtTime(night.sunrise,loc.timezone)}</span></div>
  </div>`;
}
function renderTwilightLegend(){
  return`<div class="twilight-legend" aria-label="Legende der Dämmerungsphasen">
    <span><i class="legend-civil"></i>Bürgerliche Dämmerung</span>
    <span><i class="legend-nautical"></i>Nautische Dämmerung</span>
    <span><i class="legend-astronomical"></i>Astronomische Dämmerung</span>
    <span><i class="legend-night"></i>Astronomische Nacht</span>
    <span><i class="legend-selected"></i>Gewählter Planungszeitraum</span>
    <span><i class="legend-current"></i>Gewählte Aufnahmezeit</span>
  </div>`;
}
function renderHourlyAltitudeStrip(o,night,loc){
  const samples=hourlyObjectSamples(o,night,loc);
  return`<div class="hourly-altitude-strip" aria-label="Objekthöhe je voller Stunde">${samples.map(sample=>`<div class="hourly-altitude-item"><strong>${esc(sample.clock)}</strong><span>${fmt(sample.altitude)}°</span><small>${cardinal(sample.azimuth)}</small></div>`).join('')}</div>`;
}
function renderObjectDetails(o,windowRange,loc,night){
  const fullNight={start:night.sunset,end:night.sunrise},horizonEntry=horizonProfileFor(loc);
  const fullStats=objectStats(o,fullNight,loc,profile.planning.minAltitude),selectedStats=objectStats(o,windowRange,loc,profile.planning.minAltitude);
  const altitudePoints=fullStats.points.map(point=>[point.t.getTime(),Number(point.alt.toFixed(3)),Number(point.az.toFixed(3)),Number(horizonAt(loc,point.az,horizonEntry?.id).toFixed(3))]);
  const horizonPoints=Array.from({length:73},(_,index)=>[index*5,Number(horizonAt(loc,index*5,horizonEntry?.id).toFixed(3))]);
  const obstacles=horizonObstacles(loc,horizonEntry?.id).map(item=>({name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0}));
  const detailTime=detailTimeState(o,night,loc),horizonOptions=horizonProfilesFor(loc).map(item=>`<option value="${esc(item.id)}" ${item.id===horizonEntry?.id?'selected':''}>${esc(item.name)}${item.id===loc.defaultHorizonProfileId?' (Standard)':''}</option>`).join('');
  return`<div class="object-detail-card" id="objectDetail-${esc(o.id)}">
    <div class="object-detail-header"><div><div class="eyebrow">Objektdetails</div><h2>${esc(o.id)} · ${esc(o.name)}</h2></div><button type="button" class="close-detail-button" data-close-object-details aria-label="Detailansicht schließen">✕ Details schließen</button></div>
    <div class="grid four object-detail-metrics"><div class="metric"><div class="label">Maximalhöhe im Planungszeitraum</div><div class="value">${fmt(selectedStats.maxAltitude)}°</div></div><div class="metric"><div class="label">Beste Zeit</div><div class="value">${fmtTime(selectedStats.bestTime,loc.timezone)}</div></div><div class="metric"><div class="label">Sichtbar über Grenzhöhe</div><div class="value">${fmt(selectedStats.visibleHours,1)} h</div></div><div class="metric"><div class="label">Mondabstand</div><div class="value">${fmt(selectedStats.moonDistance)}°</div></div></div>
    ${renderFraming(o,windowRange,loc)}
    <details class="object-chart-panel" ${profile.central.detailPanels?.altitudeCollapsed?'':'open'}><summary>Höhenkurve</summary><div class="chart-description">Sonnenuntergang bis Sonnenaufgang; der gewählte Planungszeitraum ist hervorgehoben. Schieberegler, Uhrzeitfeld, Kurvenklick und Horizontansicht verwenden dieselbe Aufnahmezeit.</div>${renderDetailTimeControls(o,night,loc,'altitude')}<canvas class="large-altitude-chart" width="1400" height="430" data-points="${encodeURIComponent(JSON.stringify(altitudePoints))}" data-start="${night.sunset.getTime()}" data-end="${night.sunrise.getTime()}" data-selected-start="${windowRange.start.getTime()}" data-selected-end="${windowRange.end.getTime()}" data-civil-start="${night.civilDusk.getTime()}" data-civil-end="${night.civilDawn.getTime()}" data-naut-start="${night.nauticalDusk.getTime()}" data-naut-end="${night.nauticalDawn.getTime()}" data-astro-start="${night.astronomicalDusk.getTime()}" data-astro-end="${night.astronomicalDawn.getTime()}" data-current-time="${detailTime.time.getTime()}" data-min-alt="${profile.planning.minAltitude}" data-timezone="${esc(loc.timezone)}"></canvas>${renderTwilightLegend()}${renderHourlyAltitudeStrip(o,night,loc)}</details>
    <details class="object-chart-panel" ${profile.central.detailPanels?.horizonCollapsed?'':'open'}><summary>Horizontansicht</summary><div class="chart-description horizon-detail-header"><span>Objektbahn und persönlicher Horizont. Die Aufnahmezeit ist mit der Höhenkurve synchronisiert.</span><label>Horizontprofil für diese Planung<select id="detailHorizonProfileSelect">${horizonOptions}</select></label></div>${renderDetailTimeControls(o,night,loc,'horizon')}<canvas class="large-horizon-chart" width="1400" height="430" data-horizon="${encodeURIComponent(JSON.stringify(horizonPoints))}" data-track="${encodeURIComponent(JSON.stringify(altitudePoints.map(point=>[point[2],point[1],point[0]])))}" data-obstacles="${encodeURIComponent(JSON.stringify(obstacles))}" data-selected-start="${windowRange.start.getTime()}" data-selected-end="${windowRange.end.getTime()}" data-current-time="${detailTime.time.getTime()}" data-show-ground="${profile.planning.showGroundHorizon!==false}" data-timezone="${esc(loc.timezone)}"></canvas></details>
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
      <div class="metric"><div class="label">Effektive Transparenz</div><div class="value ${valueClass(selectedSummary.transparency)}">${fmt(selectedSummary.transparency)}/100</div><div class="small muted">Atmosphäre ohne Wolken: ${fmt(selectedSummary.atmosphericTransparency)}/100</div></div>
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
              <th rowspan="2">Seeing*</th><th rowspan="2">Effektive Transparenz*</th>
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
              <td class="weather-cell ${valueClass(row.transparency)}" title="Atmosphärische Transparenz ohne Wolkeneinfluss: ${fmt(row.atmosphericTransparency)}/100"><span class="quality-pill ${valueClass(row.transparency)}">${fmt(row.transparency)}</span><div class="small muted">atm. ${fmt(row.atmosphericTransparency)}</div></td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>
      <div class="small muted weather-footnote">Die farbliche Bewertung bezieht sich auf die erwartete Aufnahmequalität. Der aktuell gewählte Planungszeitraum ist in der Tabelle hervorgehoben. * Seeing und Transparenz sind abgeleitete Tendenzen. Die effektive Transparenz berücksichtigt die Gesamtbewölkung; der kleine atmosphärische Wert zeigt die wolkenunabhängige Klarheit. Seeing ist kein gemessener Bogensekundenwert.</div>
    </details>
  </section>`;
}

function renderCloudMap(windowRange,loc,night){
  const settings=cloudMapSettings(),view=currentCloudMapView(),layer=profile.planning.cloudMapLayer||settings.defaultLayer||'cloud',mode=profile.planning.cloudMapMode||settings.defaultMode||'clouds',displayTimes=cloudMapData?cloudDisplayTimes():cloudMapRange(night).times.map(time=>time.toISOString()),frameCount=displayTimes.length||1,frameIndex=clamp(Number(profile.planning.cloudMapFrame)||0,0,Math.max(0,frameCount-1)),time=new Date(displayTimes[frameIndex]),rawPosition=cloudMapData?cloudRawPosition(frameIndex):frameIndex,stats=cloudMapData?cloudFrameStats(view,layer,rawPosition):null,movement=cloudMapData?estimateCloudMovement(view,layer,frameIndex):null;
  const viewOptions=CLOUD_MAP_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${view===key?'selected':''}>${esc(label)}</option>`).join(''),layerOptions=CLOUD_MAP_LAYER_OPTIONS.map(([key,label])=>`<option value="${key}" ${layer===key?'selected':''}>${esc(label)}</option>`).join(''),modeOptions=CLOUD_MAP_MODE_OPTIONS.map(([key,label])=>`<option value="${key}" ${mode===key?'selected':''}>${esc(label)}</option>`).join(''),status=cloudMapError?`<div class="notice warn">${esc(cloudMapError)}</div>`:'',compareRows=locationComparisonData?.rows||[],step=cloudMapTimeStepMinutes();
  return`<section class="card cloud-map-card"><div class="section-title-row"><div><div class="eyebrow">Animierte 24-Stunden-Prognose</div><h2>Astro-Wolkenmodell rund um ${esc(loc.name)}</h2><div class="small muted">Gewichteter Konsens oder Einzelmodell · Zwischenbilder werden zeitlich interpoliert</div></div><button id="cloudMapReload">${cloudMapLoading?'Lädt …':'Wolkenkarte aktualisieren'}</button></div>${status}<details id="cloudMapDetails" ${settings.collapsed?'':'open'}><summary>Wolkenbewegung und Modellabweichung anzeigen</summary>
    <div class="toolbar cloud-map-toolbar" style="margin-top:12px"><label>Darstellung<select id="cloudMapView">${viewOptions}</select></label><label>Wolkenschicht<select id="cloudMapLayer">${layerOptions}</select></label><label>Kartenmodus<select id="cloudMapMode">${modeOptions}</select></label><label>Zeitschritt<select id="cloudMapTimeStep">${[15,30,60].map(value=>`<option value="${value}" ${step===value?'selected':''}>${value} Minuten${value===30?' (Standard)':''}</option>`).join('')}</select></label></div>
    ${cloudMapLoading&&!cloudMapData?`<div class="loading-card"><div class="spinner"></div><p>${settings.gridSize*settings.gridSize} Prognosepunkte für drei Wettermodelle werden geladen …</p></div>`:cloudMapData?`<div class="cloud-map-stage" style="margin-top:12px"><canvas id="cloudMapCanvas" width="1400" height="720"></canvas><div class="cloud-map-legend" id="cloudMapLegend"></div><div class="cloud-map-movement" id="cloudMapMovement">${movement?.reliable?`Geschätzte Verlagerung: ${esc(movement.direction)} · ${fmt(movement.distance,0)} km/h · Sicherheit ${fmt(movement.confidence*100)} %`:'Bewegungsrichtung unsicher'}</div></div>`:`<div class="notice warn" style="margin-top:12px">Noch keine Wolkenkartendaten vorhanden.</div>`}
    <div class="grid four cloud-map-summary"><div class="metric"><div class="label">Kartenzeit</div><div class="value" id="cloudMapTimeLabel">${fmtDateTime(time,loc.timezone)}</div></div><div class="metric"><div class="label">Am Standort</div><div class="value" id="cloudMapCenterValue">${stats?`${fmt(stats.center)} %`:'–'}</div></div><div class="metric"><div class="label">Kartenmittel</div><div class="value" id="cloudMapAverageValue">${stats?`${fmt(stats.average)} %`:'–'}</div></div><div class="metric"><div class="label">Modellabweichung</div><div class="value" id="cloudMapSpreadValue">${stats?`${fmt(stats.uncertainty,1)} %-Punkte`:'–'}</div></div></div>
    <div class="cloud-map-time-controls"><button id="cloudMapPrev">−${step} min</button><button id="cloudMapPlay">${cloudMapAnimationTimer?'Pause':'▶ Abspielen'}</button><input id="cloudMapTime" type="range" min="0" max="${Math.max(0,frameCount-1)}" step="1" value="${frameIndex}" ${cloudMapData?'':'disabled'}><button id="cloudMapNext">+${step} min</button></div>
    <div class="small muted" style="margin-top:8px">${cloudMapData?`${cloudMapData.gridSize*cloudMapData.gridSize} Prognosepunkte · Radius ${cloudMapData.radiusKm} km · ${Object.values(cloudMapData.models).map(model=>esc(model.name)).join(', ')}`:`Geplante Auflösung: ${settings.gridSize*settings.gridSize} Prognosepunkte`} · 15-/30-Minuten-Bilder sind interpoliert und erhöhen nicht die Wettermodellgenauigkeit.</div>
    <details class="location-comparison" style="margin-top:14px"><summary>Gespeicherte Standorte vergleichen</summary><div class="section-title-row" style="margin-top:10px"><div class="small muted">Punktprognosen mit geringer Datenmenge.</div><button id="loadLocationComparison">${locationComparisonLoading?'Lädt …':'Vergleich laden'}</button></div>${locationComparisonError?`<div class="notice warn">${esc(locationComparisonError)}</div>`:''}${compareRows.length?`<div class="weather-scroll"><table class="weather-table"><thead><tr><th>Standort</th><th>Ø Wolken</th><th>Modellstreuung</th></tr></thead><tbody>${compareRows.map(row=>`<tr><td>${esc(row.name)}</td><td>${fmt(row.cloud)} %</td><td>${fmt(row.spread,1)} %-Punkte</td></tr>`).join('')}</tbody></table></div>`:'<div class="small muted">Noch kein Standortvergleich geladen.</div>'}</details>
  </details></section>`;
}

function meteoblueSlugPart(value){
  return String(value||'').trim().toLocaleLowerCase('de').replace(/[’']/g,'').replace(/[^a-z0-9\u00c0-\u024f]+/gi,'-').replace(/^-+|-+$/g,'');
}
function meteoblueLocationInfo(loc){
  const geonameId=Number(loc.geonameId)||(/tübingen/i.test(loc.name)?2820860:0);
  let path=loc.meteobluePath||'';
  if(!path&&geonameId){
    const city=String(loc.name||'').split(',')[0].trim();
    const country=loc.country||String(loc.name||'').split(',').at(-1)||'Deutschland';
    const citySlug=meteoblueSlugPart(city),countrySlug=meteoblueSlugPart(country);
    if(citySlug&&countrySlug)path=`${citySlug}_${countrySlug}_${geonameId}`;
  }
  const encodedPath=path?path.split('_').map(encodeURIComponent).join('_'):'';
  const fixed=Boolean(encodedPath);
  const seeingWidget=fixed?`https://www.meteoblue.com/de/wetter/widget/seeing/${encodedPath}?geoloc=fixed&noground=0`:'https://www.meteoblue.com/de/wetter/widget/seeing?geoloc=detect&noground=0';
  const seeingPage=fixed?`https://www.meteoblue.com/de/wetter/outdoorsports/seeing/${encodedPath}`:'https://www.meteoblue.com/de/wetter/outdoorsports/seeing';
  const mapBase=fixed?`https://www.meteoblue.com/de/wetter/maps/widget/${encodedPath}`:'https://www.meteoblue.com/de/wetter/maps/widget';
  const mapParams=new URLSearchParams({
    windAnimation:'1',gust:'1',satellite:'1',cloudsAndPrecipitation:'1',temperature:'1',sunshine:'1',extremeForecastIndex:'1',
    geoloc:fixed?'fixed':'detect',tempunit:'C',windunit:'km%2Fh',lengthunit:'metric',zoom:'6',autowidth:'auto'
  });
  const mapWidget=`${mapBase}?${mapParams.toString()}`;
  const mapPage=fixed?`https://www.meteoblue.com/de/wetter/maps/${encodedPath}`:'https://www.meteoblue.com/de/wetter/maps';
  return{fixed,seeingWidget,seeingPage,mapWidget,mapPage};
}

function renderFraming(o,windowRange,loc){
  const setup=fov(),aspect=2.15,setupW=setup?.width||1.5,setupH=setup?.height||1;
  const objectW=Math.max(.02,(Number(o.majorArcMin)||1)/60),objectH=Math.max(.02,(Number(o.minorArcMin)||Number(o.majorArcMin)||1)/60);
  const frameRotation=normalizedAngle180(profile.planning.frameRotation||0),objectRotation=normalizedAngle180((Number(o.positionAngleDeg)||0)+(Number(profile.planning.objectRotation)||0));
  const targetFov=clamp(Math.max(setupW,setupH*aspect,objectW,objectH*aspect,.08)*1.45,.08,120);
  const time=new Date(windowRange.start.getTime()+(windowRange.end-windowRange.start)*clamp(Number(profile.planning.timeFraction)||0,0,1)),currentAltitude=altitude(o.raHours,o.decDeg,time,loc.latitude,loc.longitude),currentAzimuth=azimuth(o.raHours,o.decDeg,time,loc.latitude,loc.longitude);
  const query=new URLSearchParams({ra:String(o.raHours*15),dec:String(o.decDeg),fov:String(targetFov),survey:'P/DSS2/color',frameW:String(setupW),frameH:String(setupH),frameRot:String(frameRotation),showFrame:String(Boolean(profile.central.frameVisible&&setup)),objectW:String(objectW),objectH:String(objectH),objectRot:String(objectRotation),showObject:String(Boolean(profile.central.objectSizeVisible))}).toString();
  const scopes=profile.equipment.telescopes.map(item=>`<option value="${esc(item.id)}" ${item.id===activeScope()?.id?'selected':''}>${esc(item.name)}</option>`).join(''),cameras=profile.equipment.cameras.map(item=>`<option value="${esc(item.id)}" ${item.id===activeCamera()?.id?'selected':''}>${esc(item.name)}</option>`).join('');
  const selectableObjects=[...new Map([...currentComputedObjects.map(entry=>entry.object),o].map(item=>[item.id,item])).values()].sort((a,b)=>a.id.localeCompare(b.id,'de',{numeric:true})),objectOptions=selectableObjects.map(x=>`<option value="${esc(x.id)}" ${x.id===o.id?'selected':''}>${esc(x.id)} · ${esc(x.name)}</option>`).join('');
  const analysis=framingAnalysis(o,{rotation:frameRotation,optimize:false});
  return`<section class="object-detail-section framing-section" id="framingCard">
    <div class="framing-header-grid"><div><div class="eyebrow">Interaktives Himmelsbild</div><h3>Rahmung: ${esc(o.id)} · ${esc(o.name)}</h3><div class="muted">${esc(o.type)} · ${fmt(o.majorArcMin)}′ × ${fmt(o.minorArcMin)}′ · ${esc(analysis.status)} · Mindestrand ${fmt(analysis.minMargin,1)} %</div></div><label>Objekt<select id="framingObjectSelect">${objectOptions}</select></label><label>Teleskop<select id="framingTelescopeSelect">${scopes}</select></label><label>Kamera<select id="framingCameraSelect">${cameras}</select></label></div>
    <div class="framing-view"><iframe id="aladinFrame" title="Aladin Lite – ${esc(o.id)}" src="aladin-frame.html?${query}" loading="eager"></iframe><div class="framing-info"><div><strong>${fmtTime(time,loc.timezone)}</strong><br>Höhe ${fmt(currentAltitude)}° · ${cardinal(currentAzimuth)}</div><div>${setup?`Setup ${fmt(setup.width,2)}° × ${fmt(setup.height,2)}°<br>${fmt(setup.pixelScale,2)}″/px`:'Kein Setup gewählt'}</div></div></div>
    <div class="framing-controls"><label class="chip"><input id="frameVisible" type="checkbox" ${profile.central.frameVisible?'checked':''}>Setup-Rahmen anzeigen</label><label>Kamerarotation <span id="frameRotationValue">${fmt(frameRotation)}°</span><input id="frameRotation" type="range" min="0" max="179" value="${frameRotation}"></label><button type="button" id="optimalFrameRotation">Optimale Rotation</button><label class="chip"><input id="objectSizeVisible" type="checkbox" ${profile.central.objectSizeVisible?'checked':''}>Objektgröße anzeigen</label><label>Objektrotation <span id="objectRotationValue">${fmt(profile.planning.objectRotation)}°</span><input id="objectRotation" class="short-range" type="range" min="-90" max="90" value="${profile.planning.objectRotation}"></label><label class="framing-time-control">Zeit im Planungsfenster <span id="framingTimeValue">${fmtTime(time,loc.timezone)}</span><input id="framingTime" type="range" min="0" max="100" value="${profile.planning.timeFraction*100}"></label></div>
  </section>`;
}
function renderMeteoblue(loc){
  const urls=meteoblueLocationInfo(loc);
  const mapCollapsed=profile.central.cloudMap?.meteoblueMapCollapsed!==false;
  const locationText=urls.fixed?loc.name:'automatische Meteoblue-Standorterkennung';
  return`<section class="card meteoblue-card">
    <details ${profile.central.meteoblueCollapsed?'':'open'} id="meteoblueDetails">
      <summary><strong>Meteoblue Astronomy Seeing</strong> · unabhängige Kontrollvorhersage</summary>
      <div class="notice" style="margin-top:12px">Diese Kontrollvorhersage wird nicht in den automatischen Modellkonsens eingerechnet. Standort: <strong>${esc(locationText)}</strong>.</div>
      <div class="meteoblue-actions" style="margin-top:10px">
        <button data-meteoblue-fullscreen="meteoblueSeeingWrap">⛶ Großansicht</button>
        <a class="button primary" href="${urls.seeingPage}" target="_blank" rel="noopener noreferrer">Bei Meteoblue öffnen</a>
      </div>
      <div class="meteoblue-embed" id="meteoblueSeeingWrap">
        <iframe class="meteoblue-frame seeing-frame" title="Meteoblue Astronomy Seeing für ${esc(loc.name)}" src="${urls.seeingWidget}" loading="lazy"
          allow="geolocation" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <div class="meteoblue-credit"><a href="${urls.seeingPage}" target="_blank" rel="noopener noreferrer">meteoblue</a></div>
    </details>
  </section>
  <section class="card meteoblue-card">
    <details ${mapCollapsed?'':'open'} id="meteoblueMapDetails">
      <summary><strong>Meteoblue Wetterkarten</strong> · zusätzliche Live-, Radar-, Satelliten- und Modellansicht</summary>
      <div class="notice" style="margin-top:12px">Zusätzliche unabhängige Karte mit Windanimation, Böen, Satellit, Wolken und Niederschlag, Temperatur, Sonnenscheindauer und Extremprognose.</div>
      <div class="meteoblue-actions" style="margin-top:10px">
        <button data-meteoblue-fullscreen="meteoblueMapWrap">⛶ Großansicht</button>
        <a class="button primary" href="${urls.mapPage}" target="_blank" rel="noopener noreferrer">Wetterkarten bei Meteoblue öffnen</a>
      </div>
      <div class="meteoblue-embed meteoblue-map-embed" id="meteoblueMapWrap">
        <iframe class="meteoblue-frame map-frame" title="Meteoblue Wetterkarten für ${esc(loc.name)}" src="${urls.mapWidget}" loading="lazy"
          allow="geolocation" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <div class="meteoblue-credit"><a href="${urls.mapPage}" target="_blank" rel="noopener noreferrer">meteoblue</a></div>
    </details>
  </section>`
}

function renderSaveBar(section,label='Änderungen speichern'){
  const dirty=dirtySections.has(section),success=saveFeedbackSections.has(section);
  const state=dirty?'Ungespeicherte Änderungen':success?'Erfolgreich gespeichert':'Gespeichert';
  return`<div class="save-bar ${dirty?'is-dirty':''} ${success?'is-success':''}"><span class="save-state">${state}</span><button data-save-section="${section}" data-default-label="${esc(label)}" class="primary ${success?'save-success':''}" ${success?'disabled':''}>${success?'Gespeichert ✓':label}</button></div>`;
}
function settingsTabHasDirty(tab){
  const groups={equipment:['equipment'],central:['centralWind','weatherModels','cloudMap','weights','display'],locations:['locations'],info:['backup']};
  return(groups[tab]||[]).some(key=>dirtySections.has(key));
}
function renderSettings(){return`<div data-page="settings"><section class="card"><div class="section-title-row"><div><h2>Einstellungen</h2><div class="muted">Lokales Profil „${esc(profile.name)}“ · Einstellungen in IndexedDB, Programmdateien im PWA-Cache</div></div>${renderProfileBar()}</div><div class="settings-tabs" style="margin-top:16px">${[['equipment','Ausrüstung'],['central','Zentrale Einstellungen'],['locations','Standorte & Horizont'],['info','Info, Hilfe & Sicherung']].map(([k,n])=>`<button data-settings-tab="${k}" class="${currentSettingsTab===k?'active':''} ${settingsTabHasDirty(k)?'dirty-dot':''}">${n}</button>`).join('')}</div></section><section class="settings-section ${currentSettingsTab==='equipment'?'active':''}">${renderEquipment()}</section><section class="settings-section ${currentSettingsTab==='central'?'active':''}">${renderCentral()}</section><section class="settings-section ${currentSettingsTab==='locations'?'active':''}">${renderLocations()}</section><section class="settings-section ${currentSettingsTab==='info'?'active':''}">${renderInfo()}</section></div>`}
function renderProfileBar(){return`<div class="profile-bar"><select id="settingsProfileSelect">${profiles.map(p=>`<option value="${esc(p.id)}" ${p.id===profile.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select><button id="newProfile">Neu</button><button id="duplicateProfile">Duplizieren</button><button id="renameProfile">Umbenennen</button><button id="deleteProfile" class="danger" ${profiles.length===1?'disabled':''}>Löschen</button></div>`}
function renderEquipment(){return`<div class="card">
  <div class="section-title-row"><div><h2>Teleskope</h2><div class="small muted">Brennweite und Öffnung bestimmen zusammen mit der Kamera das Bildfeld.</div></div><button id="addTelescope">Teleskop hinzufügen</button></div>
  <div class="equipment-list">${draft.equipment.telescopes.map(s=>`<div class="equipment-row scope-row" data-scope-row="${s.id}"><label>Name<input data-scope="name" value="${esc(s.name)}"></label><label>Brennweite (mm)<input data-scope="focalLength" type="number" min="1" value="${s.focalLength}"></label><label>Öffnung (mm)<input data-scope="aperture" type="number" min="1" value="${s.aperture||''}"></label><label class="chip"><input data-selected-scope type="radio" name="selectedScope" value="${s.id}" ${draft.equipment.selectedTelescopeId===s.id?'checked':''}>Aktiv</label><button data-delete-scope="${s.id}" class="danger">Entfernen</button></div>`).join('')}</div>
  <div class="divider"></div>
  <div class="section-title-row"><div><h2>Kameras</h2><div class="small muted">Sensorgröße und Pixelgröße werden für Bildfeld und Abbildungsmaßstab verwendet.</div></div><button id="addCamera">Kamera hinzufügen</button></div>
  <div class="equipment-list">${draft.equipment.cameras.map(c=>`<div class="equipment-row camera-row" data-camera-row="${c.id}"><label>Name<input data-camera="name" value="${esc(c.name)}"></label><label>Sensorbreite (mm)<input data-camera="sensorWidth" type="number" min="0.1" step="0.01" value="${c.sensorWidth}"></label><label>Sensorhöhe (mm)<input data-camera="sensorHeight" type="number" min="0.1" step="0.01" value="${c.sensorHeight}"></label><label>Pixelgröße (µm)<input data-camera="pixelSize" type="number" min="0.1" step="0.01" value="${c.pixelSize}"></label><label class="chip"><input data-selected-camera type="radio" name="selectedCamera" value="${c.id}" ${draft.equipment.selectedCameraId===c.id?'checked':''}>Aktiv</label><button data-delete-camera="${c.id}" class="danger">Entfernen</button></div>`).join('')}</div>
  <div class="divider"></div>
  <div class="section-title-row"><div><h2>Montierungen</h2><div class="small muted">Die Montierung wird derzeit dokumentiert; eine spätere Qualitätsbewertung kann Typ und Tragfähigkeit berücksichtigen.</div></div><button id="addMount">Montierung hinzufügen</button></div>
  <div class="equipment-list">${draft.equipment.mounts.map(m=>`<div class="equipment-row mount-row" data-mount-row="${m.id}"><label>Name<input data-mount="name" value="${esc(m.name)}"></label><label>Montierungsart<select data-mount="type">${['Parallaktisch','Alt-Azimutal','Startracker','Säule / stationär','Sonstige'].map(type=>`<option ${m.type===type?'selected':''}>${type}</option>`).join('')}</select></label><label>Max. Zuladung (kg, optional)<input data-mount="maxPayloadKg" type="number" min="0" step="0.1" value="${m.maxPayloadKg??''}"></label><label class="chip"><input data-selected-mount type="radio" name="selectedMount" value="${m.id}" ${draft.equipment.selectedMountId===m.id?'checked':''}>Aktiv</label><button data-delete-mount="${m.id}" class="danger">Entfernen</button></div>`).join('')}</div>
  ${renderSaveBar('equipment','Ausrüstung speichern')}
</div>`}
function renderCentral(){
  const c=draft.central;
  const total=Object.values(c.weights).reduce((a,b)=>a+Number(b||0),0);
  const weatherTotal=Object.values(c.weatherModels?.weights||{}).reduce((a,b)=>a+Number(b||0),0);
  return`<div class="card">
    <div class="section-title-row"><div><h2>Wind und Aufnahmequalität</h2><div class="small muted">Grenzwerte bewerten die erwartete Aufnahmequalität, nicht die strukturelle Sicherheit der Ausrüstung.</div></div></div>
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
    ${renderSaveBar('centralWind','Windwerte speichern')}
  </div>
  <div class="card">
    <div class="section-title-row"><div><h2>Wettermodelle</h2><div class="small muted">Gewichtung für den Modellkonsens je Prognosestunde</div></div><span class="weight-total ${weatherTotal===100?'ok':'error'}">Summe: ${weatherTotal} %</span></div>
    <div class="notice">Der Modellkonsens mittelt DWD ICON, ECMWF IFS und NOAA GFS nach diesen Anteilen. Default: 40 % / 40 % / 20 %.</div>
    <div class="grid three" style="margin-top:12px">${Object.entries(WEATHER_MODEL_CONFIG).map(([key,value])=>`<label>${esc(value.name)} (%)<input data-weather-weight="${key}" type="number" min="0" max="100" step="1" value="${Number(c.weatherModels?.weights?.[key]??value.defaultWeight)}"></label>`).join('')}</div>
    <div class="grid two" style="margin-top:12px"><label>Standarddarstellung in der Planung<select id="defaultWeatherView">${WEATHER_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.weatherModels?.defaultView===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label><div class="notice">In der Planung kann die Ansicht temporär auf ein Einzelmodell umgestellt werden. Der Standard wird ausschließlich hier gespeichert.</div></div>
    ${renderSaveBar('weatherModels','Wettermodelle speichern')}
  </div>
  <div class="card">
    <div class="section-title-row"><div><h2>Wolkenkarte und Datenmenge</h2><div class="small muted">Auflösung, Kartenausschnitt und Standarddarstellung der animierten 24-Stunden-Prognose</div></div></div>
    <div class="grid three">
      <label>Kartendetails<select id="cloudMapGridSize">${CLOUD_MAP_GRID_OPTIONS.map(([value,label])=>`<option value="${value}" ${Number(c.cloudMap?.gridSize)===value?'selected':''}>${esc(label.replace('Kartenpunkte','Prognosepunkte'))}</option>`).join('')}</select></label>
      <label>Kartenradius<select id="cloudMapRadius">${CLOUD_MAP_RADIUS_OPTIONS.map(([value,label])=>`<option value="${value}" ${Number(c.cloudMap?.radiusKm)===value?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <label>Animationsgeschwindigkeit<select id="cloudMapAnimationMs">${[[1400,'langsam'],[900,'normal'],[550,'schnell']].map(([value,label])=>`<option value="${value}" ${Number(c.cloudMap?.animationMs)===value?'selected':''}>${label} (${value} ms)</option>`).join('')}</select></label>
      <label>Standard-Zeitschritt der Wolkenanimation<select id="cloudMapTimeStepDefault">${[15,30,60].map(value=>`<option value="${value}" ${Number(c.cloudMap?.timeStepMinutes||30)===value?'selected':''}>${value} Minuten${value===30?' (Standard)':''}</option>`).join('')}</select></label>
      <label>Standard-Modellansicht<select id="defaultCloudMapView">${CLOUD_MAP_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.cloudMap?.defaultView===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <label>Standard-Wolkenschicht<select id="defaultCloudMapLayer">${CLOUD_MAP_LAYER_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.cloudMap?.defaultLayer===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <label>Standard-Kartenmodus<select id="defaultCloudMapMode">${CLOUD_MAP_MODE_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.cloudMap?.defaultMode===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
    </div>
    <div class="grid two" style="margin-top:12px"><label class="chip"><input id="cloudMapCollapsedDefault" type="checkbox" ${c.cloudMap?.collapsed?'checked':''}>Wolkenkarte initial eingeklappt</label><label class="chip"><input id="meteoblueMapCollapsedDefault" type="checkbox" ${c.cloudMap?.meteoblueMapCollapsed?'checked':''}>Meteoblue-Wetterkarte initial eingeklappt</label></div>
    <div class="notice" style="margin-top:12px">25, 49 oder 81 Prognosepunkte bestimmen die API-Datenmenge. Die sichtbare Karte wird unabhängig davon in hoher Auflösung weich interpoliert; es werden keine Zellumrandungen gezeichnet. Standard: 49 Punkte in einem Radius von 120 km.</div>
    ${renderSaveBar('cloudMap','Wolkenkarte speichern')}
  </div>
  <div class="card">
    <div class="section-title-row"><h2>Deep-Sky-Gewichtung</h2><span class="weight-total ${total===100?'ok':'error'}">Summe: ${total} %</span></div>
    <div class="notice">Nur ganzzahlige Eingabefelder. Speichern ist nur bei exakt 100 % möglich.</div>
    <div class="weight-grid" style="margin-top:12px">${Object.entries({clouds:'Wolken',transparency:'Effektive Transparenz',seeing:'Seeing',wind:'Wind/Böen',dew:'Tauabstand',moon:'Mond',altitude:'Objekthöhe',duration:'Sichtbarkeitsdauer'}).map(([key,name])=>`<label>${name} (%)<input data-weight="${key}" type="number" min="0" max="100" step="1" value="${c.weights[key]}"></label>`).join('')}</div>
    ${renderSaveBar('weights','Gewichtung speichern')}
  </div>
  <div class="card">
    <div class="section-title-row"><div><h2>Anzeige und Planung</h2><div class="small muted">Dauerhafte Standards für neue beziehungsweise zurückgesetzte Planungen</div></div></div>
    <div class="grid two"><label>Standard-Planungszeitraum<select id="defaultPlanningWindow">${[['sunset','Sonnenuntergang–Sonnenaufgang'],['civil','Bürgerliche Nacht'],['nautical','Nautischer Planungszeitraum'],['astronomicalTwilight','Nautisch + astronomisch'],['astronomicalNight','Astronomische Nacht']].map(([key,name])=>`<option value="${key}" ${c.defaultPlanningWindow===key?'selected':''}>${name}</option>`).join('')}</select></label><label>Darstellungsprofil – Aktiv<select id="activeDisplayProfile">${Object.entries(c.listDisplay.profiles).map(([key,value])=>`<option value="${key}" ${c.listDisplay.activeProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label></div>
    <div class="grid two" style="margin-top:12px"><label>Gewünschter Mindestfreiraum zum Bildrand (%)<input id="framingMinMargin" type="number" min="0" max="45" step="1" value="${Number(c.framing?.minMarginPercent??10)}"></label><label class="chip"><input id="framingAutoRotate" type="checkbox" ${c.framing?.autoRotate!==false?'checked':''}>Kamera bei verlässlichem Positionswinkel automatisch optimal drehen</label></div>
    <div class="grid three" style="margin-top:12px">${Object.entries(c.listDisplay.profiles).map(([key,value])=>`<div class="metric"><strong>${esc(value.name)}</strong><label>Objekte/Seite<select data-display-page-size="${key}">${[10,20,50,100].map(number=>`<option ${value.pageSize===number?'selected':''}>${number}</option>`).join('')}</select></label><div class="small muted" style="margin:8px 0">Sichtbare Spalten</div>${DISPLAY_COLUMNS.map(([id,name])=>`<label class="chip"><input type="checkbox" data-display-column-profile="${key}" data-column="${id}" ${value.columns.includes(id)?'checked':''}>${name}</label>`).join('')}</div>`).join('')}</div>
    <div class="grid two" style="margin-top:12px"><label class="chip"><input id="defaultFrameVisible" type="checkbox" ${c.frameVisible?'checked':''}>Setup-Rahmen standardmäßig anzeigen</label><label class="chip"><input id="defaultObjectVisible" type="checkbox" ${c.objectSizeVisible?'checked':''}>Objektgröße standardmäßig anzeigen</label><label class="chip"><input id="defaultMeteoblueCollapsed" type="checkbox" ${c.meteoblueCollapsed?'checked':''}>Meteoblue standardmäßig eingeklappt</label><label class="chip"><input id="defaultAltitudeCollapsed" type="checkbox" ${c.detailPanels?.altitudeCollapsed?'checked':''}>Höhenkurve initial eingeklappt</label><label class="chip"><input id="defaultHorizonCollapsed" type="checkbox" ${c.detailPanels?.horizonCollapsed?'checked':''}>Horizontansicht initial eingeklappt</label></div>
    <div class="display-actions"><button id="resetDisplayProfiles">Auf Standard zurücksetzen</button></div>
    ${renderSaveBar('display','Anzeigeeinstellungen speichern')}
  </div>`;
}
function renderLocations(){
  const loc=draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0],profiles=horizonProfilesFor(loc),horizonEntry=horizonProfileFor(loc,loc.selectedHorizonProfileId),horizonPoints=ensureHorizonProfile(loc,horizonEntry?.id).map((altitude,index)=>[index*5,Number(altitude)||0]),obstacles=(horizonEntry?.obstacles||[]).map(item=>({name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0}));
  const profileOptions=profiles.map(item=>`<option value="${esc(item.id)}" ${item.id===horizonEntry?.id?'selected':''}>${esc(item.name)}</option>`).join(''),defaultOptions=profiles.map(item=>`<option value="${esc(item.id)}" ${item.id===loc.defaultHorizonProfileId?'selected':''}>${esc(item.name)}</option>`).join('');
  return`<div class="card"><div class="section-title-row"><div><h2>Gespeicherte Aufnahmeorte</h2><div class="small muted">Der Standardstandort wird hier festgelegt. In der Planung kann vorübergehend ein anderer Ort gewählt werden.</div></div><button id="addLocation">Standort hinzufügen</button></div>
    <div class="grid two"><label>Standort bearbeiten<select id="locationSelect">${draft.locations.map(item=>`<option value="${item.id}" ${item.id===loc.id?'selected':''}>${esc(item.name)}</option>`).join('')}</select></label><label>Standardstandort<select id="defaultLocationSelect">${draft.locations.map(item=>`<option value="${item.id}" ${item.id===draft.central.defaultLocationId?'selected':''}>${esc(item.name)}</option>`).join('')}</select></label><label>GPS-Verhalten<select id="gpsBehavior"><option value="last" ${draft.central.gpsBehavior==='last'?'selected':''}>Letzten/Standardstandort verwenden</option><option value="ask" ${draft.central.gpsBehavior==='ask'?'selected':''}>Bei Bedarf nach GPS fragen</option></select></label><span></span></div>
    <div class="grid three" style="margin-top:12px"><label>Name<input id="locName" value="${esc(loc.name)}"></label><label>Zeitzone<input id="locTimezone" value="${esc(loc.timezone)}"></label><label>Breitengrad (°)<input id="locLat" type="number" step="0.0001" value="${loc.latitude}"></label><label>Längengrad (°)<input id="locLon" type="number" step="0.0001" value="${loc.longitude}"></label><label>Höhe über Meer (m)<input id="locElevation" type="number" value="${loc.elevation||0}"></label><div class="inline" style="align-self:end"><button id="useGps">GPS verwenden</button><button id="searchLocation">Ort suchen</button><button id="deleteLocation" class="danger" ${draft.locations.length===1?'disabled':''}>Standort löschen</button></div></div>
  </div>
  <div class="card"><div class="section-title-row"><div><div class="eyebrow">Interaktive Horizontprofile</div><h2>${esc(loc.name)}</h2><div class="small muted">Mehrere Profile pro Standort sind möglich, zum Beispiel Garten, Terrasse oder mobile Aufstellung.</div></div><div class="horizon-editor-actions"><button id="undoHorizon" ${!horizonUndoStack.length?'disabled':''}>Letzte Änderung rückgängig</button><button id="resetHorizon">Horizont auf 0° setzen</button></div></div>
    <div class="horizon-profile-toolbar"><label>Horizont bearbeiten<select id="horizonProfileSelect">${profileOptions}</select></label><label>Standardprofil dieses Standorts<select id="defaultHorizonProfileSelect">${defaultOptions}</select></label><button id="addHorizonProfile">Neu</button><button id="duplicateHorizonProfile">Duplizieren</button><button id="renameHorizonProfile">Umbenennen</button><button id="deleteHorizonProfile" class="danger" ${profiles.length===1?'disabled':''}>Löschen</button></div>
    <div class="horizon-editor-wrap"><canvas class="settings-horizon-chart editable-horizon" width="1400" height="440" data-editable="true" data-horizon="${encodeURIComponent(JSON.stringify(horizonPoints))}" data-obstacles="${encodeURIComponent(JSON.stringify(obstacles))}"></canvas><div class="small muted horizon-editor-help">0° N · 45° NO · 90° O · 135° SO · 180° S · 225° SW · 270° W · 315° NW · 360° N. Änderungen werden erst mit Speichern dauerhaft übernommen.</div></div>
    <div class="divider"></div><div class="section-title-row"><h3>Hindernisse im Profil „${esc(horizonEntry?.name||'–')}“</h3><button id="addObstacle">Hindernis hinzufügen</button></div>
    <div class="obstacle-list">${(horizonEntry?.obstacles||[]).map(item=>`<div class="obstacle-row" data-obstacle="${item.id}"><label>Bezeichnung<input data-obstacle-field="name" value="${esc(item.name)}"></label><label>Azimut (°)<input data-obstacle-field="azimuth" type="number" min="0" max="360" value="${item.azimuth}"></label><label>Höhe (°)<input data-obstacle-field="altitude" type="number" min="0" max="90" value="${item.altitude}"></label><button data-delete-obstacle="${item.id}" class="danger">Entfernen</button></div>`).join('')||'<div class="muted">Keine zusätzlichen Hindernisse erfasst.</div>'}</div>
    ${renderSaveBar('locations','Standort und Horizonte speichern')}
  </div>`;
}
function renderInfo(){
  const persistentText=storageInfo.persistent===true?'Aktiv':storageInfo.persistent===false?'Nicht aktiv':'Nicht ermittelbar';
  const permissionText={granted:'Zugriff vorhanden',prompt:'Freigabe erforderlich',denied:'Zugriff verweigert',none:'Kein Ordner gewählt'}[storageInfo.permission]||storageInfo.permission;
  const fileSupport=storageInfo.fileSystemSupported?'Automatische Ordnersicherung unterstützt':'Automatische Ordnersicherung in diesem Browser nicht unterstützt';
  const lastBackup=backupAgeText();
  const reminderDue=!backupConfig.lastSuccessAt||Date.now()-new Date(backupConfig.lastSuccessAt).getTime()>Number(backupConfig.reminderDays||7)*86400000;
  return`<div class="card storage-warning-card"><div class="eyebrow">Bitte vor der Nutzung lesen</div><h2>Wichtiger Hinweis zur lokalen Datenspeicherung</h2><p><strong>Einstellungen, Profile, Ausrüstung, Standorte und Horizonte werden lokal in der Browserdatenbank IndexedDB gespeichert. Normale Cookies sind nicht der primäre Speicherort.</strong></p><p>Die PWA-Programmdateien liegen getrennt im Cache Storage. Das Löschen nur von „Bildern und Dateien im Cache“ entfernt IndexedDB normalerweise nicht. Das Löschen der Websitedaten kann jedoch Profile, Einstellungen und gespeicherte Dateizugriffe entfernen. Persistenter Speicher schützt nur vor automatischer Browserbereinigung – nicht vor einer bewussten Löschung. Erstelle deshalb regelmäßig externe Sicherungen.</p></div>
  <div class="card"><h2>Astro Night Planner 1.0</h2><p>Installierbare PWA für Nachtplanung, astronomisches Wetter, Mond und Dämmerung, Deep-Sky-Auswahl, persönliche Ausrüstung, Standorte, Horizont und Rahmung.</p><div class="storage-status"><div class="metric"><div class="label">Umgebung</div><div class="value">${ENV==='prod'?'Produktion':'Test'}</div></div><div class="metric"><div class="label">Datenbank</div><div class="value small">${DB_NAME}</div></div><div class="metric"><div class="label">Version</div><div class="value">${APP_VERSION}</div></div></div></div>
  <div class="card"><div class="section-title-row"><div><h2>Datenstatus</h2><div class="small muted">Technischer Status der lokalen Speicherung</div></div><button id="refreshStorageStatus">Status aktualisieren</button></div><div class="grid four"><div class="metric"><div class="label">Speicherschutz</div><div class="value ${storageInfo.persistent?'good':'warn'}">${persistentText}</div></div><div class="metric"><div class="label">Lokaler Speicherverbrauch</div><div class="value">${formatBytes(storageInfo.usage)}</div><div class="small muted">von ${formatBytes(storageInfo.quota)}</div></div><div class="metric"><div class="label">Externe Sicherung</div><div class="value small ${storageInfo.permission==='granted'?'good':'warn'}">${permissionText}</div><div class="small muted">${esc(backupConfig.targetName||'Kein Ziel')}</div></div><div class="metric"><div class="label">Letzte Sicherung</div><div class="value small ${reminderDue?'warn':'good'}">${esc(lastBackup)}</div></div></div><div class="data-actions" style="margin-top:12px"><button id="requestPersistence">Lokale Daten vor automatischer Browserbereinigung schützen</button></div><div id="storageMessage" class="notice" style="margin-top:12px">Der Speicherschutz verhindert keine manuelle Löschung von Websitedaten.</div></div>
  <div class="card"><div class="section-title-row"><div><h2>Automatische externe Sicherung</h2><div class="small muted">Die Sicherungsdatei liegt außerhalb des Browsercaches. Nach einer vollständigen Löschung der Websitedaten muss Ordner oder Datei erneut ausgewählt werden.</div></div><span class="backup-support ${storageInfo.fileSystemSupported?'good':'warn'}">${fileSupport}</span></div>
    <div class="grid two"><label class="chip"><input id="backupEnabled" type="checkbox" ${backupDraft.enabled?'checked':''} ${!storageInfo.fileSystemSupported?'disabled':''}>Automatische Sicherung aktivieren</label><label>Aufzubewahrende datierte Sicherungen<input id="backupKeep" type="number" min="1" max="50" value="${backupDraft.keep}"></label><label class="chip"><input id="backupAfterSave" type="checkbox" ${backupDraft.afterSave?'checked':''} ${!storageInfo.fileSystemSupported?'disabled':''}>Nach jedem erfolgreichen Speichern der Einstellungen sichern</label><label class="chip"><input id="backupDaily" type="checkbox" ${backupDraft.daily?'checked':''} ${!storageInfo.fileSystemSupported?'disabled':''}>Zusätzlich höchstens einmal täglich datierte Sicherung</label><label>Sicherungserinnerung nach Tagen<input id="backupReminderDays" type="number" min="1" max="90" value="${backupDraft.reminderDays}"></label><div class="metric"><div class="label">Sicherungsziel</div><div class="value small">${esc(backupConfig.targetName||'Noch nicht gewählt')}</div><div class="small muted">Berechtigung: ${permissionText}</div></div></div>
    <div class="notice backup-file-explanation" style="margin-top:12px"><strong>Zwei Dateitypen:</strong> <code>astro-night-planner-aktuell.json</code> wird fortlaufend überschrieben und ist für die normale Wiederherstellung gedacht. Datierte Dateien sind historische Rücksprungpunkte. Vor einer Wiederherstellung werden Datum und Inhalt angezeigt.</div><div class="data-actions backup-actions" style="margin-top:14px"><button id="chooseBackupDirectory" ${!storageInfo.fileSystemSupported?'disabled':''}>Sicherungsordner auswählen</button><button id="backupNow">Sicherung jetzt erstellen</button><button id="restoreBackup">Aus Sicherung wiederherstellen</button><button id="exportAll">Komplette Sicherung herunterladen</button><button id="exportProfile">Aktuelles Profil herunterladen</button></div>
    ${backupConfig.lastError?`<div class="notice warn" style="margin-top:12px">Letzter Sicherungsfehler: ${esc(backupConfig.lastError)}</div>`:''}
    ${!storageInfo.fileSystemSupported?'<div class="notice" style="margin-top:12px">Fallback: Nutze „Komplette Sicherung herunterladen“. Die App erinnert nach dem eingestellten Zeitraum an einen neuen Export.</div>':''}
    ${renderSaveBar('backup','Sicherungseinstellungen speichern')}
  </div>
  <div class="card help-article"><div class="section-title-row"><div><h2>Ausführliche browserbasierte Hilfe</h2><div class="small muted">Bedienung, Daten und Funktionen der Anwendung</div></div><div class="data-actions"><a class="button" href="./docs/ASTRO_NIGHT_PLANNER_HANDBUCH.html" target="_blank" rel="noopener">Handbuch im Browser</a><a class="button primary" href="./docs/ASTRO_NIGHT_PLANNER_HANDBUCH.pdf" target="_blank" rel="noopener">Handbuch als PDF</a></div></div>
    <div class="help-toc">${[['help-storage','Datenspeicherung'],['help-first','Erste Schritte'],['help-plan','Planungsnacht'],['help-profiles','Planungsprofile'],['help-weather','Wetter'],['help-cloudmap','Wolkenkarte'],['help-meteoblue','Meteoblue'],['help-filters','Objektfilter'],['help-objects','Objektliste'],['help-details','Objektdetails'],['help-framing','Rahmung'],['help-horizon','Horizont'],['help-equipment','Ausrüstung'],['help-settings','Einstellungen'],['help-backup','Sicherung'],['help-pwa','PWA'],['help-troubleshooting','Fehlerbehebung'],['help-values','Bewertungswerte']].map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}</div>
    <section id="help-storage"><h3>Datenspeicherung, Cookies und Browsercache</h3><p>Alle persönlichen Daten werden im gerade verwendeten Browser und Browserprofil gespeichert. IndexedDB enthält die fachlichen Daten, Cache Storage die für den Offlinebetrieb benötigten App-Dateien. Cookies sind nicht der Hauptspeicher. Ein normaler Cache-Löschvorgang betrifft die Einstellungen meist nicht; das Löschen aller Websitedaten der Installationsadresse kann sie jedoch entfernen. Auch ein Wechsel der Domain oder des Browserprofils erzeugt einen getrennten Speicherbereich. Übertrage Daten deshalb mit einer externen Sicherung.</p></section>
    <section id="help-first"><h3>Erste Schritte</h3><p>Prüfe zuerst unter Ausrüstung Teleskop, Kamera und Montierung. Lege anschließend unter Standorte & Horizont deinen Aufnahmeort, mindestens ein Horizontprofil und den jeweiligen Standard fest. Wähle in der Planung Standort, Datum, Planungszeitraum, Teleskop, Kamera, Horizontprofil und Wetterdarstellung. Danach kannst du Objektfilter setzen und ein Objekt durch Klick auf die gesamte Tabellenzeile öffnen.</p></section>
    <section id="help-plan"><h3>Planungsnacht</h3><p>Die Standortauswahl links neben den Datumsfeldern gilt nur für die aktuelle Planung. Koordinaten und Höhe stehen direkt darunter. Sonnen-, Dämmerungs- und Mondzeiten werden für diesen Standort berechnet. Der Planungszeitraum begrenzt Bewertung, Sichtbarkeitsdauer, Wetterzusammenfassung und Höhenprofile.</p></section>
    <section id="help-profiles"><h3>Profile für diese Planung</h3><p>Planungszeitraum, Aufnahmequalitätsprofil, Darstellungsprofil, Wetteransicht, Teleskop, Kamera und Horizontprofil können für die aktuelle Nacht temporär gewählt werden. Teleskop und Kamera wirken sofort auf Bildfeld, Framingbewertung und Aladin-Rahmung; das Horizontprofil auf die Horizontansicht. Keine dieser Auswahlen überschreibt einen gespeicherten Standard. Dauerhafte Standards werden ausschließlich in den Einstellungen festgelegt.</p></section>
    <section id="help-weather"><h3>Wetter und Modellkonsens</h3><p>Der Modellkonsens kombiniert DWD ICON, ECMWF IFS und NOAA GFS mit den gespeicherten Prozentgewichten. Einzelmodelle sind zur Kontrolle auswählbar. Die farbigen Felder bewerten die erwartete Aufnahmequalität. Die effektive Transparenz berücksichtigt die Bewölkung; der ergänzende atmosphärische Wert beschreibt die Klarheit ohne Wolkeneinfluss.</p></section>
    <section id="help-cloudmap"><h3>Animierte 24-Stunden-Wolkenkarte</h3><p>Die Karte zeigt Gesamtbewölkung oder tiefe, mittlere und hohe Wolken. 25, 49 oder 81 Prognosepunkte bestimmen die Datenmenge; die sichtbare Fläche wird weich interpoliert. Die dynamische Legende passt sich der Schicht an. Der Modus Modellabweichung zeigt, wie stark die drei Modelle voneinander abweichen. Kartenzeit und Kennwerte stehen unmittelbar über dem Zeitregler.</p><p>Das Zeitraster ist in der Planung mit 15, 30 oder 60 Minuten wählbar; Standard sind 30 Minuten. Die Wettermodelle liefern im Wesentlichen stündliche Werte. Zwischenbilder dienen einer flüssigeren Darstellung und werden zeitlich interpoliert, sie erhöhen nicht die Prognosegenauigkeit. Die Wolkenbewegung wird aus mehreren Stunden stabilisiert. Bei geringer Übereinstimmung erscheint „Bewegungsrichtung unsicher“ statt eines wechselnden Pfeils.</p></section>
    <section id="help-meteoblue"><h3>Meteoblue-Kontrollquellen</h3><p>Astronomy Seeing und Wetterkarten sind unabhängige Zusatzquellen und fließen nicht in den automatischen Konsens ein. Nutze sie zum Vergleich mit der eigenen Modellberechnung. Über Großansicht können die eingebetteten Karten bildschirmfüllend geöffnet werden.</p></section>
    <section id="help-filters"><h3>Objektfilter</h3><p>Filtere nach Katalog, Objekttyp, Magnitude, Mindesthöhe, Sichtbarkeitsdauer, Mondabstand und Objektgröße. Alle Beschriftungen enthalten die verwendeten Einheiten. Änderungen setzen die Ergebnisliste auf Seite 1 zurück.</p></section>
    <section id="help-objects"><h3>Objektliste und Mini-Höhenprofile</h3><p>Die Liste ist paginiert. Darstellungsprofile bestimmen Spalten und Objekte pro Seite. Das Mini-Höhenprofil verwendet denselben Planungszeitraum wie die große Kurve und zeigt Dämmerungsbereiche, Mindesthöhe und Maximum.</p></section>
    <section id="help-details"><h3>Objektdetails, Höhenkurve und Horizontansicht</h3><p>Ein Klick auf eine freie Stelle der Objektzeile öffnet die Details direkt darunter. Ein erneuter Klick oder „Details schließen“ schließt sie. Höhenkurve und Horizontansicht sind getrennt aufklappbar und besitzen synchronisierte Zeitregler. Himmelsrichtungen werden zusammen mit Gradwerten angezeigt. In der Horizontansicht kann für die aktuelle Detailprüfung vorübergehend ein anderes Horizontprofil des gewählten Standorts ausgewählt werden.</p></section>
    <section id="help-framing"><h3>Rahmung mit Aladin Lite</h3><p>Die Ansicht wird auf das gewählte Objekt zentriert und passend gezoomt. Kamerarahmen und Objektellipse werden in Himmelskoordinaten gezeichnet und folgen Zoom, Verschiebung und Größenänderung. Objekt, Teleskop und Kamera sind direkt oberhalb der Grafik auswählbar. Änderungen gelten temporär für diese Planung.</p><p>Die Framingbewertung berücksichtigt Objektgröße, Positionswinkel, Kamerafeld, relative Drehung und den in den Einstellungen vorgegebenen Mindestfreiraum zum Bildrand. Mögliche Hinweise sind „Objekt zu groß für das Bildfeld“, „Objekt passt nur äußerst knapp“, „Objekt nahe am Bildrand“, „Gut gerahmt“ und „Viel Umfeld“. Bei verlässlichem Positionswinkel kann die Kamera automatisch auf den größtmöglichen Mindestrand gedreht werden; „Optimale Rotation“ stellt diese Ausrichtung erneut her.</p></section>
    <section id="help-horizon"><h3>Standorte und interaktive Horizontprofile</h3><p>Für jeden Standort können mehrere Horizontprofile angelegt werden, etwa „Garten“, „Terrasse“ oder „mobile Aufstellung“. Ein Profil wird als Standard des Standorts festgelegt; in der Planung und in der Detailansicht kann vorübergehend ein anderes gewählt werden.</p><p>Bearbeite die Horizontlinie direkt in der Grafik mit Maus oder Finger. Die Linie wird in 5°-Schritten gespeichert. Rückgängig und Zurücksetzen helfen bei der Bearbeitung. Hindernisse wie Bäume oder Gebäude gehören jeweils zum ausgewählten Horizontprofil und können zusätzlich mit Azimut und Höhe eingetragen werden.</p></section>
    <section id="help-equipment"><h3>Ausrüstung</h3><p>Teleskope, Kameras und Montierungen werden als Listen geführt. Je Kategorie ist ein Eintrag als dauerhafter Standard aktiv. Teleskop und Kamera bestimmen Bildfeld und Pixelmaßstab. Für eine einzelne Planung können beide unter „Profile für diese Planung“ oder direkt im interaktiven Himmelsbild temporär gewechselt werden. Die Montierung dient zunächst der Dokumentation und kann später in Wind- oder Tragfähigkeitsbewertungen einbezogen werden.</p></section>
    <section id="help-settings"><h3>Speichern von Einstellungen</h3><p>Jede Rubrik besitzt eine einheitliche Speicherleiste. Ungespeicherte Änderungen werden deutlich angezeigt. Nach erfolgreichem Speichern wird der Button drei Sekunden gelb und zeigt „Gespeichert ✓“. Erst dann sind die Änderungen dauerhaft in IndexedDB übernommen. Unter „Wolkenkarte und Datenmenge“ werden unter anderem das Standard-Zeitraster festgelegt; unter „Anzeige und Planung“ der gewünschte Mindestfreiraum zum Bildrand und die automatische Anfangsrotation.</p></section>
    <section id="help-backup"><h3>Export, automatische Sicherung und Wiederherstellung</h3><p><code>astro-night-planner-aktuell.json</code> wird bei jeder automatischen Sicherung überschrieben. Sie enthält den neuesten Stand und ist die erste Wahl für eine normale Wiederherstellung. Dateien wie <code>astro-night-planner-2026-06-16T21-24-30.json</code> sind unveränderliche historische Rücksprungpunkte; verwende sie nur, wenn bewusst ein älterer Zustand benötigt wird.</p><p>Wähle „Aus Sicherung wiederherstellen“, öffne die gewünschte JSON-Datei und kontrolliere die Vorschau mit Sicherungsdatum, Profilen, Teleskopen, Kameras und Standorten. Vor der eigentlichen Wiederherstellung versucht die App, den aktuellen Zustand noch einmal als datierte Sicherung abzulegen. Die externe Datei bleibt nach dem Löschen von Websitedaten erhalten; die Ordnerberechtigung liegt jedoch in IndexedDB und muss danach erneut erteilt werden.</p></section>
    <section id="help-pwa"><h3>Installation als PWA und Offlinebetrieb</h3><p>Nach der Installation kann die App wie ein eigenständiges Programm gestartet werden. Programmdateien stehen offline zur Verfügung. Wetter-, Karten-, Meteoblue- und Katalogaktualisierungen benötigen weiterhin eine Internetverbindung.</p></section>
    <section id="help-troubleshooting"><h3>Fehlerbehebung</h3><p>Bei alten Darstellungen zuerst die App neu laden und einen angebotenen PWA-Updatehinweis bestätigen. Zeigt die Browserhilfe trotzdem einen veralteten Stand, die Anwendung vollständig schließen und neu öffnen. Externe Dienste wie Aladin, Meteoblue und Wettermodelle können zeitweise nicht erreichbar sein. Lösche Websitedaten nur als letzte Maßnahme und ausschließlich nach einer aktuellen externen Sicherung.</p></section>
    <section id="help-values"><h3>Bedeutung der Bewertungswerte</h3><p>Die Gesamtbewertung kombiniert Wolken, effektive Transparenz, Seeing, Wind/Böen, Tauabstand, Mond, Objekthöhe und Sichtbarkeitsdauer. Die Gewichte ergeben zusammen 100 %. Farben beziehen sich auf erwartete Aufnahmequalität, nicht auf die sichere Belastbarkeit der Ausrüstung.</p></section>
    <div class="help-return"><a class="button primary" href="./">Zurück zur aktuellen Anwendung</a></div>
  </div>`;
}

async function setObjectDetails(objectId,open=true,scroll=true){const changed=profile.planning.selectedObjectId!==objectId;profile.planning.selectedObjectId=objectId;profile.planning.detailsOpen=open;if(open&&(changed||!Number.isFinite(Number(profile.planning.frameRotation)))&&framingSettings().autoRotate){const object=catalog.find(item=>item.id===objectId);if(object)profile.planning.frameRotation=optimalFrameRotation(object)}await saveProfile();render();if(scroll)requestAnimationFrame(()=>{const row=[...document.querySelectorAll('[data-object-row]')].find(item=>item.dataset.objectRow===objectId);(open?row?.nextElementSibling:row)?.scrollIntoView({behavior:'smooth',block:open?'nearest':'center'})})}

function bindRendered(){
  const planningLocationSelect=document.getElementById('planningLocationSelect');
  if(planningLocationSelect)planningLocationSelect.onchange=async()=>{
    profile.planning.locationId=planningLocationSelect.value||null;
    profile.planning.temporaryHorizonProfileId=null;
    profile.planning.detailsOpen=false;profile.planning.cloudMapFrame=0;page=1;
    const location=activeLocation();selectedDateKey=dateKeyFor(new Date(),location.timezone);profile.planning.dateKey=selectedDateKey;
    cloudMapData=null;locationComparisonData=null;
    await saveProfile();render();fetchWeather();
  };
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
  const detailHorizon=document.getElementById('detailHorizonProfileSelect');if(detailHorizon)detailHorizon.onchange=async()=>{const loc=activeLocation();profile.planning.temporaryHorizonProfileId=detailHorizon.value===loc.defaultHorizonProfileId?null:detailHorizon.value;await saveProfile();render()};
  bindPlanProfiles();
  bindFraming();
  bindDetailTimeControls();
  bindDetails();
  bindCloudMap();
  bindMeteobluePanels();
  bindSettings();
}

function stopCloudMapAnimation(){
  if(cloudMapAnimationTimer){clearInterval(cloudMapAnimationTimer);cloudMapAnimationTimer=null}
  const button=document.getElementById('cloudMapPlay');
  if(button)button.textContent='▶ Abspielen';
}
function applyCloudMapFrame(index,persist=true){if(!cloudMapData)return;const times=cloudDisplayTimes(),max=Math.max(0,times.length-1),value=clamp(Math.round(Number(index)||0),0,max);profile.planning.cloudMapFrame=value;const slider=document.getElementById('cloudMapTime');if(slider){slider.max=String(max);slider.value=String(value)}updateCloudMapReadouts();drawCloudMap();if(persist)scheduleCloudMapProfileSave()}
function updateCloudMapReadouts(){if(!cloudMapData)return;const view=currentCloudMapView(),layer=profile.planning.cloudMapLayer||cloudMapSettings().defaultLayer,index=clamp(Number(profile.planning.cloudMapFrame)||0,0,cloudDisplayTimes().length-1),time=new Date(cloudDisplayTimes()[index]),stats=cloudFrameStats(view,layer,cloudRawPosition(index)),movement=estimateCloudMovement(view,layer,index),loc=activeLocation(),set=(id,text)=>{const element=document.getElementById(id);if(element)element.textContent=text};set('cloudMapTimeLabel',fmtDateTime(time,loc.timezone));set('cloudMapCenterValue',`${fmt(stats.center)} %`);set('cloudMapAverageValue',`${fmt(stats.average)} %`);set('cloudMapSpreadValue',`${fmt(stats.uncertainty,1)} %-Punkte`);set('cloudMapMovement',movement?.reliable?`Geschätzte Verlagerung: ${movement.direction} · ${fmt(movement.distance,0)} km/h · Sicherheit ${fmt(movement.confidence*100)} %`:'Bewegungsrichtung unsicher')}
async function fetchLocationComparison(){
  if(!profile.locations?.length)return;
  locationComparisonLoading=true;locationComparisonError='';locationComparisonData=null;render();
  try{
    const locations=profile.locations.slice(0,20);
    const activeNight=nightData(selectedDateKey,activeLocation());
    const range=cloudMapRange(activeNight);
    const modelResults={};
    for(const [modelKey,config] of Object.entries(WEATHER_MODEL_CONFIG)){
      const url=new URL('https://api.open-meteo.com/v1/forecast');
      url.search=new URLSearchParams({
        latitude:locations.map(location=>Number(location.latitude).toFixed(4)).join(','),
        longitude:locations.map(location=>Number(location.longitude).toFixed(4)).join(','),
        hourly:'cloud_cover,cloud_cover_high,precipitation',
        models:config.model,timezone:'GMT',
        start_date:range.start.toISOString().slice(0,10),
        end_date:range.end.toISOString().slice(0,10)
      });
      const response=await fetch(url);
      if(!response.ok)throw new Error(`${config.name}: HTTP ${response.status}`);
      const payload=await response.json();
      modelResults[modelKey]=Array.isArray(payload)?payload:[payload];
    }
    const weights=profile.central.weatherModels.weights;
    const rows=locations.map((location,locationIndex)=>{
      const hourlyFrames=range.times.map(frameTime=>{
        const values=[];
        for(const [modelKey] of Object.entries(WEATHER_MODEL_CONFIG)){
          const result=modelResults[modelKey]?.[locationIndex];
          if(!result?.hourly?.time)continue;
          const times=result.hourly.time.map(value=>parseCloudApiTime(value).getTime());
          const sourceIndex=nearestTimeIndex(times,frameTime.getTime());
          values.push({
            cloud:Number(result.hourly.cloud_cover?.[sourceIndex]),
            high:Number(result.hourly.cloud_cover_high?.[sourceIndex]),
            precip:Number(result.hourly.precipitation?.[sourceIndex]),
            weight:Number(weights[modelKey]||0)
          });
        }
        const positive=values.filter(item=>item.weight>0);
        const weightedValues=positive.length?positive:values.map(item=>({...item,weight:1}));
        const sum=weightedValues.reduce((acc,item)=>acc+item.weight,0)||1;
        const weighted=key=>weightedValues.reduce((acc,item)=>acc+Number(item[key]||0)*item.weight,0)/sum;
        const mean=weighted('cloud');
        const spread=Math.sqrt(weightedValues.reduce((acc,item)=>acc+Math.pow(item.cloud-mean,2)*item.weight,0)/sum);
        return{time:frameTime,cloud:mean,high:weighted('high'),precip:weighted('precip'),spread};
      });
      return{
        name:location.name,
        cloud:hourlyFrames.reduce((sum,frame)=>sum+frame.cloud,0)/hourlyFrames.length,
        spread:hourlyFrames.reduce((sum,frame)=>sum+frame.spread,0)/hourlyFrames.length
      };
    }).sort((a,b)=>a.cloud-b.cloud);
    locationComparisonData={rows,updatedAt:new Date().toISOString()};
  }catch(error){locationComparisonError=error?.message||'Standortvergleich konnte nicht geladen werden.'}
  finally{locationComparisonLoading=false;render()}
}
function bindCloudMap(){
  document.getElementById('cloudMapReload')?.addEventListener('click',()=>fetchCloudMap(true));
  const view=document.getElementById('cloudMapView');if(view)view.onchange=async()=>{profile.planning.temporaryCloudMapView=view.value;await saveProfile();updateCloudMapReadouts();drawCloudMap()};
  const layer=document.getElementById('cloudMapLayer');if(layer)layer.onchange=async()=>{profile.planning.cloudMapLayer=layer.value;await saveProfile();updateCloudMapReadouts();drawCloudMap()};
  const mode=document.getElementById('cloudMapMode');if(mode)mode.onchange=async()=>{profile.planning.cloudMapMode=mode.value;await saveProfile();drawCloudMap()};
  const step=document.getElementById('cloudMapTimeStep');if(step)step.onchange=async()=>{const oldTimes=cloudDisplayTimes(),oldTime=oldTimes[clamp(Number(profile.planning.cloudMapFrame)||0,0,oldTimes.length-1)];profile.planning.cloudMapTimeStepMinutes=Number(step.value);const newTimes=cloudDisplayTimes(),target=new Date(oldTime).getTime();profile.planning.cloudMapFrame=newTimes.reduce((best,item,index)=>Math.abs(new Date(item).getTime()-target)<Math.abs(new Date(newTimes[best]).getTime()-target)?index:best,0);await saveProfile();render()};
  const slider=document.getElementById('cloudMapTime');if(slider){slider.oninput=()=>applyCloudMapFrame(slider.value,false);slider.onchange=()=>applyCloudMapFrame(slider.value,true)}
  document.getElementById('cloudMapPrev')?.addEventListener('click',()=>applyCloudMapFrame((Number(profile.planning.cloudMapFrame)||0)-1));document.getElementById('cloudMapNext')?.addEventListener('click',()=>applyCloudMapFrame((Number(profile.planning.cloudMapFrame)||0)+1));
  document.getElementById('cloudMapPlay')?.addEventListener('click',()=>{if(cloudMapAnimationTimer){stopCloudMapAnimation();return}const button=document.getElementById('cloudMapPlay');if(button)button.textContent='Pause';cloudMapAnimationTimer=setInterval(()=>{if(!cloudMapData){stopCloudMapAnimation();return}const count=cloudDisplayTimes().length,next=((Number(profile.planning.cloudMapFrame)||0)+1)%count;applyCloudMapFrame(next,false)},Number(cloudMapSettings().animationMs)||900)});
  document.getElementById('loadLocationComparison')?.addEventListener('click',fetchLocationComparison);const details=document.getElementById('cloudMapDetails');if(details)details.ontoggle=()=>{profile.central.cloudMap.collapsed=!details.open;draft=deepClone(profile);scheduleCloudMapProfileSave()};
}
function bindMeteobluePanels(){
  document.querySelectorAll('[data-meteoblue-fullscreen]').forEach(button=>button.onclick=()=>{
    const element=document.getElementById(button.dataset.meteoblueFullscreen);
    if(!element)return;
    if(document.fullscreenElement)document.exitFullscreen?.();else element.requestFullscreen?.();
  });
  const seeing=document.getElementById('meteoblueDetails');
  if(seeing)seeing.ontoggle=()=>{profile.central.meteoblueCollapsed=!seeing.open;draft=deepClone(profile);scheduleCloudMapProfileSave()};
  const map=document.getElementById('meteoblueMapDetails');
  if(map)map.ontoggle=()=>{profile.central.cloudMap.meteoblueMapCollapsed=!map.open;draft=deepClone(profile);scheduleCloudMapProfileSave()};
}

function bindPlanProfiles(){
  const wind=document.getElementById('planWindProfile'),display=document.getElementById('planDisplayProfile'),weather=document.getElementById('planWeatherView'),scope=document.getElementById('planTelescope'),camera=document.getElementById('planCamera'),horizon=document.getElementById('planHorizonProfile');
  if(wind)wind.onchange=async()=>{profile.planning.temporaryWindProfile=wind.value||null;await saveProfile();render()};
  if(display)display.onchange=async()=>{profile.planning.temporaryDisplayProfile=display.value||null;profile.planning.detailsOpen=false;page=1;await saveProfile();render()};
  if(weather)weather.onchange=async()=>{profile.planning.temporaryWeatherView=weather.value||null;await saveProfile();render()};
  if(scope)scope.onchange=async()=>{profile.planning.temporaryTelescopeId=scope.value===profile.equipment.selectedTelescopeId?null:scope.value;profile.planning.detailsOpen=false;page=1;await saveProfile();render()};
  if(camera)camera.onchange=async()=>{profile.planning.temporaryCameraId=camera.value===profile.equipment.selectedCameraId?null:camera.value;profile.planning.detailsOpen=false;page=1;await saveProfile();render()};
  if(horizon)horizon.onchange=async()=>{const loc=activeLocation();profile.planning.temporaryHorizonProfileId=horizon.value===loc.defaultHorizonProfileId?null:horizon.value;await saveProfile();render()};
}
function sendAladinOverlayUpdate(){const frame=document.getElementById('aladinFrame');if(!frame?.contentWindow)return;const object=catalog.find(item=>item.id===profile.planning.selectedObjectId),setup=fov();if(!object)return;frame.contentWindow.postMessage({type:'anp-overlay',frameW:setup?.width||0,frameH:setup?.height||0,frameRot:normalizedAngle180(profile.planning.frameRotation||0),showFrame:Boolean(profile.central.frameVisible&&setup),objectW:Math.max(.02,(Number(object.majorArcMin)||1)/60),objectH:Math.max(.02,(Number(object.minorArcMin||object.majorArcMin)||1)/60),objectRot:normalizedAngle180((Number(object.positionAngleDeg)||0)+(Number(profile.planning.objectRotation)||0)),showObject:Boolean(profile.central.objectSizeVisible)},location.origin)}
function bindFraming(){
  const objectSelect=document.getElementById('framingObjectSelect');if(objectSelect)objectSelect.onchange=async()=>{const item=currentComputedObjects.find(entry=>entry.object.id===objectSelect.value)?.object||catalog.find(entry=>entry.id===objectSelect.value);profile.planning.selectedObjectId=objectSelect.value;if(item&&framingSettings().autoRotate)profile.planning.frameRotation=optimalFrameRotation(item);profile.planning.detailsOpen=true;await saveProfile();render();requestAnimationFrame(()=>document.getElementById(`objectDetail-${objectSelect.value}`)?.scrollIntoView({behavior:'smooth',block:'nearest'}))};
  const changeEquipment=async(type,value)=>{if(type==='scope')profile.planning.temporaryTelescopeId=value===profile.equipment.selectedTelescopeId?null:value;else profile.planning.temporaryCameraId=value===profile.equipment.selectedCameraId?null:value;const object=catalog.find(item=>item.id===profile.planning.selectedObjectId);if(object&&framingSettings().autoRotate)profile.planning.frameRotation=optimalFrameRotation(object);await saveProfile();render()};
  const scope=document.getElementById('framingTelescopeSelect'),camera=document.getElementById('framingCameraSelect');if(scope)scope.onchange=()=>changeEquipment('scope',scope.value);if(camera)camera.onchange=()=>changeEquipment('camera',camera.value);
  const frameVisible=document.getElementById('frameVisible');if(frameVisible)frameVisible.onchange=async()=>{profile.central.frameVisible=frameVisible.checked;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const objectVisible=document.getElementById('objectSizeVisible');if(objectVisible)objectVisible.onchange=async()=>{profile.central.objectSizeVisible=objectVisible.checked;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const bindRange=(id,key,scale,labelId)=>{const element=document.getElementById(id),label=document.getElementById(labelId);if(!element)return;element.oninput=()=>{const value=Number(element.value)*scale;profile.planning[key]=value;if(label)label.textContent=id==='framingTime'?`${Math.round(value*100)} %`:`${fmt(value)}°`;if(key==='frameRotation'||key==='objectRotation')sendAladinOverlayUpdate()};element.onchange=async()=>{profile.planning[key]=Number(element.value)*scale;await saveProfile();if(key==='frameRotation'||key==='objectRotation')render()}};
  bindRange('frameRotation','frameRotation',1,'frameRotationValue');bindRange('objectRotation','objectRotation',1,'objectRotationValue');bindRange('framingTime','timeFraction',.01,'framingTimeValue');
  document.getElementById('optimalFrameRotation')?.addEventListener('click',async()=>{const object=catalog.find(item=>item.id===profile.planning.selectedObjectId);if(!object)return;profile.planning.frameRotation=optimalFrameRotation(object);await saveProfile();render()});
}

function nearestDetailPoint(points,time){
  return points.reduce((best,point)=>Math.abs(point[0]-time)<Math.abs(best[0]-time)?point:best,points[0]);
}
function applyDetailTimeFraction(value,{persist=false}={}){
  const fraction=clamp(Number(value)||0,0,1);
  profile.planning.detailTimeFraction=fraction;
  const controllers=[...document.querySelectorAll('[data-detail-time-controller]')];
  controllers.forEach(controller=>{
    const start=Number(controller.dataset.start),end=Number(controller.dataset.end),timezone=controller.dataset.timezone;
    const time=start+(end-start)*fraction;
    const points=decodeCanvasData(controller.dataset.points);
    const nearest=points.length?nearestDetailPoint(points,time):null;
    const slider=controller.querySelector('[data-detail-time-slider]');
    const clock=controller.querySelector('[data-detail-time-clock]');
    if(slider)slider.value=String(Math.round(fraction*1000));
    if(clock)clock.value=clockInputValue(new Date(time),timezone);
    const label=controller.querySelector('[data-detail-time-label]');
    const position=controller.querySelector('[data-detail-time-position]');
    if(label)label.textContent=fmtDateTime(new Date(time),timezone);
    if(position&&nearest)position.textContent=`Höhe ${fmt(nearest[1])}° · Azimut ${fmt(nearest[2])}° (${cardinal(nearest[2])})`;
  });
  document.querySelectorAll('.large-altitude-chart,.large-horizon-chart').forEach(canvas=>{
    const controller=controllers[0];
    if(controller){
      const start=Number(controller.dataset.start),end=Number(controller.dataset.end);
      canvas.dataset.currentTime=String(start+(end-start)*fraction);
    }
  });
  drawLargeCharts();
  if(persist)saveProfile();
}
function bindDetailTimeControls(){
  document.querySelectorAll('[data-detail-time-slider]').forEach(slider=>{
    slider.addEventListener('input',()=>applyDetailTimeFraction(Number(slider.value)/1000));
    slider.addEventListener('change',()=>applyDetailTimeFraction(Number(slider.value)/1000,{persist:true}));
  });
  document.querySelectorAll('[data-detail-time-step]').forEach(button=>button.addEventListener('click',()=>{
    const controller=button.closest('[data-detail-time-controller]');
    const start=Number(controller.dataset.start),end=Number(controller.dataset.end);
    const delta=Number(button.dataset.detailTimeStep)*60000/Math.max(1,end-start);
    applyDetailTimeFraction((Number(profile.planning.detailTimeFraction)||0)+delta,{persist:true});
  }));
  document.querySelectorAll('[data-detail-time-clock]').forEach(input=>input.addEventListener('change',()=>{
    const controller=input.closest('[data-detail-time-controller]');
    const start=new Date(Number(controller.dataset.start)),end=new Date(Number(controller.dataset.end));
    applyDetailTimeFraction(nearestFractionForClock(input.value,start,end,controller.dataset.timezone),{persist:true});
  }));
  document.querySelectorAll('[data-detail-ground-toggle]').forEach(input=>input.addEventListener('change',()=>{
    profile.planning.showGroundHorizon=input.checked;
    document.querySelectorAll('[data-detail-ground-toggle]').forEach(other=>other.checked=input.checked);
    document.querySelectorAll('.large-horizon-chart').forEach(canvas=>canvas.dataset.showGround=String(input.checked));
    drawLargeCharts();
    saveProfile();
  }));
  document.querySelectorAll('.large-altitude-chart').forEach(canvas=>{
    let dragging=false;
    const update=event=>{
      const rect=canvas.getBoundingClientRect();
      const internalX=(event.clientX-rect.left)/Math.max(1,rect.width)*canvas.width;
      const marginLeft=62,plotWidth=canvas.width-62-22;
      applyDetailTimeFraction((internalX-marginLeft)/Math.max(1,plotWidth));
    };
    canvas.addEventListener('pointerdown',event=>{dragging=true;canvas.setPointerCapture?.(event.pointerId);update(event)});
    canvas.addEventListener('pointermove',event=>{if(dragging)update(event)});
    canvas.addEventListener('pointerup',event=>{if(!dragging)return;dragging=false;canvas.releasePointerCapture?.(event.pointerId);applyDetailTimeFraction(profile.planning.detailTimeFraction,{persist:true})});
    canvas.addEventListener('pointercancel',()=>{dragging=false});
  });
}
function bindDetails(){
  const f=document.getElementById('filterDetails');if(f)f.ontoggle=async()=>{profile.central.collapsed.filters=!f.open;await saveProfile()};
  const w=document.getElementById('weatherDetails');if(w)w.ontoggle=async()=>{profile.central.collapsed.weather=!w.open;await saveProfile()};
  const m=document.getElementById('meteoblueDetails');if(m)m.ontoggle=async()=>{profile.central.meteoblueCollapsed=!m.open;await saveProfile();draft=deepClone(profile)};
  document.querySelectorAll('.object-chart-panel').forEach(panel=>panel.addEventListener('toggle',()=>{if(panel.open)requestAnimationFrame(drawLargeCharts)}));
}
function bindSettings(){
  document.querySelectorAll('[data-settings-tab]').forEach(b=>b.onclick=async()=>{currentSettingsTab=b.dataset.settingsTab;profile.ui.settingsTab=currentSettingsTab;await saveProfile();render()});
  const ps=document.getElementById('settingsProfileSelect');if(ps)ps.onchange=()=>{document.getElementById('headerProfileSelect').value=ps.value;document.getElementById('headerProfileSelect').dispatchEvent(new Event('change'))};
  document.getElementById('newProfile')?.addEventListener('click',createProfile);document.getElementById('duplicateProfile')?.addEventListener('click',duplicateProfile);document.getElementById('renameProfile')?.addEventListener('click',renameProfile);document.getElementById('deleteProfile')?.addEventListener('click',deleteProfile);
  bindEquipmentDraft();bindCentralDraft();bindLocationDraft();bindInfoActions();
  document.querySelectorAll('[data-save-section]').forEach(b=>b.onclick=()=>saveDraftSection(b.dataset.saveSection));
}
function setSectionDirty(section){
  dirtySections.add(section);
  const button=document.querySelector(`[data-save-section="${section}"]`);
  const bar=button?.closest('.save-bar');
  if(bar){
    bar.classList.add('is-dirty');bar.classList.remove('is-success');
    const state=bar.querySelector('.save-state');if(state)state.textContent='Ungespeicherte Änderungen';
  }
  if(button){button.disabled=false;button.classList.remove('save-success');button.textContent=button.dataset.defaultLabel||'Änderungen speichern'}
  const tabGroups={equipment:['equipment'],central:['centralWind','weatherModels','cloudMap','weights','display'],locations:['locations'],info:['backup']};
  for(const [tab,sections]of Object.entries(tabGroups))if(sections.includes(section))document.querySelector(`[data-settings-tab="${tab}"]`)?.classList.add('dirty-dot');
}
function markDirty(section){setSectionDirty(section)}
function bindEquipmentDraft(){
  document.querySelectorAll('[data-scope-row]').forEach(row=>row.querySelectorAll('[data-scope]').forEach(element=>element.onchange=()=>{const item=draft.equipment.telescopes.find(value=>value.id===row.dataset.scopeRow);item[element.dataset.scope]=element.type==='number'?Number(element.value):element.value;setSectionDirty('equipment')}));
  document.querySelectorAll('[data-camera-row]').forEach(row=>row.querySelectorAll('[data-camera]').forEach(element=>element.onchange=()=>{const item=draft.equipment.cameras.find(value=>value.id===row.dataset.cameraRow);item[element.dataset.camera]=element.type==='number'?Number(element.value):element.value;setSectionDirty('equipment')}));
  document.querySelectorAll('[data-mount-row]').forEach(row=>row.querySelectorAll('[data-mount]').forEach(element=>element.onchange=()=>{const item=draft.equipment.mounts.find(value=>value.id===row.dataset.mountRow);const field=element.dataset.mount;item[field]=element.type==='number'?(element.value===''?null:Number(element.value)):element.value;setSectionDirty('equipment')}));
  document.querySelectorAll('[data-selected-scope]').forEach(element=>element.onchange=()=>{draft.equipment.selectedTelescopeId=element.value;setSectionDirty('equipment')});
  document.querySelectorAll('[data-selected-camera]').forEach(element=>element.onchange=()=>{draft.equipment.selectedCameraId=element.value;setSectionDirty('equipment')});
  document.querySelectorAll('[data-selected-mount]').forEach(element=>element.onchange=()=>{draft.equipment.selectedMountId=element.value;setSectionDirty('equipment')});
  document.getElementById('addTelescope')?.addEventListener('click',()=>{const id=uid('scope');draft.equipment.telescopes.push({id,name:'Neues Teleskop',focalLength:500,aperture:80});draft.equipment.selectedTelescopeId=id;setSectionDirty('equipment');render()});
  document.getElementById('addCamera')?.addEventListener('click',()=>{const id=uid('cam');draft.equipment.cameras.push({id,name:'Neue Kamera',sensorWidth:23.5,sensorHeight:15.7,pixelSize:3.76});draft.equipment.selectedCameraId=id;setSectionDirty('equipment');render()});
  document.getElementById('addMount')?.addEventListener('click',()=>{const id=uid('mount');draft.equipment.mounts.push({id,name:'Neue Montierung',type:'Parallaktisch',maxPayloadKg:null});draft.equipment.selectedMountId=id;setSectionDirty('equipment');render()});
  document.querySelectorAll('[data-delete-scope]').forEach(button=>button.onclick=()=>{if(draft.equipment.telescopes.length<=1)return alert('Mindestens ein Teleskop muss erhalten bleiben.');draft.equipment.telescopes=draft.equipment.telescopes.filter(item=>item.id!==button.dataset.deleteScope);draft.equipment.selectedTelescopeId=draft.equipment.telescopes[0]?.id||'';setSectionDirty('equipment');render()});
  document.querySelectorAll('[data-delete-camera]').forEach(button=>button.onclick=()=>{if(draft.equipment.cameras.length<=1)return alert('Mindestens eine Kamera muss erhalten bleiben.');draft.equipment.cameras=draft.equipment.cameras.filter(item=>item.id!==button.dataset.deleteCamera);draft.equipment.selectedCameraId=draft.equipment.cameras[0]?.id||'';setSectionDirty('equipment');render()});
  document.querySelectorAll('[data-delete-mount]').forEach(button=>button.onclick=()=>{if(draft.equipment.mounts.length<=1)return alert('Mindestens eine Montierung muss erhalten bleiben.');draft.equipment.mounts=draft.equipment.mounts.filter(item=>item.id!==button.dataset.deleteMount);draft.equipment.selectedMountId=draft.equipment.mounts[0]?.id||'';setSectionDirty('equipment');render()});
}
function bindCentralDraft(){
  const set=(id,handler,section,eventName='change')=>{
    const element=document.getElementById(id);
    if(element)element.addEventListener(eventName,()=>{handler(element);setSectionDirty(section)});
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
      setSectionDirty('centralWind');
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
    setSectionDirty('centralWind');
  });
  document.querySelectorAll('[data-weather-weight]').forEach(element=>element.onchange=()=>{
    draft.central.weatherModels.weights[element.dataset.weatherWeight]=Math.round(Number(element.value));
    setSectionDirty('weatherModels');
    render();
  });
  set('defaultWeatherView',element=>draft.central.weatherModels.defaultView=element.value,'weatherModels');
  set('cloudMapGridSize',element=>draft.central.cloudMap.gridSize=Number(element.value),'cloudMap');
  set('cloudMapRadius',element=>draft.central.cloudMap.radiusKm=Number(element.value),'cloudMap');
  set('cloudMapAnimationMs',element=>draft.central.cloudMap.animationMs=Number(element.value),'cloudMap');
  set('cloudMapTimeStepDefault',element=>draft.central.cloudMap.timeStepMinutes=Number(element.value),'cloudMap');
  set('defaultCloudMapView',element=>draft.central.cloudMap.defaultView=element.value,'cloudMap');
  set('defaultCloudMapLayer',element=>draft.central.cloudMap.defaultLayer=element.value,'cloudMap');
  set('defaultCloudMapMode',element=>draft.central.cloudMap.defaultMode=element.value,'cloudMap');
  set('cloudMapCollapsedDefault',element=>draft.central.cloudMap.collapsed=element.checked,'cloudMap');
  set('meteoblueMapCollapsedDefault',element=>draft.central.cloudMap.meteoblueMapCollapsed=element.checked,'cloudMap');
  document.querySelectorAll('[data-weight]').forEach(element=>element.onchange=()=>{
    draft.central.weights[element.dataset.weight]=Math.round(Number(element.value));
    setSectionDirty('weights');
    render();
  });
  set('defaultPlanningWindow',element=>draft.central.defaultPlanningWindow=element.value,'display');
  set('framingMinMargin',element=>draft.central.framing.minMarginPercent=clamp(Number(element.value)||10,0,45),'display');
  set('framingAutoRotate',element=>draft.central.framing.autoRotate=element.checked,'display');
  set('activeDisplayProfile',element=>draft.central.listDisplay.activeProfile=element.value,'display');
  set('defaultFrameVisible',element=>draft.central.frameVisible=element.checked,'display');
  set('defaultObjectVisible',element=>draft.central.objectSizeVisible=element.checked,'display');
  set('defaultMeteoblueCollapsed',element=>draft.central.meteoblueCollapsed=element.checked,'display');
  set('defaultAltitudeCollapsed',element=>draft.central.detailPanels.altitudeCollapsed=element.checked,'display');
  set('defaultHorizonCollapsed',element=>draft.central.detailPanels.horizonCollapsed=element.checked,'display');
  document.querySelectorAll('[data-display-page-size]').forEach(element=>element.onchange=()=>{
    draft.central.listDisplay.profiles[element.dataset.displayPageSize].pageSize=Number(element.value);
    setSectionDirty('display');
  });
  document.querySelectorAll('[data-display-column-profile]').forEach(element=>element.onchange=()=>{
    const array=draft.central.listDisplay.profiles[element.dataset.displayColumnProfile].columns;
    draft.central.listDisplay.profiles[element.dataset.displayColumnProfile].columns=element.checked?[...new Set([...array,element.dataset.column])]:array.filter(item=>item!==element.dataset.column);
    setSectionDirty('display');
  });
  document.getElementById('resetDisplayProfiles')?.addEventListener('click',()=>{
    draft.central.listDisplay.profiles=deepClone(DISPLAY_PROFILES);
    draft.central.listDisplay.activeProfile='standard';
    setSectionDirty('display');
    render();
  });
}
function bindLocationDraft(){
  const location=()=>draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0],entry=()=>horizonProfileFor(location(),location().selectedHorizonProfileId),mark=()=>{syncCardinalHorizon(location(),entry()?.id);setSectionDirty('locations');syncSettingsHorizonCanvas()},set=(id,field,numeric=false)=>{const element=document.getElementById(id);if(element)element.onchange=()=>{location()[field]=numeric?Number(element.value):element.value;setSectionDirty('locations')}};
  const locationSelect=document.getElementById('locationSelect');if(locationSelect)locationSelect.onchange=()=>{draft.selectedLocationId=locationSelect.value;horizonUndoStack=[];render()};
  set('locName','name');set('locTimezone','timezone');set('locLat','latitude',true);set('locLon','longitude',true);set('locElevation','elevation',true);
  const defaultSelect=document.getElementById('defaultLocationSelect');if(defaultSelect)defaultSelect.onchange=()=>{draft.central.defaultLocationId=defaultSelect.value;setSectionDirty('locations')};
  const gpsBehavior=document.getElementById('gpsBehavior');if(gpsBehavior)gpsBehavior.onchange=()=>{draft.central.gpsBehavior=gpsBehavior.value;setSectionDirty('locations')};
  document.getElementById('addLocation')?.addEventListener('click',()=>{const id=uid('loc'),horizonId=uid('horizon');draft.locations.push({id,name:'Neuer Standort',latitude:48.5,longitude:9,elevation:0,timezone:'Europe/Berlin',horizonProfiles:[{id:horizonId,name:'Freier Horizont',horizonProfile:Array(73).fill(0),obstacles:[]}],defaultHorizonProfileId:horizonId,selectedHorizonProfileId:horizonId,horizonProfile:Array(73).fill(0),horizon:[0,0,0,0,0,0,0,0],obstacles:[]});draft.selectedLocationId=id;horizonUndoStack=[];setSectionDirty('locations');render()});
  document.getElementById('deleteLocation')?.addEventListener('click',()=>{draft.locations=draft.locations.filter(item=>item.id!==location().id);draft.selectedLocationId=draft.locations[0].id;if(!draft.locations.some(item=>item.id===draft.central.defaultLocationId))draft.central.defaultLocationId=draft.locations[0].id;horizonUndoStack=[];setSectionDirty('locations');render()});
  document.getElementById('useGps')?.addEventListener('click',()=>navigator.geolocation?.getCurrentPosition(position=>{location().latitude=position.coords.latitude;location().longitude=position.coords.longitude;location().elevation=position.coords.altitude||location().elevation;delete location().geonameId;delete location().meteobluePath;setSectionDirty('locations');render()},error=>alert(`GPS nicht verfügbar: ${error.message}`)));
  document.getElementById('searchLocation')?.addEventListener('click',async()=>{const name=prompt('Ort oder Postleitzahl:');if(!name)return;try{const response=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=de&format=json`),json=await response.json(),result=json.results?.[0];if(!result)throw new Error('Kein Treffer');const country=result.country||result.country_code||'',cityName=result.name||name;Object.assign(location(),{name:`${cityName}${result.admin1?`, ${result.admin1}`:''}`,latitude:result.latitude,longitude:result.longitude,elevation:result.elevation||0,timezone:result.timezone||'Europe/Berlin',geonameId:result.id||undefined,country,meteobluePath:result.id?`${meteoblueSlugPart(cityName)}_${meteoblueSlugPart(country||'Deutschland')}_${result.id}`:undefined});setSectionDirty('locations');render()}catch(error){alert(error.message)}});
  const profileSelect=document.getElementById('horizonProfileSelect');if(profileSelect)profileSelect.onchange=()=>{location().selectedHorizonProfileId=profileSelect.value;horizonUndoStack=[];render()};
  const defaultProfile=document.getElementById('defaultHorizonProfileSelect');if(defaultProfile)defaultProfile.onchange=()=>{location().defaultHorizonProfileId=defaultProfile.value;setSectionDirty('locations')};
  document.getElementById('addHorizonProfile')?.addEventListener('click',()=>{const name=prompt('Name des neuen Horizontprofils:','Neues Horizontprofil');if(!name)return;const id=uid('horizon');horizonProfilesFor(location()).push({id,name:name.trim(),horizonProfile:Array(73).fill(0),obstacles:[]});location().selectedHorizonProfileId=id;setSectionDirty('locations');render()});
  document.getElementById('duplicateHorizonProfile')?.addEventListener('click',()=>{const current=entry(),name=prompt('Name der Kopie:',`${current.name} – Kopie`);if(!name)return;const copy=deepClone(current);copy.id=uid('horizon');copy.name=name.trim();horizonProfilesFor(location()).push(copy);location().selectedHorizonProfileId=copy.id;setSectionDirty('locations');render()});
  document.getElementById('renameHorizonProfile')?.addEventListener('click',()=>{const current=entry(),name=prompt('Neuer Name:',current.name);if(!name)return;current.name=name.trim();setSectionDirty('locations');render()});
  document.getElementById('deleteHorizonProfile')?.addEventListener('click',()=>{const profiles=horizonProfilesFor(location()),current=entry();if(profiles.length<=1||!confirm(`Horizontprofil „${current.name}“ löschen?`))return;location().horizonProfiles=profiles.filter(item=>item.id!==current.id);if(location().defaultHorizonProfileId===current.id)location().defaultHorizonProfileId=location().horizonProfiles[0].id;location().selectedHorizonProfileId=location().defaultHorizonProfileId;setSectionDirty('locations');render()});
  document.getElementById('resetHorizon')?.addEventListener('click',()=>{horizonUndoStack.push(ensureHorizonProfile(location(),entry()?.id).slice());horizonUndoStack=horizonUndoStack.slice(-20);entry().horizonProfile=Array(73).fill(0);mark();render()});
  document.getElementById('undoHorizon')?.addEventListener('click',()=>{const previous=horizonUndoStack.pop();if(!previous)return;entry().horizonProfile=previous.slice();mark();render()});
  const canvas=document.querySelector('.settings-horizon-chart[data-editable="true"]');if(canvas){let drawing=false,lastIndex=null,lastAltitude=null;const pointFromEvent=event=>{const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*canvas.width/Math.max(1,rect.width),y=(event.clientY-rect.top)*canvas.height/Math.max(1,rect.height),margin={left:62,right:22,top:22,bottom:68},plotW=canvas.width-margin.left-margin.right,plotH=canvas.height-margin.top-margin.bottom;return{index:clamp(Math.round(clamp((x-margin.left)/plotW*360,0,360)/5),0,72),altitude:clamp(90-(y-margin.top)/plotH*90,0,90)}};const applyPoint=point=>{const values=ensureHorizonProfile(location(),entry()?.id);if(lastIndex===null)values[point.index]=point.altitude;else{const from=Math.min(lastIndex,point.index),to=Math.max(lastIndex,point.index),span=Math.max(1,to-from);for(let index=from;index<=to;index++){const fraction=(index-from)/span,start=lastIndex<=point.index?lastAltitude:point.altitude,end=lastIndex<=point.index?point.altitude:lastAltitude;values[index]=start+(end-start)*fraction}}if(point.index===0||point.index===72){values[0]=point.altitude;values[72]=point.altitude}lastIndex=point.index;lastAltitude=point.altitude;mark()};canvas.addEventListener('pointerdown',event=>{event.preventDefault();drawing=true;canvas.setPointerCapture?.(event.pointerId);horizonUndoStack.push(ensureHorizonProfile(location(),entry()?.id).slice());horizonUndoStack=horizonUndoStack.slice(-20);lastIndex=null;lastAltitude=null;applyPoint(pointFromEvent(event))});canvas.addEventListener('pointermove',event=>{if(!drawing)return;event.preventDefault();applyPoint(pointFromEvent(event))});const stop=event=>{if(!drawing)return;drawing=false;canvas.releasePointerCapture?.(event.pointerId);lastIndex=null;lastAltitude=null;render()};canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop)}
  document.getElementById('addObstacle')?.addEventListener('click',()=>{entry().obstacles.push({id:uid('obs'),name:'Baum/Gebäude',azimuth:180,altitude:20});setSectionDirty('locations');render()});
  document.querySelectorAll('[data-obstacle]').forEach(row=>row.querySelectorAll('[data-obstacle-field]').forEach(element=>{const update=()=>{const obstacle=entry().obstacles.find(item=>item.id===row.dataset.obstacle);obstacle[element.dataset.obstacleField]=element.type==='number'?Number(element.value):element.value;setSectionDirty('locations');syncSettingsHorizonCanvas()};element.oninput=update;element.onchange=update}));
  document.querySelectorAll('[data-delete-obstacle]').forEach(button=>button.onclick=()=>{entry().obstacles=entry().obstacles.filter(item=>item.id!==button.dataset.deleteObstacle);setSectionDirty('locations');render()});
}
async function saveDraftSection(section){
  let profileChanged=true;
  if(section==='equipment'){
    profile.equipment=deepClone(draft.equipment);
    if(profile.planning.temporaryTelescopeId&&!profile.equipment.telescopes.some(item=>item.id===profile.planning.temporaryTelescopeId))profile.planning.temporaryTelescopeId=null;
    if(profile.planning.temporaryCameraId&&!profile.equipment.cameras.some(item=>item.id===profile.planning.temporaryCameraId))profile.planning.temporaryCameraId=null;
    dirtySections.delete('equipment');
  }
  if(section==='centralWind'){
    profile.central.windUnit=draft.central.windUnit;profile.central.activeWindProfile=draft.central.activeWindProfile;profile.central.windProfiles=deepClone(draft.central.windProfiles);profile.central.dew=deepClone(draft.central.dew);profile.central.jet=deepClone(draft.central.jet);dirtySections.delete('centralWind');
  }
  if(section==='weatherModels'){
    const total=Object.values(draft.central.weatherModels.weights).reduce((sum,value)=>sum+Number(value),0);
    if(total!==100){alert('Die Gewichtung der Wettermodelle muss exakt 100 % ergeben.');return}
    profile.central.weatherModels=deepClone(draft.central.weatherModels);profile.planning.temporaryWeatherView=null;profile.planning.temporaryCloudMapView=null;dirtySections.delete('weatherModels');
  }
  if(section==='cloudMap'){
    profile.central.cloudMap={...deepClone(draft.central.cloudMap)};profile.planning.temporaryCloudMapView=null;profile.planning.cloudMapLayer=profile.central.cloudMap.defaultLayer;profile.planning.cloudMapMode=profile.central.cloudMap.defaultMode;profile.planning.cloudMapFrame=0;profile.planning.cloudMapTimeStepMinutes=null;cloudMapData=null;dirtySections.delete('cloudMap');
  }
  if(section==='weights'){
    const total=Object.values(draft.central.weights).reduce((sum,value)=>sum+Number(value),0);
    if(total!==100){alert('Die Gewichtung muss exakt 100 % ergeben.');return}
    profile.central.weights=deepClone(draft.central.weights);dirtySections.delete('weights');
  }
  if(section==='display'){
    profile.central.defaultPlanningWindow=draft.central.defaultPlanningWindow;profile.planning.planningWindow=draft.central.defaultPlanningWindow;profile.central.framing=deepClone(draft.central.framing);profile.central.listDisplay=deepClone(draft.central.listDisplay);profile.central.frameVisible=draft.central.frameVisible;profile.central.objectSizeVisible=draft.central.objectSizeVisible;profile.central.meteoblueCollapsed=draft.central.meteoblueCollapsed;profile.central.detailPanels=deepClone(draft.central.detailPanels);profile.planning.detailsOpen=false;page=1;dirtySections.delete('display');
  }
  if(section==='locations'){
    draft.locations.forEach(item=>{horizonProfilesFor(item).forEach(entry=>{ensureHorizonProfile(item,entry.id);entry.horizonProfile[72]=entry.horizonProfile[0]});syncCardinalHorizon(item,item.selectedHorizonProfileId)});
    profile.locations=deepClone(draft.locations);profile.selectedLocationId=draft.selectedLocationId;profile.central.defaultLocationId=draft.central.defaultLocationId;profile.central.gpsBehavior=draft.central.gpsBehavior;if(profile.planning.locationId&&!profile.locations.some(item=>item.id===profile.planning.locationId))profile.planning.locationId=null;const active=activeLocation();if(profile.planning.temporaryHorizonProfileId&&!horizonProfilesFor(active).some(item=>item.id===profile.planning.temporaryHorizonProfileId))profile.planning.temporaryHorizonProfileId=null;dirtySections.delete('locations');horizonUndoStack=[];
  }
  if(section==='backup'){
    profileChanged=false;
    if(backupDraft.enabled&&storageInfo.fileSystemSupported&&!await getBackupDirectoryHandle()){
      alert('Bitte zuerst einen Sicherungsordner auswählen oder die automatische Sicherung deaktivieren.');
      return;
    }
    backupConfig={...backupConfig,...deepClone(backupDraft),keep:clamp(Number(backupDraft.keep)||10,1,50),reminderDays:clamp(Number(backupDraft.reminderDays)||7,1,90)};
    await saveBackupConfig();dirtySections.delete('backup');
  }
  if(profileChanged)await saveProfile();
  draft=deepClone(profile);backupDraft=deepClone(backupConfig);
  saveFeedbackSections.add(section);render();
  window.setTimeout(()=>{saveFeedbackSections.delete(section);if(currentMainTab==='settings')render()},3000);
  if(section==='locations'||section==='weatherModels')fetchWeather();
  else if(section==='cloudMap')fetchCloudMap(true);
  await maybeAutomaticBackup('settings');
}

async function createProfile(){const name=prompt('Name des neuen Profils:','Neues Profil');if(!name)return;const p=standardProfile();p.id=uid('profile');p.name=name.trim();await idbPut('profiles',p);profiles=await idbAll('profiles');profile=p;draft=deepClone(p);await setActiveProfile(p.id);updateProfileSelectors();render()}
async function duplicateProfile(){const name=prompt('Name der Kopie:',`${profile.name} – Kopie`);if(!name)return;const p=deepClone(profile);p.id=uid('profile');p.name=name.trim();p.createdAt=new Date().toISOString();await idbPut('profiles',p);profiles=await idbAll('profiles');profile=p;draft=deepClone(p);await setActiveProfile(p.id);updateProfileSelectors();render()}
async function renameProfile(){const name=prompt('Neuer Profilname:',profile.name);if(!name)return;profile.name=name.trim();draft.name=profile.name;await saveProfile();render()}
async function deleteProfile(){if(profiles.length===1||!confirm(`Profil „${profile.name}“ wirklich löschen?`))return;await idbDelete('profiles',profile.id);profiles=await idbAll('profiles');profile=normalizeProfile(profiles[0]);draft=deepClone(profile);await setActiveProfile(profile.id);updateProfileSelectors();render()}
function bindInfoActions(){
  document.getElementById('exportProfile')?.addEventListener('click',()=>downloadJson(`astro-night-planner-profil-${safeName(profile.name)}.json`,{kind:'astro-night-planner-profile',appVersion:APP_VERSION,exportedAt:new Date().toISOString(),profile}));
  document.getElementById('exportAll')?.addEventListener('click',async()=>{downloadJson(`astro-night-planner-sicherung-${new Date().toISOString().slice(0,10)}.json`,await buildBackupPayload());backupConfig.lastSuccessAt=new Date().toISOString();backupConfig.lastError='';await saveBackupConfig();backupDraft=deepClone(backupConfig);render()});
  document.getElementById('importProfile')?.addEventListener('click',()=>importInput.click());
  document.getElementById('restoreBackup')?.addEventListener('click',()=>importInput.click());
  document.getElementById('refreshStorageStatus')?.addEventListener('click',async()=>{await refreshStorageInfo();render()});
  document.getElementById('requestPersistence')?.addEventListener('click',async()=>{
    const message=document.getElementById('storageMessage');
    if(!navigator.storage?.persist){if(message)message.textContent='Dieser Browser unterstützt die Anforderung persistenten Speichers nicht.';return}
    try{
      const granted=await navigator.storage.persist();
      profile.central.persistentStorageRequested=granted;
      await saveProfile();
      await refreshStorageInfo();
      if(message)message.textContent=granted?'Speicherschutz aktiv: Der Browser soll diese Daten nicht automatisch wegen Speichermangels entfernen. Manuelles Löschen der Websitedaten bleibt weiterhin möglich.':'Der Browser hat den Speicherschutz nicht gewährt. Regelmäßige externe Sicherungen bleiben besonders wichtig.';
      window.setTimeout(render,1200);
    }catch(error){if(message)message.textContent=`Speicherschutz konnte nicht angefordert werden: ${error.message}`}
  });
  const bindBackupDraft=(id,key,type='checked')=>{
    const element=document.getElementById(id);
    if(!element)return;
    element.addEventListener('change',()=>{
      backupDraft[key]=type==='number'?Number(element.value):element.checked;
      setSectionDirty('backup');
      render();
    });
  };
  bindBackupDraft('backupEnabled','enabled');
  bindBackupDraft('backupAfterSave','afterSave');
  bindBackupDraft('backupDaily','daily');
  bindBackupDraft('backupKeep','keep','number');
  bindBackupDraft('backupReminderDays','reminderDays','number');
  document.getElementById('chooseBackupDirectory')?.addEventListener('click',async()=>{
    if(typeof window.showDirectoryPicker!=='function'){alert('Dieser Browser unterstützt keine automatische Ordnersicherung. Verwende stattdessen „Komplette Sicherung herunterladen“.');return}
    try{
      const handle=await window.showDirectoryPicker({id:'astro-night-planner-backup',mode:'readwrite',startIn:'documents'});
      await setMetaValue('backupDirectoryHandle',handle);
      backupConfig.targetName=handle.name||'Gewählter Ordner';
      backupConfig.permission=await fileHandlePermission(handle,true);
      backupDraft=deepClone(backupConfig);
      await saveBackupConfig();
      await refreshStorageInfo();
      render();
    }catch(error){if(error?.name!=='AbortError')alert(`Sicherungsordner konnte nicht gewählt werden: ${error.message}`)}
  });
  document.getElementById('backupNow')?.addEventListener('click',async()=>{
    const button=document.getElementById('backupNow');
    if(button){button.disabled=true;button.textContent='Sicherung läuft …'}
    try{
      if(storageInfo.fileSystemSupported&&await getBackupDirectoryHandle()){
        const ok=await performExternalBackup({forceDated:true,requestPermission:true});
        if(!ok)throw new Error(backupConfig.lastError||'Externe Sicherung nicht möglich.');
        await refreshStorageInfo();
        saveFeedbackSections.add('backup');
        render();
        window.setTimeout(()=>{saveFeedbackSections.delete('backup');if(currentMainTab==='settings')render()},3000);
      }else{
        downloadJson(`astro-night-planner-sicherung-${new Date().toISOString().slice(0,10)}.json`,await buildBackupPayload());
        backupConfig.lastSuccessAt=new Date().toISOString();backupConfig.lastError='';
        await saveBackupConfig();backupDraft=deepClone(backupConfig);render();
      }
    }catch(error){alert(`Sicherung fehlgeschlagen: ${error.message}`);render()}
  });
}
function downloadJson(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function safeName(s){return s.toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'-').replace(/^-|-$/g,'')}
async function handleImportFile(){const file=importInput.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(data.kind==='astro-night-planner-backup'&&Array.isArray(data.profiles)){const counts=data.profiles.reduce((acc,item)=>{acc.telescopes+=(item.equipment?.telescopes||[]).length;acc.cameras+=(item.equipment?.cameras||[]).length;acc.locations+=(item.locations||[]).length;return acc},{telescopes:0,cameras:0,locations:0}),date=data.exportedAt?new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(data.exportedAt)):'unbekannt';if(!confirm(`Sicherung vom ${date}\nProfile: ${data.profiles.length}\nTeleskope: ${counts.telescopes}\nKameras: ${counts.cameras}\nStandorte: ${counts.locations}\n\nDiesen Stand wiederherstellen? Gleichnamige IDs werden überschrieben.`))return;try{await performExternalBackup({forceDated:true})}catch{}for(const item of data.profiles)await idbPut('profiles',normalizeProfile(item));profiles=await idbAll('profiles');profile=normalizeProfile(profiles.find(item=>item.id===data.activeProfileId)||profiles[0]);await setActiveProfile(profile.id);if(data.backupSettings){backupConfig={...backupConfig,...data.backupSettings,enabled:false,targetName:'',permission:'none',lastError:'',lastSuccessAt:null,lastDailyDate:null};await saveBackupConfig();backupDraft=deepClone(backupConfig)}}else{const raw=data.profile||data;if(!raw.name)throw new Error('Kein gültiges Profil');const imported=normalizeProfile(raw);if(profiles.some(item=>item.id===imported.id))imported.id=uid('profile');await idbPut('profiles',imported);profiles=await idbAll('profiles');profile=imported;await setActiveProfile(imported.id)}draft=deepClone(profile);dirtySections.clear();updateProfileSelectors();render();alert('Import erfolgreich.')}catch(error){alert(`Import fehlgeschlagen: ${error.message}`)}finally{importInput.value=''}}


function cloudMapInterpolated(values,size,gx,gy){
  const x0=clamp(Math.floor(gx),0,size-1),y0=clamp(Math.floor(gy),0,size-1);
  const x1=Math.min(size-1,x0+1),y1=Math.min(size-1,y0+1);
  const fx=gx-x0,fy=gy-y0;
  const v00=Number(values[y0*size+x0]),v10=Number(values[y0*size+x1]),v01=Number(values[y1*size+x0]),v11=Number(values[y1*size+x1]);
  const vals=[v00,v10,v01,v11].filter(Number.isFinite);
  if(!vals.length)return NaN;
  const safe=value=>Number.isFinite(value)?value:vals.reduce((a,b)=>a+b,0)/vals.length;
  const top=safe(v00)*(1-fx)+safe(v10)*fx;
  const bottom=safe(v01)*(1-fx)+safe(v11)*fx;
  return top*(1-fy)+bottom*fy;
}
function cloudMapColor(value,layer,mode){
  if(!Number.isFinite(value))return'rgba(0,0,0,0)';
  if(mode==='uncertainty'){
    const t=clamp(value/30,0,1);
    const hue=120*(1-t);
    return`hsla(${hue},82%,50%,${.28+.68*t})`;
  }
  const t=clamp(value/100,0,1);
  const palette={
    cloud:{hue:210,saturation:22,light0:15,light1:92},
    cloudLow:{hue:180,saturation:70,light0:12,light1:82},
    cloudMid:{hue:218,saturation:72,light0:13,light1:83},
    cloudHigh:{hue:276,saturation:66,light0:14,light1:84}
  }[layer]||{hue:210,saturation:22,light0:15,light1:92};
  const light=palette.light0+(palette.light1-palette.light0)*t;
  return`hsla(${palette.hue},${palette.saturation}%,${light}%,${.32+.66*t})`;
}
function cloudLegendDefinition(layer,mode){
  if(mode==='uncertainty')return{left:'geringe Abweichung',right:'starke Abweichung',gradient:'linear-gradient(90deg,#2ed274 0%,#d7d34a 50%,#ef5a5a 100%)',suffix:''};
  const definitions={
    cloud:{left:'klar 0 %',right:'bedeckt 100 %',gradient:'linear-gradient(90deg,#081726 0%,#526779 50%,#eef4f8 100%)'},
    cloudLow:{left:'keine tiefen Wolken',right:'starke tiefe Bewölkung',gradient:'linear-gradient(90deg,#061a1b 0%,#1e8f91 50%,#b9f4ec 100%)'},
    cloudMid:{left:'keine mittleren Wolken',right:'starke mittlere Bewölkung',gradient:'linear-gradient(90deg,#07142a 0%,#366fca 50%,#c8dcff 100%)'},
    cloudHigh:{left:'keine hohen Wolken',right:'starke hohe Bewölkung',gradient:'linear-gradient(90deg,#170b28 0%,#8052b7 50%,#eadcff 100%)'}
  };
  return{...(definitions[layer]||definitions.cloud),suffix:'<span class="rain-legend">╱ Niederschlag</span>'};
}
function drawCloudMap(){
  const canvas=document.getElementById('cloudMapCanvas');
  if(!canvas||!cloudMapData)return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  const view=currentCloudMapView();
  const layer=profile.planning.cloudMapLayer||cloudMapSettings().defaultLayer;
  const mode=profile.planning.cloudMapMode||cloudMapSettings().defaultMode;
  const frameIndex=clamp(Number(profile.planning.cloudMapFrame)||0,0,cloudDisplayTimes().length-1);
  const rawPosition=cloudRawPosition(frameIndex);
  const frame=cloudFrameValues(view,layer,rawPosition);
  const drawValues=mode==='uncertainty'?frame.spread:frame.values;
  const precip=cloudFrameValues(view,'precip',rawPosition).values;
  const size=cloudMapData.gridSize;
  const map={x:88,y:54,w:W-176,h:H-126};
  ctx.clearRect(0,0,W,H);
  const background=ctx.createLinearGradient(0,0,0,H);
  background.addColorStop(0,'#071624');background.addColorStop(1,'#03101b');
  ctx.fillStyle=background;ctx.fillRect(0,0,W,H);
  ctx.save();
  ctx.beginPath();ctx.roundRect(map.x,map.y,map.w,map.h,18);ctx.clip();
  ctx.fillStyle='#071b2c';ctx.fillRect(map.x,map.y,map.w,map.h);

  // Die API-Punktzahl bleibt unverändert. Für die Darstellung wird ein feineres,
  // weich interpoliertes Hilfsraster berechnet und anschließend geglättet skaliert.
  const offscreen=document.createElement('canvas');
  offscreen.width=360;offscreen.height=Math.max(180,Math.round(360*map.h/map.w));
  const offCtx=offscreen.getContext('2d');
  for(let py=0;py<offscreen.height;py++){
    const gy=(py/Math.max(1,offscreen.height-1))*(size-1);
    for(let px=0;px<offscreen.width;px++){
      const gx=(px/Math.max(1,offscreen.width-1))*(size-1);
      const value=cloudMapInterpolated(drawValues,size,gx,gy);
      offCtx.fillStyle=cloudMapColor(value,layer,mode);
      offCtx.fillRect(px,py,1,1);
    }
  }
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(offscreen,map.x,map.y,map.w,map.h);

  // Niederschlag als zusätzliche blaue Schraffur.
  if(mode==='clouds'){
    ctx.globalAlpha=.72;
    for(let py=0;py<map.h;py+=14){
      const gy=(py/map.h)*(size-1);
      for(let px=0;px<map.w;px+=14){
        const gx=(px/map.w)*(size-1);
        const value=cloudMapInterpolated(precip,size,gx,gy);
        if(value>.15){
          ctx.strokeStyle=`rgba(55,170,255,${clamp(value/3,.15,.85)})`;
          ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(map.x+px,map.y+py);ctx.lineTo(map.x+px-7,map.y+py+11);ctx.stroke();
        }
      }
    }
    ctx.globalAlpha=1;
  }
  // Nur Distanzringe – keine sichtbaren Zellen- oder Punktgitter.
  ctx.strokeStyle='rgba(135,190,225,.23)';ctx.lineWidth=1.2;
  for(let i=1;i<4;i++){
    ctx.beginPath();ctx.ellipse(map.x+map.w/2,map.y+map.h/2,map.w*i/8,map.h*i/8,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle='rgba(95,190,240,.72)';ctx.lineWidth=2;ctx.strokeRect(map.x,map.y,map.w,map.h);

  const cx=map.x+map.w/2,cy=map.y+map.h/2;
  ctx.fillStyle='#ffd66b';ctx.strokeStyle='#06111b';ctx.lineWidth=5;
  ctx.beginPath();ctx.arc(cx,cy,10,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.strokeStyle='#ffd66b';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(cx-22,cy);ctx.lineTo(cx+22,cy);ctx.moveTo(cx,cy-22);ctx.lineTo(cx,cy+22);ctx.stroke();

  const movement=estimateCloudMovement(view,layer,frameIndex);
  if(movement?.reliable&&Number.isFinite(movement.azimuth)&&movement.distance>=1){
    const length=clamp(60+movement.distance*2,70,170);
    const angle=toRad(movement.azimuth);
    const dx=Math.sin(angle)*length,dy=-Math.cos(angle)*length;
    ctx.strokeStyle='#ffcf5b';ctx.fillStyle='#ffcf5b';ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+dx,cy+dy);ctx.stroke();
    const head=14,headAngle=Math.atan2(dy,dx);
    ctx.beginPath();ctx.moveTo(cx+dx,cy+dy);
    ctx.lineTo(cx+dx-head*Math.cos(headAngle-.55),cy+dy-head*Math.sin(headAngle-.55));
    ctx.lineTo(cx+dx-head*Math.cos(headAngle+.55),cy+dy-head*Math.sin(headAngle+.55));ctx.closePath();ctx.fill();
  }
  ctx.fillStyle='#dcecff';ctx.font='700 26px system-ui';ctx.textAlign='center';
  ctx.fillText('N',W/2,34);ctx.fillText('S',W/2,H-16);
  ctx.textAlign='left';ctx.fillText('W',30,H/2);ctx.textAlign='right';ctx.fillText('O',W-30,H/2);
  ctx.textAlign='left';ctx.font='600 20px system-ui';ctx.fillStyle='#b9d3e8';
  ctx.fillText(`${cloudMapData.locationName} · Radius ${cloudMapData.radiusKm} km`,map.x,map.y-16);
  ctx.textAlign='right';
  ctx.fillText(`${weatherViewLabel(view)} · ${CLOUD_MAP_LAYER_OPTIONS.find(item=>item[0]===layer)?.[1]||layer}`,map.x+map.w,map.y-16);
  ctx.textAlign='center';ctx.font='700 22px system-ui';ctx.fillStyle='#ffe08a';
  ctx.fillText(cloudMapData.locationName,cx,cy+44);

  // Die tatsächlichen Prognosepunkte bleiben als dezente Zahlen sichtbar.
  ctx.font='600 14px system-ui';
  cloudMapData.points.forEach((point,index)=>{
    const x=map.x+map.w*point.x/(size-1),y=map.y+map.h*point.y/(size-1);
    const value=drawValues[index];
    if(!Number.isFinite(value))return;
    ctx.fillStyle='rgba(3,12,20,.66)';ctx.beginPath();ctx.arc(x,y,15,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#eef8ff';ctx.fillText(String(Math.round(value)),x,y+5);
  });
  const legend=document.getElementById('cloudMapLegend');
  if(legend){
    const definition=cloudLegendDefinition(layer,mode);
    legend.innerHTML=`<span>${definition.left}</span><div class="legend-gradient dynamic" style="background:${definition.gradient}"></div><span>${definition.right}</span>${definition.suffix||''}`;
  }
}
function drawMiniCharts(){document.querySelectorAll('.mini-chart').forEach(canvas=>{const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;const points=JSON.parse(decodeURIComponent(canvas.dataset.points));const start=Number(canvas.dataset.start),end=Number(canvas.dataset.end),civilS=Number(canvas.dataset.civilStart),civilE=Number(canvas.dataset.civilEnd),astroS=Number(canvas.dataset.astroStart),astroE=Number(canvas.dataset.astroEnd),nautS=Number(canvas.dataset.nautStart),nautE=Number(canvas.dataset.nautEnd),minAlt=Number(canvas.dataset.minAlt);ctx.clearRect(0,0,w,h);const x=t=>(t-start)/(end-start)*w,y=a=>h-8-clamp(a,0,90)/90*(h-16);ctx.fillStyle='#3a3227';ctx.fillRect(0,0,w,h);const band=(s,e,fill)=>{const left=clamp(x(s),0,w),right=clamp(x(e),0,w);if(right<=left)return;ctx.fillStyle=fill;ctx.fillRect(left,0,right-left,h)};band(civilS,civilE,'#1b2a3d');band(nautS,nautE,'#142235');band(astroS,astroE,'#08121f');for(const t of [civilS,nautS,astroS,astroE,nautE,civilE]){ctx.beginPath();ctx.strokeStyle='#73849a';ctx.setLineDash([3,3]);ctx.moveTo(x(t),0);ctx.lineTo(x(t),h);ctx.stroke()}ctx.setLineDash([5,4]);ctx.strokeStyle='#d7ad47';ctx.beginPath();ctx.moveTo(0,y(minAlt));ctx.lineTo(w,y(minAlt));ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#7ec1ff';ctx.lineWidth=2;ctx.beginPath();points.forEach(([t,a],i)=>i?ctx.lineTo(x(t),y(a)):ctx.moveTo(x(t),y(a)));ctx.stroke();const max=points.reduce((m,p)=>p[1]>m[1]?p:m,points[0]);ctx.fillStyle='#f0c75e';ctx.beginPath();ctx.arc(x(max[0]),y(max[1]),3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#aabbd0';ctx.font='10px sans-serif';ctx.fillText('0°',2,h-2);ctx.fillText('90°',2,10)})}

function decodeCanvasData(value,fallback=[]){
  try{return JSON.parse(decodeURIComponent(value||''))}catch{return fallback}
}

function chartPalette(){
  return{
    background:'#07111d',grid:'#263a51',text:'#a9bdd2',accent:'#6fc9ff',accent2:'#4ad18b',
    selected:'rgba(121,184,255,.13)',civil:'#3a3227',nautical:'#1b2a3d',astronomical:'#142235',night:'#08121f',
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
    context.fillStyle=palette.civil;
    context.fillRect(margin.left,margin.top,plotW,plotH);
    const band=(bandStart,bandEnd,fill)=>{
      const left=clamp(x(Number(bandStart)),margin.left,margin.left+plotW);
      const right=clamp(x(Number(bandEnd)),margin.left,margin.left+plotW);
      if(right<=left)return;
      context.fillStyle=fill;
      context.fillRect(left,margin.top,right-left,plotH);
    };
    band(canvas.dataset.civilStart,canvas.dataset.civilEnd,palette.nautical);
    band(canvas.dataset.nautStart,canvas.dataset.nautEnd,palette.astronomical);
    band(canvas.dataset.astroStart,canvas.dataset.astroEnd,palette.night);
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
    const currentTime=clamp(Number(canvas.dataset.currentTime)||start,start,end);
    const currentPoint=nearestDetailPoint(points,currentTime);
    context.strokeStyle=palette.warning;
    context.lineWidth=2;
    context.setLineDash([5,4]);
    context.beginPath();context.moveTo(x(currentTime),margin.top);context.lineTo(x(currentTime),margin.top+plotH);context.stroke();
    context.setLineDash([]);
    context.fillStyle=palette.warning;
    context.beginPath();context.arc(x(currentTime),y(currentPoint[1]),7,0,Math.PI*2);context.fill();
    context.strokeStyle='#07111d';context.lineWidth=3;context.stroke();
    context.fillStyle='#fff2bd';context.textAlign=x(currentTime)>margin.left+plotW*.72?'right':'left';context.textBaseline='bottom';
    context.fillText(`${fmtTime(new Date(currentTime),canvas.dataset.timezone)} · ${fmt(currentPoint[1])}° · ${cardinal(currentPoint[2])}`,x(currentTime)+(x(currentTime)>margin.left+plotW*.72?-10:10),y(currentPoint[1])-10);
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
  const showGround=canvas.dataset.showGround!=='false';
  if(showGround&&horizon.length){
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
    if(canvas.dataset.editable==='true'){
      horizon.forEach((point,index)=>{
        if(index%3!==0&&index!==horizon.length-1)return;
        context.fillStyle='#07111d';context.strokeStyle=palette.accent2;context.lineWidth=2;
        context.beginPath();context.arc(x(point[0]),y(point[1]),5,0,Math.PI*2);context.fill();context.stroke();
      });
    }
  }
  if(showGround)obstacles.forEach(obstacle=>{
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
    const currentTime=clamp(Number(canvas.dataset.currentTime)||track[0][2],track[0][2],track[track.length-1][2]);
    const currentPoint=nearestDetailPoint(track.map(point=>[point[2],point[1],point[0]]),currentTime);
    const currentAzimuth=currentPoint[2],currentAltitude=currentPoint[1];
    context.strokeStyle='#d8ecff';context.lineWidth=2;
    context.beginPath();context.moveTo(x(currentAzimuth)-12,y(currentAltitude));context.lineTo(x(currentAzimuth)+12,y(currentAltitude));context.moveTo(x(currentAzimuth),y(currentAltitude)-12);context.lineTo(x(currentAzimuth),y(currentAltitude)+12);context.stroke();
    context.fillStyle=palette.warning;context.beginPath();context.arc(x(currentAzimuth),y(currentAltitude),7,0,Math.PI*2);context.fill();
    context.strokeStyle='#07111d';context.lineWidth=3;context.stroke();
    context.fillStyle='#fff2bd';context.textAlign=currentAzimuth>280?'right':'left';context.textBaseline='bottom';
    context.fillText(`${fmtTime(new Date(currentTime),canvas.dataset.timezone)} · ${fmt(currentAltitude)}° · ${cardinal(currentAzimuth)} (${fmt(currentAzimuth)}°)`,x(currentAzimuth)+(currentAzimuth>280?-12:12),y(currentAltitude)-12);
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

function syncSettingsHorizonCanvas(){const canvas=document.querySelector('.settings-horizon-chart');if(!canvas)return;const location=draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0],entry=horizonProfileFor(location,location.selectedHorizonProfileId),points=ensureHorizonProfile(location,entry?.id).map((altitude,index)=>[index*5,Number(altitude)||0]);canvas.dataset.horizon=encodeURIComponent(JSON.stringify(points));canvas.dataset.obstacles=encodeURIComponent(JSON.stringify((entry?.obstacles||[]).map(item=>({name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0}))));drawSettingsHorizonCharts()}

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


window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.data?.type!=='anp-aladin-ready')return;
  sendAladinOverlayUpdate();
});

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
