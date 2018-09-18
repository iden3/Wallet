
import * as helpers from 'test_helpers';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import App from './app';

let mountedComponent;
const classes = ['i3-ww-app', 'i3-ww-popups'];

describe('Render App in the successful path', () => {
  it('Should be mounted and rendered when call it and be an App component', () => {
    const mockRouter = new ReactRouterEnzymeContext();

    mountedComponent = helpers.mountCmpt(App, mockRouter.props(), mockRouter.get());
    expect(mountedComponent).toBeDefined();
    expect(mountedComponent.type()).toEqual(App);
  });

  it('Should contain the classes i3-ww-app and i3-ww-popups', () => {
    helpers.testSentClasses(mountedComponent, classes);
  });
});
