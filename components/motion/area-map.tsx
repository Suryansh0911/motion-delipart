'use client';
import {useState} from 'react';
import {Plus,Minus,LocateFixed,Layers,MapPin,Download,Box,UtensilsCrossed} from 'lucide-react';
import {Checkbox} from '@/components/ui/checkbox';
import {Switch} from '@/components/ui/switch';
import {areas,num,money} from './model';
export default function AreaMap({selected=[],onSelect,compact=false}:{selected?:string[];onSelect?:(ids:string[])=>void;compact?:boolean}){
 const [zoom,setZoom]=useState(1),[focus,setFocus]=useState<string|null>(null),[layers,setLayers]=useState(false),[grid,setGrid]=useState(true),[fleet,setFleet]=useState(true),[traffic,setTraffic]=useState(false),[restaurants,setRestaurants]=useState(false);
 const active=areas.find(a=>a.id===focus), chosen=areas.filter(a=>selected.includes(a.id));
 const toggle=(id:string)=>{setFocus(id);onSelect?.(selected.includes(id)?selected.filter(v=>v!==id):[...selected,id]);};
 const exportAreas=()=>{const blob=new Blob([JSON.stringify({mode:'simulated',city:'Pune',areas:chosen},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='motion-selected-areas.json';a.click();URL.revokeObjectURL(url);};
 return <div className={'map-shell '+(compact?'map-compact':'')}>
 <div className="map-heading"><span><MapPin size={15}/> Pune, Maharashtra</span><span className="tiny">Illustrative map</span></div>
 <div className="map-canvas"><svg viewBox={`${450-450/zoom} ${250-250/zoom} ${900/zoom} ${500/zoom}`} aria-label="Illustrative Pune area map with simulated data" role="img">
 <defs><pattern id="streets" width="58" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(-17)"><rect width="58" height="52" fill="#edf0e9"/><path d="M0 0H58V52H0Z" stroke="#fff" strokeWidth="5" fill="none"/><path d="M0 26H58M29 0V52" stroke="#e1e5dd" strokeWidth="2" fill="none"/></pattern></defs>
 <rect width="900" height="500" fill="url(#streets)"/>
 <path d="M-20 280C90 200 145 270 250 200S410 290 520 210S680 190 950 245" stroke="#b7d9e7" strokeWidth="32" fill="none"/>
 <path d="M50 0L280 470M340 -20L400 150L590 510M840 -20L470 510M-20 330L940 90M-20 470L910 345" stroke="#d7dccf" strokeWidth="13" fill="none"/>
 <path d="M50 0L280 470M340 -20L400 150L590 510M840 -20L470 510M-20 330L940 90M-20 470L910 345" stroke="#fffefa" strokeWidth="8" fill="none"/>
 <text x="395" y="223" fontSize="12" fill="#4e8196" transform="rotate(8 395 223)">Mula–Mutha</text>
 {areas.map((a,i)=><g key={a.id} role={onSelect?'button':undefined} tabIndex={onSelect?0:undefined} aria-label={`${a.name}${selected.includes(a.id)?', selected':''}`} aria-pressed={onSelect?selected.includes(a.id):undefined} onClick={()=>toggle(a.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(a.id);}}} onMouseEnter={()=>setFocus(a.id)} className={onSelect?'map-area':''}>
 <rect x={a.x-69} y={a.y-51} width="138" height="105" rx="3" fill={selected.includes(a.id)?'#ed72343b':traffic?(i%3===0?'#eb5c3040':'#ecc35c28'):'#ffffff10'} stroke={selected.includes(a.id)?'#e87132':grid?'#94a7ac':'transparent'} strokeWidth={selected.includes(a.id)?2.5:1} strokeDasharray={selected.includes(a.id)?'0':'4 4'}/>
 <text x={a.x} y={a.y} textAnchor="middle" fill="#38505b" fontSize="14" fontWeight="600" style={{pointerEvents:'none'}}>{a.name}</text>
 {selected.includes(a.id)&&<text x={a.x+53} y={a.y-32} fill="#c34e15" fontSize="18" style={{pointerEvents:'none'}}>✓</text>}
 {fleet&&<g style={{pointerEvents:'none'}} className={'fleet-marker marker-'+i}><rect x={a.x-37} y={a.y+18} width="18" height="18" rx="5" fill={i%3===0?'#e7783f':i%3===1?'#4262a1':'#378472'}/><path d={`M${a.x-32} ${a.y+24}h8v6h-8z`} fill="none" stroke="white"/><circle cx={a.x-32} cy={a.y+32} r="1.2" fill="white"/><circle cx={a.x-24} cy={a.y+32} r="1.2" fill="white"/></g>}
 {restaurants&&<circle cx={a.x+40} cy={a.y+28} r="5" fill="#b46080"/>}
 </g>)}
 <text x="680" y="475" fontSize="11" fill="#75878b">SCHEMATIC · NOT FOR NAVIGATION</text>
 </svg></div>
 <div className="map-tools"><button aria-label="Zoom in" disabled={zoom>=1.8} onClick={()=>setZoom(Math.min(1.8,zoom+.2))}><Plus size={17}/></button><button aria-label="Zoom out" disabled={zoom<=.8} onClick={()=>setZoom(Math.max(.8,zoom-.2))}><Minus size={17}/></button><button aria-label="Reset map view" onClick={()=>setZoom(1)}><LocateFixed size={17}/></button></div>
 <button className="layer-toggle" onClick={()=>setLayers(!layers)} aria-expanded={layers}><Layers size={16}/> Layers</button>
 {layers&&<div className="map-layers">{[['Area grid',grid,setGrid],['Simulated fleet',fleet,setFleet],['Traffic estimate',traffic,setTraffic],['Sample restaurants',restaurants,setRestaurants]].map(([label,val,fn])=><label key={String(label)}>{String(label)}<Switch checked={Boolean(val)} onCheckedChange={fn as (v:boolean)=>void}/></label>)}</div>}
 {active&&!compact&&<div className="map-info"><b>{active.name}</b><span><Box size={14}/> {active.boxes} boxes · {num(active.views)} est. daily impressions</span><span>Median income assumption {money(active.income)}/month</span><small>Simulated estimates, not measured audiences</small></div>}
 <div className="map-legend"><span><i style={{background:'#e7783f'}}/>Fleet A</span><span><i style={{background:'#4262a1'}}/>Fleet B</span><span><i style={{background:'#378472'}}/>Fleet C</span><span className="tiny">Simulated positions</span></div>
 {onSelect&&<div className="area-selector"><div className="row-between"><b>{selected.length} areas selected</b><button className="text-button" disabled={!selected.length} onClick={()=>onSelect([])}>Clear selection</button></div><div className="area-options">{areas.map(a=><label key={a.id}><Checkbox checked={selected.includes(a.id)} onCheckedChange={()=>toggle(a.id)}/>{a.name}</label>)}</div><div className="selection-totals"><span><b>{chosen.reduce((s,a)=>s+a.boxes,0)}</b> sample available boxes</span><span><b>{num(chosen.reduce((s,a)=>s+a.views,0))}</b> gross est. impressions/day</span><button className="text-button" disabled={!selected.length} onClick={exportAreas}><Download size={15}/> Export areas</button></div><p className="tiny">Area estimates may count the same person more than once. Income remains per-area because a combined median needs source data.</p></div>}
 </div>
}
