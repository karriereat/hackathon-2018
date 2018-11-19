import { h, Component } from 'preact';

import Slide from './Slide';

export default class Slides extends Component<any, any> {
  render({ slides }) {
    return (
      <ul class="slides">
        {slides.map((slide) => <Slide data={slide} index={slide.id}/>)}
      </ul>
    );
  }
}
