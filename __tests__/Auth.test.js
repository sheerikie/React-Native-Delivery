import React from 'react';
import renderer from 'react-test-renderer';
import Login from '../screens/Login';

let findElement=function(){
    console.warn(tree);
    return true;
}
it('renders correctly', () => {
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
  });
it('should change the password value', () => {
    let loginComponent = renderer.create(<Login/>).getInstance()
    
    loginComponent.handlePasswordChange('some_password')

    expect(loginComponent.state.password).toEqual('some_password')        
})