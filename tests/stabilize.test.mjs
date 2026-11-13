import test from 'node:test';import assert from 'node:assert/strict';
import {stabilizeCollisionElevation as stabilize} from '../stabilize.mjs';
function fixture({elevation=4,actual=(4+0.35)-0.35}={}) {
 const from={x:0,y:0,elevation,level:'a',width:1,height:1,depth:1,shape:4,action:'walk'};
 const to={...from,x:140,explicit:true,checkpoint:true,intermediate:false};
 const hit={...from,x:69,elevation:actual,explicit:false,checkpoint:false,intermediate:false};
 return {input:[from,to],result:[[from,hit],true]};
}
test('corrige le résidu (4 + 0,35) - 0,35 sans muter les entrées ni le résultat original',()=>{
 const f=fixture();const call={args:[f.input,{}],result:f.result};
 assert.equal(call.result[0].at(-1).elevation,3.9999999999999996);
 const before=JSON.stringify(call),next=stabilize(call.args[0],call.result,call.args[1]);
 assert.equal(next[0].at(-1).elevation,4);assert.equal(JSON.stringify(call),before);
 assert.equal(next[0].at(-1).x,call.result[0].at(-1).x);assert.equal(next[0].at(-1).y,call.result[0].at(-1).y);
});
test('trajet sans dérive ou sans contrainte : même objet et aucune copie',()=>{
 for(const constrained of [true,false]){const f=fixture({actual:4});f.result[1]=constrained;assert.equal(stabilize(f.input,f.result),f.result);}
});
test('conserve une variation verticale volontaire, même infime',()=>{
 for(const target of [4+Number.EPSILON*4,4.2,5,0,-3]){const f=fixture({actual:4-Number.EPSILON*2});f.input[1].elevation=target;assert.equal(stabilize(f.input,f.result),f.result);}
});
test('ne ramène ni une vraie altitude ni une dérive importante au plancher',()=>{
 for(const actual of [4.2,3.9,3,0,-4]){const f=fixture({actual});assert.equal(stabilize(f.input,f.result),f.result);}
 const f=fixture({elevation:4.5,actual:4.5-Number.EPSILON*4});assert.equal(stabilize(f.input,f.result)[0][1].elevation,4.5);
});
test('ignore téléportation/contournement, changement de niveau et redimensionnement',()=>{
 const f=fixture();assert.equal(stabilize(f.input,f.result,{ignoreWalls:true}),f.result);
 for(const key of ['level','width','height','depth','shape']){const f=fixture();f.input[1][key]=key==='level'?'b':2;assert.equal(stabilize(f.input,f.result),f.result);}
});
test('ne modifie pas un point demandé explicitement ni un autre type de résultat',()=>{
 for(const key of ['explicit','checkpoint','intermediate']){const f=fixture();f.result[0][1][key]=true;assert.equal(stabilize(f.input,f.result),f.result);}
 const f=fixture();f.result[0][1].x=f.input[1].x;assert.equal(stabilize(f.input,f.result),f.result);
 for(const r of [null,{},Promise.resolve([]),[[],true]])assert.equal(stabilize(f.input,r),r);
});
test('garde les coordonnées, le terrain et les références inchangées hors altitude',()=>{
 const f=fixture();const terrain={cost:2};f.result[0][1].terrain=terrain;const next=stabilize(f.input,f.result);
 assert.equal(next[0][0],f.result[0][0]);assert.equal(next[0][1].terrain,terrain);
 assert.deepEqual({...next[0][1],elevation:0},{...f.result[0][1],elevation:0});
});
test('fonctionne avec les valeurs héritées et les altitudes négatives',()=>{
 const f=fixture({elevation:-3,actual:-3-Number.EPSILON*2});delete f.input[1].elevation;delete f.input[1].level;
 assert.equal(stabilize(f.input,f.result)[0][1].elevation,-3);
});
