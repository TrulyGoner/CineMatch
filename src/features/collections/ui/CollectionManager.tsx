import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  createCollection,
  deleteCollection,
  renameCollection,
  addItemToCollection,
  removeItemFromCollection,
  selectCollections,
} from '../model/store';
import type { Collection } from '../model/store';
import { Button } from '@/shared/ui/Button';
import './CollectionManager.scss';

interface CollectionManagerProps {
  itemKey?: string;
}

export const CollectionManager = ({ itemKey }: CollectionManagerProps) => {
  const dispatch = useAppDispatch();
  const collections = useAppSelector(selectCollections);
  const { t } = useTranslation();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleCreate = useCallback(() => {
    const name = newName.trim() || t('collections.defaultName');
    dispatch(createCollection(name));
    setNewName('');
    setShowCreate(false);
  }, [newName, dispatch, t]);

  const handleDelete = useCallback(
    (col: Collection) => {
      if (window.confirm(t('collections.deleteConfirm', { name: col.name }))) {
        dispatch(deleteCollection(col.id));
      }
    },
    [dispatch, t]
  );

  const handleRename = useCallback(
    (id: string) => {
      const name = renameValue.trim();
      if (name) {
        dispatch(renameCollection({ id, name }));
      }
      setRenamingId(null);
      setRenameValue('');
    },
    [renameValue, dispatch]
  );

  const handleToggleItem = useCallback(
    (col: Collection) => {
      if (!itemKey) return;
      if (col.itemKeys.includes(itemKey)) {
        dispatch(removeItemFromCollection({ collectionId: col.id, itemKey }));
      } else {
        dispatch(addItemToCollection({ collectionId: col.id, itemKey }));
      }
    },
    [itemKey, dispatch]
  );

  return (
    <div className="collection-manager">
      {collections.map((col) => (
        <div key={col.id} className="collection-manager__item">
          {renamingId === col.id ? (
            <div className="collection-manager__rename">
              <input
                className="collection-manager__rename-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename(col.id);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                autoFocus
              />
              <Button variant="primary" size="sm" onClick={() => handleRename(col.id)}>
                {t('collections.save')}
              </Button>
            </div>
          ) : (
            <>
              <div className="collection-manager__info">
                <span className="collection-manager__name">{col.name}</span>
                <span className="collection-manager__count">{col.itemKeys.length}</span>
              </div>
              <div className="collection-manager__actions">
                {itemKey && (
                  <Button
                    variant={col.itemKeys.includes(itemKey) ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handleToggleItem(col)}
                  >
                    {col.itemKeys.includes(itemKey)
                      ? t('collections.removeItem')
                      : t('collections.addItem')}
                  </Button>
                )}
                {!itemKey && (
                  <>
                    <button
                      type="button"
                      className="collection-manager__action-btn"
                      onClick={() => { setRenamingId(col.id); setRenameValue(col.name); }}
                      title={t('collections.rename')}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="collection-manager__action-btn collection-manager__action-btn--danger"
                      onClick={() => handleDelete(col)}
                      title={t('collections.delete')}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {showCreate ? (
        <div className="collection-manager__create">
          <input
            className="collection-manager__create-input"
            placeholder={t('collections.namePlaceholder')}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') setShowCreate(false);
            }}
            autoFocus
          />
          <div className="collection-manager__create-actions">
            <Button variant="primary" size="sm" onClick={handleCreate}>
              {t('collections.save')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
              {t('collections.cancel')}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="collection-manager__add-btn"
          onClick={() => setShowCreate(true)}
        >
          + {t('collections.create')}
        </button>
      )}
    </div>
  );
};
