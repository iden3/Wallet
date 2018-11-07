import * as helpers from 'test_helpers';
import { Widget } from 'base_components';
import Dashboard from './dashboard';

let mountedComponent;
const classes = ['i3-ww-dashboard'];

describe('Render Dashboard in the successful path', () => {
  it('Should be mounted and rendered when call it and be a Dashboard', () => {
    mountedComponent = helpers.mountCmpt(Dashboard);
    expect(mountedComponent).toBeDefined();
    expect(mountedComponent.type()).toEqual(Dashboard);
  });

  it('Should contain the class i3-ww-dashboard', () => {
    helpers.testSentClasses(mountedComponent, classes);
  });

  it('Should contain two widgets', () => {
    expect(mountedComponent.find(Widget)).toBeTruthy();
    expect(mountedComponent.find(Widget).length).toEqual(2);
  });

  it('Should have as a first widget the notifications one', () => {
    const widgetTitle = 'i3-ww-widget__header-title';

    expect(mountedComponent.find(`.${widgetTitle}`).first().text()).toMatch('Pending actions');
  });

  it('Should contain as a second widget the pinned claims one', () => {
    const widgetTitle = 'i3-ww-widget__header-title';

    expect(mountedComponent.find(`.${widgetTitle}`).last().text()).toMatch('Pinned claims');
  });
});
