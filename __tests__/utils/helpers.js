import { mount } from 'enzyme';

export function getFakeChildren(component) {
  const React = require('react');

  return (
    <span
      style={{ height: 100 }}
      className={`testing-class-${component}`}>
      { `This is a ${component} children` }
    </span>);
}

export function mountCmpt(Component, props = {}, options = {}) {
  if (!Component) {
    throw new Error('Component argument is needed');
  }

  const React = require('react');
  return mount(
    <Component {...props}>
      { getFakeChildren(Component.displayName) }
    </Component>,
    options,
  );
}

export function testSentClasses(mountedComponent, classes) {
  return classes.forEach((className) => {
    expect(mountedComponent.find(`.${className}`).exists()).toEqual(true);
  });
}
