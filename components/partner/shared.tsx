'use client';
import {Info,type LucideIcon} from 'lucide-react';
import {useState} from 'react';
import {inr,number,DELIVERY_ASSUMPTIONS} from './model';
export function Metric({label,value,note,icon:Icon,accent=false}:{label:string;value:string;note:string;icon:LucideIcon;accent?:boolean}) {
 return <div className={'dp-metric '+(accent?'dp-metric-accent':'')}><div className="dp-metric-label"><span>{label}</span><Icon size={17}/></div><strong>{value}</strong><p>{note}</p></div>;
}
export function DeliveryCalculation({revenue,boxes,compact=false}:{revenue:number;boxes:number;compact?:boolean}) {
 const [expanded,setExpanded]=useState(!compact);const count=boxes*DELIVERY_ASSUMPTIONS.deliveriesPerBoxPerDay*DELIVERY_ASSUMPTIONS.days;
 return <section className="dp-calculation"><button className="dp-calculation-toggle" aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}><Info size={16}/><b>How the delivery estimate works</b><span>{expanded?'−':'+'}</span></button>{expanded&&<div className="dp-calculation-content"><p><b>{number(boxes)} boxes × 17 deliveries/day × 30 days</b><span>= {number(count)} estimated deliveries</span></p><p><b>{inr(revenue)} ÷ {number(count)} deliveries</b><span>= {inr(count?revenue/count:0,2)} per delivery</span></p><small>A 30-day scenario from your diagram, not actual delivery counts or a guaranteed rider payout. Box averages are reported separately. All figures are simulated.</small></div>}</section>;
}
export function downloadCsv(name:string,csv:string) {
 const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}));
 const link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
