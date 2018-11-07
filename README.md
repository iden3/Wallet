# Web wallet


Implementation of the front-end for the Iden3 wallet for managing identities and claims.
This webapp it's thought to be responsive and access to the cam of your device.

The application has these areas:
 - **Dashboard**: you can find a widget with the pending action. That means that you will see a list of actions that require your approval. Such as a login or regirter in a third party provider.
 As well, there is a widget with the pinned claims: those that the user decides to access them easy (the favourite ones). I.e. could be a claim to access to their work place, to the gym, etc...
 - **Claims**: We can find a widget with the list of claims. Are divided in three types: Emitted, Received and grouped.
 - **History**: A list with the history of the user actions (such as create a claim, revoke another, login in a third party provider using a claim, etc...).
 - **Manage identities**: An user can create as many identities as he/she wants. Here it's possible to create, delete, etc...


### **WARNING: All code here is experimental and WIP**


### Engines
Last Node LTS version (current: Node 8.11.4)
 
### Project scripts
For running the development server:
```
npm run build:dev 
```
For running production build:
```
npm run build: prod
```
For running tests:
```
npm run test 
```

### Most important technologies, libraries and framewors used
 - React 16 (https://reactjs.org/)
 - Redux (https://redux.js.org/) and redux-thunk (https://github.com/reduxjs/redux-thunk)
 - Immutable.js (https://facebook.github.io/immutable-js)
 - Date-fns (https://date-fns.org)
 - Webpack (https://webpack.js.org)
 - Babel (https://babeljs.io)
 - SASS pre-processor (https://sass-lang.com)
 - Antd UI framework (https://ant.design)
 - Jest (https://jestjs.io)
 - Enzyme (http://airbnb.io/enzyme)

### Some development decisions

- Project is developer (mostly) with features of ES6 and ESM
- Follow BEM naming for classes and id's, please (http://getbem.com).
- Container - component pattern: At views there will be always a containers folder. And if needed a components folder.
- Use High order components to wrap any container accessing to the app STATE: We think is easier to reuse using the 'compose' Redux function.
- High order components are preferred over Render Props. We are open to discus about whether use one or the other. We are pretty sure that you always will find awesome pros and cons :)
- PureComponents are preferred over functional components. In our tests are faster to render.
- Try to memoize when we need to update component state with new received props.
- Please use constants files in the 'constants' folder for any literal or value to check that we will be the same in the application.

### Some components explanations
#### Box
It's a component in which we indicate if use a pop-up or side-bar to show information.
We prefer use pop-ups for direct actions: YES/NO/OK. And show content in a side-bar that can appears from left or right.
This is configurable by you setting the 'type' prop of Box.
#### List
We have created our own list component. It's nothing hard. The most important is the `Scrollable` component which is in charge to handle whatever related to the list (call backs when
some number of rows are reached, etc..)
#### Camera
We have our own cam component that is used by the `QRSCanner`. So you can use it for your convenience, not only for scan QR codes.
### Helpers
There is an utils file at the helpers folder. Please, place there any helper that you think we can use in the application: sort an array, capitalize a word, etc...
### App state
We encourage you to use immutable.js to store any value in the app state. Immutability is the core in all this world :)

### Path alias
At the `webpack.config.js` file you can find the alias used in the application. Please, refer there to check them and if you want to add any other.
### Testing
We use Jest and Enzyme, nothing out there :)
At the `__tests__` folder you'll find a `setup-tests` file in which is placed the adapter to use with React 16.
As well, you'll find the reports and the Jest snapshots.
About testing it's very important to test:
- Edge cases always! the successful path and ant unsuccessful path regarding the logic.
- If we have required props, test if they are not sent. At least, should be an error triggered in the console
- If there is any hook from the React lifecycle, test it!
- If there is any immutable entity, test that you can't mutate it.
- If component has classes, once mounted check that has these classes.
- Test that the component has the corresponding accessibility tags (`role`, etc...).
### Licenses
Avatar Icon made by [Pixelmeetup](https://www.flaticon.com/authors/pixelmeetup) from www.flaticon.com 
