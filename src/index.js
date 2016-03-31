import React from 'React';
import { Editor, EditorState } from 'draft-js';

export class TypeaheadEditor extends Editor {
  hasEntityAtSelection = () => {
    const { editorState } = this.props;

    const selection = editorState.getSelection();
    if (!selection.getHasFocus()) {
      return false;
    }

    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(selection.getStartKey());
    return !!block.getEntityAt(selection.getStartOffset() - 1);
  };

  getTypeaheadRange = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      return null;
    }

    if (this.hasEntityAtSelection()) {
      return null;
    }

    const range = selection.getRangeAt(0);
    let text = range.startContainer.textContent;

    // Remove text that appears after the cursor..
    text = text.substring(0, range.startOffset);

    // ..and before the typeahead token.
    const index = text.lastIndexOf('@');
    if (index === -1) {
      return null;
    }
    text = text.substring(index);

    return {
      text,
      start: index,
      end: range.startOffset
    };
  };

  getTypeaheadState = () => {
    const typeaheadRange = this.getTypeaheadRange();
    if (!typeaheadRange) {
      return null;
    }

    const tempRange = window.getSelection().getRangeAt(0).cloneRange();
    tempRange.setStart(tempRange.startContainer, typeaheadRange.start);

    const rangeRect = tempRange.getBoundingClientRect();
    let [left, top] = [rangeRect.left, rangeRect.bottom];

    return {
      left,
      top,
      text: typeaheadRange.text
    };
  };

  onChange = (editorState) => {
    const { onChange, onTypeaheadChange } = this.props;
    onChange(editorState);

    // Set typeahead visibility. Wait a frame to ensure that the cursor is
    // updated.
    if (onTypeaheadChange) {
      window.requestAnimationFrame(() => {
        onTypeaheadChange(this.getTypeaheadState());
      });
    }
  };

  onEscape = (e) => {
    const { onEscape, onTypeaheadChange } = this.props;

    if (!this.getTypeaheadRange()) {
      if (onEscape) {
        onEscape(e);
      }
      return;
    }

    e.preventDefault();
    if (onTypeaheadChange) {
      onTypeaheadChange(null);
    }
  };

  render() {
    const { onChange, onEscape, onTypeaheadChange, ...other } = this.props;
    return (
      <Editor
        {...other}
        onChange={this.onChange}
        onEscape={this.onEscape}
      />
    );
  }
};
