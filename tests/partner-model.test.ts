import test from 'node:test';
import assert from 'node:assert/strict';
import {AREAS,PHASES,aggregateAreas,applyRates,currentRevenue,decodeData,deliveryEstimate,exportAreaCsv,freshData,rateProjection,validateRates} from '../components/partner/model.ts';
test('city aggregates are sums and earnings per delivery is weighted by delivery volume',()=>{
 const city=aggregateAreas(AREAS);assert.equal(city.boxes,20);assert.equal(city.restaurants,205);assert.equal(city.revenue,74000);assert.equal(city.deliveries,10200);assert.equal(city.perDelivery,74000/10200);assert.equal(city.revenues[5],city.revenue);assert.ok(Math.abs(city.averageMonthly-18.9)<1e-10);
 const unweighted=AREAS.reduce((s,a)=>s+deliveryEstimate(currentRevenue(a),a.boxes).perDelivery,0)/AREAS.length;assert.notEqual(city.perDelivery,unweighted);
});
test('the three diagram windows total 12 hours, not 24',()=>{assert.equal(PHASES.reduce((s,p)=>s+p.hours,0),12);assert.deepEqual(rateProjection({morning:18,afternoon:22,night:28},8),{perBoxDay:278,fleetDay:2224,fleetMonth:66720});});
test('delivery estimate handles an empty fleet',()=>{assert.deepEqual(deliveryEstimate(0,0),{deliveries:0,perDelivery:0});});
test('fees reject blank, negative, infinite, over-limit and over-precision values',()=>{
 for(const bad of ['', ' ', '-1', 'Infinity', '10001', '1.001','1e2'])assert.ok(validateRates({morning:bad,afternoon:'22',night:'28'}).errors.morning,bad);
 assert.deepEqual(validateRates({morning:'0',afternoon:'22.50',night:'10000'}).values,{morning:0,afternoon:22.5,night:10000});
});
test('fee changes persist independently per area without changing historical earnings',()=>{
 const data=freshData(), revenues=structuredClone(AREAS.map(a=>a.revenues));const next=applyRates(data,'baner',{morning:20,afternoon:24,night:30},'2026-10-03T10:00:00Z','test');
 assert.equal(data.rates.baner.morning,18);assert.equal(next.rates.baner.morning,20);assert.deepEqual(next.rates['koregaon-park'],data.rates['koregaon-park']);assert.deepEqual(AREAS.map(a=>a.revenues),revenues);assert.deepEqual(decodeData(JSON.stringify(next)),next);assert.equal(next.changes[0].previous.morning,18);
 assert.equal(applyRates(next,'baner',next.rates.baner,'2026-10-03T11:00:00Z','duplicate'),next);
});
test('corrupt saved data and unknown areas are rejected',()=>{
 assert.throws(()=>decodeData('invalid'));assert.throws(()=>decodeData('{"version":1}'));const d=freshData();d.rates.baner.morning=-1;assert.throws(()=>decodeData(JSON.stringify(d)));assert.throws(()=>applyRates(freshData(),'unknown',{morning:1,afternoon:1,night:1},new Date().toISOString(),'x'));
});
test('CSV identifies sample data, correct units and saved fees',()=>{
 const csv=exportAreaCsv(AREAS[0],{morning:30,afternoon:40,night:50});assert.ok(csv.includes('SIMULATED DATA'));assert.ok(csv.includes('Fee INR per box-hour'));assert.ok(csv.includes('"Morning","4","30"'));assert.ok(csv.includes('17 deliveries per box per day; 30 days'));
});
