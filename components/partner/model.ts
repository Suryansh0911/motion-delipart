export const DEMO_MONTH = 'October 2026';
export const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
export const DELIVERY_ASSUMPTIONS = { deliveriesPerBoxPerDay: 17, days: 30 } as const;
export const PHASES = [
  { id: 'morning', name: 'Morning', time: '08:00–12:00', hours: 4 },
  { id: 'afternoon', name: 'Afternoon', time: '12:00–15:00', hours: 3 },
  { id: 'night', name: 'Night', time: '18:00–23:00', hours: 5 },
] as const;
export type PhaseId = typeof PHASES[number]['id'];
export type Rates = Record<PhaseId, number>;
export type RateDraft = Record<PhaseId, string>;
export type Area = {
  id: string; name: string; description: string; restaurants: number; boxes: number;
  averageWeekly: number; averageMonthly: number; revenues: number[]; rates: Rates;
};
export const AREAS: Area[] = [
  { id: 'baner', name: 'Baner', description: 'Neighbourhood cafés & residential streets', restaurants: 68, boxes: 8, averageWeekly: 7.8, averageMonthly: 7.5, revenues: [14200,16600,18400,22600,25100,24360], rates: { morning: 18, afternoon: 22, night: 28 } },
  { id: 'koregaon-park', name: 'Koregaon Park', description: 'Dining destinations & evening footfall', restaurants: 83, boxes: 7, averageWeekly: 6.8, averageMonthly: 6.6, revenues: [17900,21300,24600,27700,29800,30660], rates: { morning: 22, afternoon: 28, night: 35 } },
  { id: 'viman-nagar', name: 'Viman Nagar', description: 'Office clusters & high-street restaurants', restaurants: 54, boxes: 5, averageWeekly: 4.9, averageMonthly: 4.8, revenues: [9600,11200,13400,15800,18600,18980], rates: { morning: 16, afternoon: 20, night: 26 } },
];
export const CITY = { id: 'pune', name: 'Pune', state: 'Maharashtra', region: 'West India' };
export type RateChange = { id: string; areaId: string; savedAt: string; previous: Rates; next: Rates };
export type PartnerData = { version: 1; rates: Record<string, Rates>; changes: RateChange[] };
export const freshData = (): PartnerData => ({ version: 1, rates: Object.fromEntries(AREAS.map(a => [a.id, { ...a.rates }])), changes: [] });
export const inr = (n: number, digits = 0) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
export const number = (n: number, digits = 0) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(n);
export const currentRevenue = (a: Area) => a.revenues[a.revenues.length - 1] ?? 0;
export function deliveryEstimate(revenue: number, boxes: number) {
  const deliveries = boxes * DELIVERY_ASSUMPTIONS.deliveriesPerBoxPerDay * DELIVERY_ASSUMPTIONS.days;
  return { deliveries, perDelivery: deliveries > 0 ? revenue / deliveries : 0 };
}
export function aggregateAreas(areas: Area[]) {
  const boxes = areas.reduce((sum,a) => sum + a.boxes, 0);
  const revenue = areas.reduce((sum,a) => sum + currentRevenue(a), 0);
  return { boxes, revenue, restaurants: areas.reduce((s,a) => s+a.restaurants,0),
    averageWeekly: areas.reduce((s,a) => s+a.averageWeekly,0), averageMonthly: areas.reduce((s,a) => s+a.averageMonthly,0),
    revenues: MONTHS.map((_,i) => areas.reduce((s,a) => s+(a.revenues[i]??0),0)), ...deliveryEstimate(revenue,boxes) };
}
export function rateProjection(rates: Rates, boxes: number) {
  const perBoxDay = PHASES.reduce((sum,p) => sum + p.hours * rates[p.id], 0);
  return { perBoxDay, fleetDay: perBoxDay * boxes, fleetMonth: perBoxDay * boxes * DELIVERY_ASSUMPTIONS.days };
}
export function validateRates(draft: RateDraft): { values?: Rates; errors: Partial<Record<PhaseId,string>> } {
  const errors: Partial<Record<PhaseId,string>> = {};
  const values = {} as Rates;
  for (const phase of PHASES) {
    const raw = draft[phase.id].trim(); const value = Number(raw);
    if (!raw || !/^\d+(\.\d{1,2})?$/.test(raw) || !Number.isFinite(value) || value < 0 || value > 10000)
      errors[phase.id] = 'Enter a rate from ₹0 to ₹10,000, with up to 2 decimals.';
    else values[phase.id] = value;
  }
  return Object.keys(errors).length ? { errors } : { values, errors };
}
function validRates(value: unknown): value is Rates {
  if (!value || typeof value !== 'object') return false;
  return PHASES.every(p => { const n=(value as Rates)[p.id]; return typeof n==='number' && Number.isFinite(n) && n>=0 && n<=10000 && Math.abs(n*100-Math.round(n*100))<.000001; });
}
export function decodeData(raw: string): PartnerData {
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== 'object') throw new Error('Invalid saved data');
  const d=data as PartnerData;
  if (d.version!==1 || !d.rates || !AREAS.every(a=>validRates(d.rates[a.id])) || !Array.isArray(d.changes) || d.changes.some(c=>!c || typeof c.id!=='string' || !AREAS.some(a=>a.id===c.areaId) || !Number.isFinite(Date.parse(c.savedAt)) || !validRates(c.previous) || !validRates(c.next))) throw new Error('Invalid saved data');
  return { version: 1, rates: Object.fromEntries(AREAS.map(a=>[a.id,d.rates[a.id]])), changes: d.changes.slice(0,100) };
}
export function applyRates(data: PartnerData, areaId: string, rates: Rates, savedAt: string, id: string): PartnerData {
  if (!AREAS.some(a=>a.id===areaId) || !validRates(rates)) throw new Error('Invalid area or rates');
  if (PHASES.every(p=>data.rates[areaId][p.id]===rates[p.id])) return data;
  return { version: 1, rates: {...data.rates,[areaId]: {...rates}}, changes: [{id,areaId,savedAt,previous:{...data.rates[areaId]},next:{...rates}},...data.changes].slice(0,100) };
}
export function csvCell(value: string | number) {
  const s=String(value); return '"'+s.replace(/"/g,'""')+'"';
}
export function exportAreaCsv(area: Area, rates: Rates) {
  const estimate=deliveryEstimate(currentRevenue(area),area.boxes);
  const rows: (string|number)[][] = [
    ['Motion delivery partner report','SIMULATED DATA'],['Period',DEMO_MONTH],['City',CITY.name],['Area',area.name],
    ['Restaurants',area.restaurants],['Current boxes',area.boxes],['Average boxes (monthly)',area.averageMonthly],
    ['Ad revenue INR',currentRevenue(area)],['Model deliveries',estimate.deliveries],['Estimated INR per delivery',estimate.perDelivery.toFixed(2)],
    ['Assumptions','17 deliveries per box per day; 30 days; not measured delivery earnings'],[],
    ['Phase','Hours per day','Fee INR per box-hour'],...PHASES.map(p=>[p.name,p.hours,rates[p.id]]),[],
    ['Month 2026','Simulated revenue INR'],...MONTHS.map((m,i)=>[m,area.revenues[i]])
  ];
  return rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
}
