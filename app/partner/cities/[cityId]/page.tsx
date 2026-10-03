import {notFound} from 'next/navigation';
import {CityOverview} from '@/components/partner/city-overview';
export function generateStaticParams(){return [{cityId:'pune'}];}
export default async function Page({params}:{params:Promise<{cityId:string}>}){const {cityId}=await params;if(cityId!=='pune')notFound();return <CityOverview/>;}
