import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { openDetail, closeDetail, selectDetailItem, selectDetailReasons, selectIsDetailOpen, } from '../model/store';
export const useContentDetail = () => {
    const dispatch = useAppDispatch();
    const item = useAppSelector(selectDetailItem);
    const reasons = useAppSelector(selectDetailReasons);
    const isOpen = useAppSelector(selectIsDetailOpen);
    const open = useCallback((content, recommendationReasons) => {
        dispatch(openDetail({ item: content, reasons: recommendationReasons }));
    }, [dispatch]);
    const close = useCallback(() => {
        dispatch(closeDetail());
    }, [dispatch]);
    return { item, reasons, isOpen, open, close };
};
