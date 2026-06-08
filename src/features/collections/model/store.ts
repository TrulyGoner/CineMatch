import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';

export interface Collection {
  id: string;
  name: string;
  itemKeys: string[];
  createdAt: number;
}

interface CollectionsState {
  collections: Collection[];
}

const loadCollections = (): Collection[] =>
  localStorageManager.get<Collection[]>(STORAGE_KEYS.collections) ?? [];

const initialState: CollectionsState = {
  collections: loadCollections(),
};

const save = (collections: Collection[]): void => {
  localStorageManager.set(STORAGE_KEYS.collections, collections);
};

let nextId = Date.now();

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    createCollection(state, action: PayloadAction<string>) {
      const newCol: Collection = {
        id: `col_${nextId++}`,
        name: action.payload,
        itemKeys: [],
        createdAt: Date.now(),
      };
      state.collections.push(newCol);
      save(state.collections);
    },
    deleteCollection(state, action: PayloadAction<string>) {
      state.collections = state.collections.filter((c) => c.id !== action.payload);
      save(state.collections);
    },
    renameCollection(state, action: PayloadAction<{ id: string; name: string }>) {
      const col = state.collections.find((c) => c.id === action.payload.id);
      if (col) {
        col.name = action.payload.name;
        save(state.collections);
      }
    },
    addItemToCollection(state, action: PayloadAction<{ collectionId: string; itemKey: string }>) {
      const col = state.collections.find((c) => c.id === action.payload.collectionId);
      if (col && !col.itemKeys.includes(action.payload.itemKey)) {
        col.itemKeys.push(action.payload.itemKey);
        save(state.collections);
      }
    },
    removeItemFromCollection(state, action: PayloadAction<{ collectionId: string; itemKey: string }>) {
      const col = state.collections.find((c) => c.id === action.payload.collectionId);
      if (col) {
        col.itemKeys = col.itemKeys.filter((k) => k !== action.payload.itemKey);
        save(state.collections);
      }
    },
  },
});

export const {
  createCollection,
  deleteCollection,
  renameCollection,
  addItemToCollection,
  removeItemFromCollection,
} = collectionsSlice.actions;
export default collectionsSlice;

export const selectCollections = (state: { collections: CollectionsState }): Collection[] =>
  state.collections.collections;

export const selectCollectionById = (id: string) => (state: { collections: CollectionsState }): Collection | undefined =>
  state.collections.collections.find((c) => c.id === id);
