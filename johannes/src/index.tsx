import { h, render } from 'preact';

import { startPresentation } from './presentation';

import App from './components/App';

const app = document.getElementById('app') as Element;

render(<App/>, document.body, app);

document.querySelector('.start-presentation').addEventListener('click', () => {
  startPresentation(
    document.querySelectorAll('.slide'),
    document.querySelector('.progress')
  );
});
