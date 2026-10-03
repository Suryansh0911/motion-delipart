'use client';
import {createContext,useCallback,useContext,useEffect,useState} from 'react';
import {applyRates,decodeData,freshData,type PartnerData,type Rates} from './model';
const STORAGE_KEY='motion-delivery-partner-v1';
type Store={data:PartnerData;ready:boolean;storageError:string|null;save:(areaId:string,rates:Rates)=>Promise<void>};
const Context=createContext<Store|null>(null);
export function PartnerProvider({children}:{children:React.ReactNode}) {
  const [data,setData]=useState(freshData),[ready,setReady]=useState(false),[storageError,setStorageError]=useState<string|null>(null);
  useEffect(()=>{
    // Hydrate browser-only storage after the first render so server and client
    // start with identical demo data. The single hydration render is intentional.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {const raw=localStorage.getItem(STORAGE_KEY);if(raw)setData(decodeData(raw));}
    catch {setStorageError('Saved fees could not be loaded. Default demo fees are shown; saving is disabled to protect existing data.');}
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const receive=(event:StorageEvent)=>{if(event.key!==STORAGE_KEY)return;try{setData(event.newValue?decodeData(event.newValue):freshData());setStorageError(null);}catch{setStorageError('Fees changed in another tab but could not be read. Refresh before editing.');}};
    window.addEventListener('storage',receive);return()=>window.removeEventListener('storage',receive);
  },[]);
  const save=useCallback(async(areaId:string,rates:Rates)=>{
    if(!ready||storageError)throw new Error('Browser storage is unavailable. Your fees were not saved.');
    try {
      // Merge against the latest browser copy, retaining changes made by another tab.
      const raw=localStorage.getItem(STORAGE_KEY);const latest=raw?decodeData(raw):data;
      const bytes=crypto.getRandomValues(new Uint8Array(8));const id=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
      const next=applyRates(latest,areaId,rates,new Date().toISOString(),id);
      localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setData(next);
    } catch {throw new Error('Could not save fees. Browser storage may be full or blocked. Your previous fees are unchanged.');}
  },[data,ready,storageError]);
  return <Context.Provider value={{data,ready,storageError,save}}>{children}</Context.Provider>;
}
export function usePartner(){const ctx=useContext(Context);if(!ctx)throw Error('PartnerProvider is required');return ctx;}
