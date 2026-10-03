'use client';
import Link from 'next/link';
import {MapPin,ArrowUpRight} from 'lucide-react';
import {AREAS} from './model';
export function CoverageMap({selected}:{selected?:string}) {
 return <div className="dp-map"><div className="dp-map-head"><span><MapPin size={14}/> Pune coverage</span><small>Illustrative map</small></div><div className="dp-map-drawing"><svg viewBox="0 0 720 340" role="img" aria-label="Schematic Pune coverage for Baner, Koregaon Park and Viman Nagar"><defs><pattern id="dp-streets" width="45" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><rect width="45" height="40" fill="#edf0e8"/><path d="M0 0H45V40H0Z" stroke="#fff" strokeWidth="3" fill="none"/><path d="M22 0V40M0 20H45" stroke="#dfe5dc" fill="none"/></pattern></defs><rect width="720" height="340" fill="url(#dp-streets)"/><path d="M-20 250Q170 120 300 218T740 185" fill="none" stroke="#bcdbe3" strokeWidth="22"/><path d="M-20 85L740 285M115 -10L330 360M480 -10L465 360M-10 305L740 32" stroke="#fffefb" strokeWidth="10" fill="none"/><text x="313" y="213" fontSize="12" fill="#648b9b">Mula–Mutha</text><text x="296" y="305" fontSize="12" fill="#809085" letterSpacing="3">PUNE</text></svg>
 {AREAS.map((a,i)=><Link key={a.id} href={`/partner/cities/pune/areas/${a.id}`} className={'dp-map-pin pin-'+i+(selected===a.id?' selected':'')} aria-label={`Open ${a.name} area`}><span className="dp-pin-dot"/><b>{a.name}</b><small>{a.boxes} boxes<ArrowUpRight size={12}/></small></Link>)}
 </div><div className="dp-map-footer"><span><i/>3 demo areas</span><small>Schematic · not GPS data</small></div></div>;
}
