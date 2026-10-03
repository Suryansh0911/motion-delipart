import type {Metadata} from 'next';
import {PartnerShell} from '@/components/partner/shell';
import './partner.css';
export const metadata:Metadata={title:{default:'Delivery partner | Motion',template:'%s | Motion Partner'},description:'Delivery partner dashboard for city performance, area economics and day-phase pricing.'};
export default function Layout({children}:{children:React.ReactNode}) {return <PartnerShell>{children}</PartnerShell>;}
