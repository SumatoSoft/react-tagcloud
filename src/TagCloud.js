import React from 'react';
import { defaultRenderer } from './defaultRenderer';
import arrayShuffle from 'array-shuffle';
import randomColor from 'randomcolor';
import { omitProps, includeProps, fontSizeConverter, arraysEqual } from './helpers';

const eventHandlers = ['onClick', 'onDoubleClick', 'onMouseMove'];
const cloudProps = ['tags', 'shuffle', 'renderer', 'maxSize', 'minSize', 'colorOptions', 'disableRandomColor'];

const generateColor = (tag, {disableRandomColor, colorOptions}) => {
  if (tag.color) {
    return tag.color;
  }
  if (disableRandomColor) {
    return undefined;
  }
  return randomColor(colorOptions);
};

export class TagCloud extends React.Component {

  componentWillReceiveProps(newProps) {
    const { tags, shuffle, disableRandomColor } = newProps;
    const dataEquals = arraysEqual(tags, this.props.tags) &&
          shuffle == this.props.shuffle &&
          disableRandomColor == this.props.disableRandomColor;
    if (!dataEquals) {
      this._populate(newProps);
    }
  }

  componentWillMount() {
    this._populate(this.props);
  }

  render() {
    const props = omitProps(this.props, [...cloudProps, ...eventHandlers]);
    const tagElements = this._attachEventHandlers();
    return (
      <div {...props}>
      { tagElements }
      </div>
    );
  }

  _attachEventHandlers() {
    const cloudHandlers = includeProps(this.props, eventHandlers);
    return this._data.map(({tag, fontSize, color}) => {
      const elem = this.props.renderer(tag, fontSize, color);
      const tagHandlers = includeProps(elem.props, eventHandlers);
      const globalHandlers = Object.keys(cloudHandlers).reduce((r, k) => {
        r[k] = e => {
          cloudHandlers[k](tag, e);
          tagHandlers[k] && tagHandlers(e);
        }
        return r;
      }, {});
      return React.cloneElement(elem, globalHandlers);
    });
  }

  _populate(props) {
    const { tags, shuffle, minSize, maxSize } = props;
    const counts = tags.map(tag => tag.count),
          min = Math.min(...counts),
          max = Math.max(...counts);
    const data = tags.map(tag => ({
      tag,
      color: generateColor(tag, props),
      fontSize: fontSizeConverter(tag.count, min, max, minSize, maxSize) * (tag.fontScale || 1)
    }));
    this._data = data;
  }

}

TagCloud.propTypes = {
  tags: React.PropTypes.array.isRequired,
  maxSize: React.PropTypes.number.isRequired,
  minSize: React.PropTypes.number.isRequired,
  shuffle: React.PropTypes.bool,
  colorOptions: React.PropTypes.object,
  disableRandomColor: React.PropTypes.bool,
  renderer: React.PropTypes.func,
  className: React.PropTypes.string
};

TagCloud.defaultProps = {
  renderer: defaultRenderer,
  shuffle: true,
  className: 'tag-cloud',
  colorOptions: {}
};
