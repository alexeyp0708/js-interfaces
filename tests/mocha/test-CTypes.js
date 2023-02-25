import {assert,expect} from './export.js'
import {CTypes} from "../../src/CTypes.js";
import {InterfaceError} from "../../src/InterfaceError.js";

describe('Class CTypes', () => {
  it('CTypes constructor',()=>{
    class FuncType {}
    let objType={}
    // correct types
    expect(()=>{new CTypes([null,undefined])}).to.not.throw()
    expect(()=>{new CTypes([ 'null', 'undefined', 'object', 'boolean', 'number', 'string', 'symbol', 'function', 'mixed'])}).to.not.throw()
    expect(()=>{new CTypes([FuncType,objType])}).to.not.throw()
    // incorect types
    expect(()=>{new CTypes(['other'])}).to.throw(InterfaceError)
    expect(()=>{new CTypes([1])}).to.throw(InterfaceError)
    expect(()=>{new CTypes([1])}).to.throw(InterfaceError)
    expect(()=>{new CTypes(['string','string'])},'Check duplicate').to.throw(InterfaceError)
  })
  it('CTypes getTypes',()=>{
    class FuncType {}
    let objType={}
    let cTypes=new CTypes([null,undefined,'object', 'boolean', 'number', 'string', 'symbol', 'function', 'mixed',FuncType,objType])
    let actual=['null','undefined','object', 'boolean', 'number', 'string', 'symbol', 'function', 'mixed',FuncType,objType]
    
    expect(cTypes.getTypes()).to.eql(actual).which.not.equal(actual)
  })
})