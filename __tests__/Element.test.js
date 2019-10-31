import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Home from './../screens/Home';


let findElement=function(){
    console.warn(tree);
    return true;
}
it('find Element',()=>{
    let tree=renderer.create(
        <Home/>
    ).toJSON();
    expect(findElement(tree,'Signout')).toBeDefined();
})