import { h, Component } from 'preact';

export default class SlideField extends Component<any, any> {
  shouldComponentUpdate() {
    return !this.props.isProcessed;
  }

  render({ editor, name, locked, value }) {
    return (
      <div
        class={`slide__${name} ${locked && 'is-locked'}`}
        data-user={editor}
        contenteditable={!locked}
        style={this.props.style}
        dangerouslySetInnerHTML={{ __html: value }}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onKeyUp={this.props.onKeyUp}
      />
    );
  }
}
