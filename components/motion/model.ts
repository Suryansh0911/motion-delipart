export type Creative = {id:string;name:string;type:string;src?:string;tone?:string;headline?:string;brand?:string;size:number;created:string};
export type Campaign = {id:string;name:string;status:'Running'|'Completed'|'Scheduled';creativeId:string;areas:string[];partners:string[];boxes:number;start:string;end:string;hours:number;impressions:number;cost:number;created:string};
export type Draft = {name:string;creativeId:string;areas:string[];partners:string[];boxes:number;start:string;end:string};
export const partners=['Fleet A','Fleet B','Fleet C'];
export const areas=[
{id:'baner',name:'Baner',x:155,y:104,boxes:8,views:850,income:75000},
{id:'aundh',name:'Aundh',x:305,y:104,boxes:6,views:720,income:70000},
{id:'shivajinagar',name:'Shivajinagar',x:305,y:234,boxes:10,views:1100,income:58000},
{id:'viman-nagar',name:'Viman Nagar',x:605,y:104,boxes:7,views:890,income:74000},
{id:'koregaon-park',name:'Koregaon Park',x:605,y:234,boxes:9,views:1050,income:85000},
{id:'kalyani-nagar',name:'Kalyani Nagar',x:755,y:234,boxes:6,views:780,income:80000},
{id:'kothrud',name:'Kothrud',x:155,y:364,boxes:8,views:920,income:67000},
{id:'deccan',name:'Deccan',x:305,y:364,boxes:11,views:1150,income:62000},
{id:'camp',name:'Camp',x:455,y:364,boxes:8,views:980,income:57000},
{id:'hadapsar',name:'Hadapsar',x:755,y:364,boxes:12,views:1250,income:56000},
];
export const seedCreatives:Creative[]=[
{id:'c1',name:'Everyday, better.',type:'Sample',tone:'orange',headline:'Everyday,\nbetter.',brand:'DAILY GOODS',size:0,created:'2026-09-18'},
{id:'c2',name:'A fresh perspective',type:'Sample',tone:'blue',headline:'A fresh\nperspective.',brand:'NORTH STUDIO',size:0,created:'2026-09-20'},
{id:'c3',name:'The city is yours',type:'Sample',tone:'green',headline:'The city\nis yours.',brand:'COMMON GROUND',size:0,created:'2026-09-21'},
];
export const seedCampaigns:Campaign[]=[
{id:'MP-1003',name:'Everyday essentials · Pune',status:'Running',creativeId:'c1',areas:['baner','aundh','shivajinagar'],partners:['Fleet A','Fleet B'],boxes:12,start:'2026-09-20T09:00',end:'2026-09-30T21:00',hours:192,impressions:38400,cost:5280,created:'2026-09-19'},
{id:'MP-1002',name:'North Studio · New season',status:'Running',creativeId:'c2',areas:['koregaon-park','kalyani-nagar'],partners:['Fleet C'],boxes:8,start:'2026-09-22T10:00',end:'2026-09-29T20:00',hours:112,impressions:24640,cost:3080,created:'2026-09-20'},
{id:'MP-1001',name:'Common Ground · City launch',status:'Completed',creativeId:'c3',areas:['deccan','kothrud','camp'],partners:['Fleet A'],boxes:10,start:'2026-09-10T10:00',end:'2026-09-17T18:00',hours:420,impressions:88200,cost:11550,created:'2026-09-09'},
];
export const blankDraft=():Draft=>({name:'',creativeId:'',areas:[],partners:[],boxes:5,start:'',end:''});
export const money=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
export const num=(n:number)=>new Intl.NumberFormat('en-IN').format(Math.round(n));
export const date=(s:string)=>new Date(s).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
export const total=(d:Draft)=>{
 const hours=Math.max(0,(new Date(d.end).getTime()-new Date(d.start).getTime())/3600000)||0;
 const base=Math.round(hours*d.boxes*25),fee=Math.round(base*.1),tax=Math.round((base+fee)*.18);
 return {hours,base,fee,tax,total:base+fee+tax,impressions:Math.round(hours*d.boxes*200)};
};
export function validate(d:Draft,creatives:Creative[],checkPast=true){
 if(!d.name.trim())return 'Give your campaign a name.';
 if(!creatives.some(c=>c.id===d.creativeId))return 'Choose a creative from your library.';
 if(!d.areas.length)return 'Select at least one area on the map.';
 if(!d.partners.length)return 'Select at least one delivery partner.';
 if(!Number.isInteger(d.boxes)||d.boxes<1||d.boxes>20)return 'Choose between 1 and 20 advert boxes.';
 if(!d.start||!d.end||!Number.isFinite(new Date(d.start).getTime())||!Number.isFinite(new Date(d.end).getTime())||new Date(d.end)<=new Date(d.start))return 'Choose an end time after your start time.';
 if(checkPast&&new Date(d.start).getTime()<Date.now()-60000)return 'Choose a start time in the future.';
 if(total(d).hours>24*30)return 'Demo campaigns can run for up to 30 days.';
 return '';
}
// All repository methods are device-local demo adapters. Replace this boundary with HTTP calls for backend integration.
const DB='motion-demo-v1';
async function database():Promise<IDBDatabase>{return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
export async function readState<T>(key:string,fallback:T):Promise<T>{const db=await database();return new Promise((res,rej)=>{const tx=db.transaction('state','readonly');const r=tx.objectStore('state').get(key);r.onsuccess=()=>res(r.result??fallback);r.onerror=()=>rej(r.error);tx.oncomplete=()=>db.close();});}
export async function writeState(key:string,value:unknown){const db=await database();return new Promise<void>((res,rej)=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put(value,key);tx.oncomplete=()=>{db.close();res();};tx.onerror=()=>{db.close();rej(tx.error);};});}

// getRandomValues also works on plain HTTP laptop previews.
export const createId=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,"0")).join("");
