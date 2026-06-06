import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Content } from '@/entities/content/model/types';

interface DetailPayload {
  item: Content;
  reasons?: string[];
}

interface DetailState {
  item: Content | null;
  reasons: string[];
}

const initialState: DetailState = {
  item: null,
  reasons: [],
};

const contentDetailSlice = createSlice({
  name: 'contentDetail',
  initialState,
  reducers: {
    openDetail(state, action: PayloadAction<DetailPayload>) {
      state.item = action.payload.item;
      state.reasons = action.payload.reasons ?? [];
    },
    closeDetail(state) {
      state.item = null;
      state.reasons = [];
    },
  },
});

export const { openDetail, closeDetail } = contentDetailSlice.actions;
export default contentDetailSlice;

export const selectDetailItem = (state: { contentDetail: DetailState }): Content | null =>
  state.contentDetail.item;

export const selectDetailReasons = (state: { contentDetail: DetailState }): string[] =>
  state.contentDetail.reasons;

export const selectIsDetailOpen = (state: { contentDetail: DetailState }): boolean =>
  state.contentDetail.item !== null;
