import React from 'react';
import { Editor, EditorState } from 'draft-js';

function normalizeSelectedIndex(selectedIndex, max) {
  let index = selectedIndex % max;
  if (index < 0) {
    index += max;
  }
  return index;
}

class TypeaheadEditor extends Editor {
  constructor(props) {
    super(props);
    this.typeaheadState = null;
  }

  hasEntityAtSelection() {
    const { editorState } = this.props;

    const selection = editorState.getSelection();
    if (!selection.getHasFocus()) {
      return false;
    }

    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(selection.getStartKey());
    return !!block.getEntityAt(selection.getStartOffset() - 1);
  }

  getTypeaheadRange() {
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
  }

  getTypeaheadState(invalidate = true) {
    if (!invalidate) {
      return this.typeaheadState;
    }

    const typeaheadRange = this.getTypeaheadRange();
    if (!typeaheadRange) {
      this.typeaheadState = null;
      return null;
    }

    const tempRange = window.getSelection().getRangeAt(0).cloneRange();
    tempRange.setStart(tempRange.startContainer, typeaheadRange.start);

    const rangeRect = tempRange.getBoundingClientRect();
    let [left, top] = [rangeRect.left, rangeRect.bottom];

    this.typeaheadState = {
      left,
      top,
      text: typeaheadRange.text,
      selectedIndex: 0
    };
    return this.typeaheadState;
  }

  onChange = (editorState) => {
    this.props.onChange(editorState);

    // Set typeahead visibility. Wait a frame to ensure that the cursor is
    // updated.
    if (this.props.onTypeaheadChange) {
      window.requestAnimationFrame(() => {
        this.props.onTypeaheadChange(this.getTypeaheadState());
      });
    }
  };

  onEscape = (e) => {
    if (!this.getTypeaheadState(false)) {
      this.props.onEscape && this.props.onEscape(e);
      return;
    }

    e.preventDefault();
    this.typeaheadState = null;

    this.props.onTypeaheadChange && this.props.onTypeaheadChange(null);
  };

  onArrow(e, originalHandler, nudgeAmount) {
    let typeaheadState = this.getTypeaheadState(false);

    if (!typeaheadState) {
      originalHandler && originalHandler(e);
      return;
    }

    e.preventDefault();
    typeaheadState.selectedIndex += nudgeAmount;
    this.typeaheadState = typeaheadState;

    this.props.onTypeaheadChange && this.props.onTypeaheadChange(typeaheadState);
  }

  onUpArrow = (e) => {
    this.onArrow(e, this.props.onUpArrow, -1);
  };

  onDownArrow = (e) => {
    this.onArrow(e, this.props.onDownArrow, 1);
  }

  handleReturn = (e) => {
    if (this.typeaheadState) {
      if (this.props.handleTypeaheadReturn) {
        const contentState = this.props.editorState.getCurrentContent();

        const selection = contentState.getSelectionAfter();
        const entitySelection = selection.set(
          'anchorOffset', selection.getFocusOffset() - this.typeaheadState.text.length
        );

        this.props.handleTypeaheadReturn(
          this.typeaheadState.text, this.typeaheadState.selectedIndex, entitySelection
        );

        this.typeaheadState = null;
        this.props.onTypeaheadChange && this.props.onTypeaheadChange(null);
      } else {
        console.error(
          "Warning: A typeahead is showing and return was pressed but `handleTypeaheadReturn` " +
          "isn't implemented."
        );
      }
      return true;
    }
    return false;
  };

  render() {
    const {
      onChange,
      onEscape, onUpArrow, onDownArrow,
      onTypeaheadChange,
      ...other
    } = this.props;

    return (
      <Editor
        {...other}
        onChange={this.onChange}
        onEscape={this.onEscape}
        onUpArrow={this.onUpArrow}
        onDownArrow={this.onDownArrow}
        handleReturn={this.handleReturn}
      />
    );
  }
};

export {
  normalizeSelectedIndex,
  TypeaheadEditor,
};
