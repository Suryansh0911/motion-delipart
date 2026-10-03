import {notFound} from 'next/navigation';
import {AreaDetail} from '@/components/partner/area-detail';
import {AREAS} from '@/components/partner/model';
export function generateStaticParams(){return AREAS.map(a=>({cityId:'pune',areaId:a.id}));}
export default async function Page({params}:{params:Promise<{cityId:string;areaId:string}>}){const {cityId,areaId}=await params;const area=AREAS.find(a=>a.id===areaId);if(cityId!=='pune'||!area)notFound();return <AreaDetail area={area}/>;}
