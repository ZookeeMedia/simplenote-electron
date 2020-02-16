/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import appState from '../flux/app-state';
import { tracks } from '../analytics';
import IconButton from '../icon-button';
import NewNoteIcon from '../icons/new-note';
import SearchField from '../search-field';
import MenuIcon from '../icons/menu';
import { withoutTags } from '../utils/filter-notes';
import { createNote, search, toggleNavigation } from '../state/ui/actions';

import * as S from '../state';
import * as T from '../types';

const { newNote } = appState.actionCreators;
const { recordEvent } = tracks;

type OwnProps = {
  onNewNote: Function;
  noteBucket: object;
  onNoteOpened: Function;
};

type StateProps = {
  searchQuery: string;
  showTrash: boolean;
};

type DispatchProps = {
  toggleNavigation: () => any;
};

type Props = OwnProps & StateProps & DispatchProps;

export const SearchBar: Component<Props> = ({
  onNewNote,
  searchQuery,
  showTrash,
}) => (
  <div className="search-bar theme-color-border">
    <IconButton
      icon={<MenuIcon />}
      onClick={() => toggleNavigation()}
      title="Menu"
    />
    <SearchField />
    <IconButton
      disabled={showTrash}
      icon={<NewNoteIcon />}
      onClick={() => onNewNote(withoutTags(searchQuery))}
      title="New Note"
    />
  </div>
);

const mapStateToProps: S.MapState<StateProps> = ({
  appState: { showTrash },
  ui: { searchQuery },
}) => ({
  searchQuery,
  showTrash,
});

const mapDispatchToProps: S.MapDispatch<DispatchProps, OwnProps> = (
  dispatch,
  { noteBucket, onNoteOpened }
) => ({
  onNewNote: (content: string) => {
    dispatch(createNote());
    dispatch(search(''));
    dispatch(newNote({ noteBucket, content }));
    onNoteOpened();
    recordEvent('list_note_created');
  },
  toggleNavigation: () => {
    console.log('called');
    dispatch(toggleNavigation());
  },
});

SearchBar.displayName = 'SearchBar';

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
