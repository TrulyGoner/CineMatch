import { useCallback } from 'react';
import type { Content } from '@/entities/content/model/types';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  openDetail,
  closeDetail,
  selectDetailItem,
  selectDetailReasons,
  selectIsDetailOpen,
} from '../model/store';

export const useContentDetail = () => {
  const dispatch = useAppDispatch();
  const item = useAppSelector(selectDetailItem);
  const reasons = useAppSelector(selectDetailReasons);
  const isOpen = useAppSelector(selectIsDetailOpen);

  const open = useCallback(
    (content: Content, recommendationReasons?: string[]) => {
      dispatch(openDetail({ item: content, reasons: recommendationReasons }));
    },
    [dispatch]
  );

  const close = useCallback(() => {
    dispatch(closeDetail());
  }, [dispatch]);

  return { item, reasons, isOpen, open, close };
};
