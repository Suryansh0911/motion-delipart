'use client';
import {useState} from 'react';
import {BarChart3,Table2} from 'lucide-react';
import {inr,MONTHS} from './model';
export function RevenueChart({values,title='Advertising revenue'}:{values:number[];title?:string}) {
 const [table,setTable]=useState(false),[active,setActive]=useState(5);
 const ceiling=Math.max(1000,Math.ceil(Math.max(...values)/10000)*10000);
 return <section className="dp-panel dp-chart-panel"><div className="dp-panel-head"><div><h2>{title}</h2><p>Monthly revenue · May–October 2026</p></div><button className="dp-icon-button" title={table?'Show chart':'Show data table'} aria-label={table?'Show revenue chart':'Show revenue data table'} onClick={()=>setTable(!table)}>{table?<BarChart3 size={18}/>:<Table2 size={18}/>}</button></div>
 <div className="dp-chart-total"><strong>{inr(values[active])}</strong><span>{MONTHS[active]} 2026 <i/> Simulated revenue</span></div>
 {table?<div className="dp-table-scroll"><table className="dp-table"><caption className="sr-only">Monthly advertising revenue</caption><thead><tr><th>Month</th><th>Revenue</th></tr></thead><tbody>{MONTHS.map((m,i)=><tr key={m}><td>{m} 2026</td><td>{inr(values[i])}</td></tr>)}</tbody></table></div>:<div className="dp-chart" aria-label={title}><div className="dp-chart-axis">{[1,.75,.5,.25,0].map(n=><span key={n}>{n?`₹${Math.round(ceiling*n/1000)}k`:'₹0'}</span>)}</div><div className="dp-chart-plot"><div className="dp-chart-grid">{[0,1,2,3,4].map(i=><i key={i}/>)}</div><div className="dp-bars">{MONTHS.map((m,i)=><button key={m} className={'dp-bar-slot '+(active===i?'is-active':'')} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} aria-label={`${m} 2026 revenue ${inr(values[i])}`} aria-pressed={active===i}><span className="dp-bar" style={{height:`${values[i]/ceiling*100}%`}}/><span className="dp-bar-label">{m}</span></button>)}</div></div></div>}
 <p className="dp-chart-note">Revenue shown is partner ad income, before partner expenses. It is not profit.</p></section>;
}
