import test from 'node:test';import assert from 'node:assert/strict';
const key=Symbol.for('collision-elevation-precision.runtime');
globalThis.game={ready:true,release:{generation:14}};
class NativeToken {constrainMovementPath(input){if(this.fail)throw this.fail;return this.answer??[input,false]}}
globalThis.CONFIG={Token:{objectClass:NativeToken}};
const native=NativeToken.prototype.constrainMovementPath;
const api=await import('../precision.mjs');
test('installation idempotente, même récepteur et mêmes exceptions natives',()=>{
 const first=NativeToken.prototype.constrainMovementPath;assert.notEqual(first,native);assert.equal(api.installCollisionPrecision(),true);assert.equal(NativeToken.prototype.constrainMovementPath,first);
 const token=new NativeToken(),answer=[[],false];token.answer=answer;assert.equal(token.constrainMovementPath([]),answer);
 const error=Error('native');token.fail=error;assert.throws(()=>token.constrainMovementPath([]),e=>e===error);
});
test('désinstallation restitue le descripteur original',()=>{
 assert.equal(api.uninstallCollisionPrecision(),true);assert.equal(NativeToken.prototype.constrainMovementPath,native);assert.equal(globalThis.CollisionElevationPrecision.status().installed,false);
});
test('ne détruit pas un autre wrapper installé après lui',()=>{
 api.installCollisionPrecision();const precision=NativeToken.prototype.constrainMovementPath;
 const foreign=function(...a){return Reflect.apply(precision,this,a)};NativeToken.prototype.constrainMovementPath=foreign;
 assert.equal(api.uninstallCollisionPrecision(),false);assert.equal(NativeToken.prototype.constrainMovementPath,foreign);assert.equal(globalThis.CollisionElevationPrecision.status().enabled,false);
 NativeToken.prototype.constrainMovementPath=precision;assert.equal(api.uninstallCollisionPrecision(),true);delete globalThis[key];
});
test('répare les seuls résidus sélectionnés en une écriture groupée, puis ne réécrit rien',async()=>{
 const docs=[{id:'a',isOwner:true,parent:{id:'scene'},_source:{level:'l',elevation:3.9999999999999996}},{id:'b',isOwner:true,parent:{id:'scene'},_source:{level:'l',elevation:4.5}},{id:'c',isOwner:false,parent:{id:'scene'},_source:{level:'l',elevation:3.9999999999999996}}],calls=[];
 globalThis.canvas={tokens:{controlled:docs.map(document=>({document}))},scene:{id:'scene',levels:new Map([['l',{elevation:{bottom:4}}]]),async updateEmbeddedDocuments(type,data,opts){calls.push({type,data,opts});for(const u of data)docs.find(d=>d.id===u._id)._source.elevation=u.elevation}}};
 assert.deepEqual(await api.repairSelectedAtLevel(),{repaired:1,ignored:2});assert.equal(calls.length,1);assert.equal(docs[0]._source.elevation,4);assert.equal(docs[1]._source.elevation,4.5);assert.equal(docs[2]._source.elevation,3.9999999999999996);
 assert.deepEqual(await api.repairSelectedAtLevel(),{repaired:0,ignored:3});assert.equal(calls.length,1);delete globalThis.canvas;
});

test('refuse une autre génération ou une méthode native absente',()=>{
 for(const generation of [13,15]){game.release.generation=generation;assert.equal(api.installCollisionPrecision(),false)}
 game.release.generation=14;const saved=CONFIG.Token.objectClass;CONFIG.Token.objectClass=class {};
 assert.equal(api.installCollisionPrecision(),false);CONFIG.Token.objectClass=saved;
});
