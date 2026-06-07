import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    item: null,
    reasons: [],
};
const contentDetailSlice = createSlice({
    name: 'contentDetail',
    initialState,
    reducers: {
        openDetail(state, action) {
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
export const selectDetailItem = (state) => state.contentDetail.item;
export const selectDetailReasons = (state) => state.contentDetail.reasons;
export const selectIsDetailOpen = (state) => state.contentDetail.item !== null;
