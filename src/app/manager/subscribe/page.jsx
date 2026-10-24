"use client";

import { useState, useContext, useMemo } from "react";
import { Container } from "@mui/material";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import SimplePageTitle from '@/components/titles/SimplePageTitle';
import LoadingLayer from '@/components/animations/LoadingLayer';
import AlertInfo from '@/components/alerts/AlertInfo';
import DeleteDialog from '@/components/popups/DeleteDialog';
import useData from '@/hooks/useData';
import useDeleteItem from '@/hooks/useDeleteItem';
import useFont from '@/hooks/useFont';
import { getSystemLabel } from '@/components/labels/system_labels';

export default function SubscribeManager() {
  const { isCn } = useContext(LanguageContext);
  const [openDialogId, setOpenDialogId] = useState(null);
  const { style: fontStyle } = useFont();

  // Data management
  const { data, isLoading, error, setData, setError } = useData('/api/subscribe');
  const { deleteItem, loadingId } = useDeleteItem(
    setData,
    setError,
    (id) => `/api/subscribe?id=${id}`
  );

  const handleDeleteClick = (id) => setOpenDialogId(id);
  const handleDeleteCancel = () => setOpenDialogId(null);
  const handleDeleteConfirm = async () => {
    if (openDialogId) {
      await deleteItem(openDialogId);
      setOpenDialogId(null);
    }
  };

  const itemToDelete = useMemo(() =>
    data.find(item => item._id === openDialogId),
    [data, openDialogId]
  );

  return (
    <div className="min-h-screen bg-gray-50" style={fontStyle}>
      <Container maxWidth="lg" className="px-4 sm:px-6 lg:px-8 py-8" style={fontStyle}>
        {/* Header */}
        <div className="mb-8" style={fontStyle}>
          <SimplePageTitle title={getSystemLabel('subscribe_management', isCn)} style={fontStyle} />
          <div className="w-full border-b-2 border-black dark:border-white my-2" />
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingLayer isLoading={isLoading} />
        ) : error ? (
          <AlertInfo isCn={isCn} message={error} />
        ) : data.length === 0 ? (
          <AlertInfo isCn={isCn} message={getSystemLabel('no_subscribe_found', isCn) || (isCn ? '未找到订阅' : 'No subscriptions found')} />
        ) : (
          <div className="w-full mt-7">
            <div className="space-y-4">
              {data.map((item) => (
                <div key={item._id || item.id} className="w-full">
                  <div className="bg-white dark:bg-black border border-black dark:border-white hover:shadow-md transition-shadow min-h-[120px] flex group relative">
                    {/* Content Section */}
                    <div className="flex-1 flex flex-col p-4 md:p-6 relative">
                      {/* Actions - Top Right */}
                      <div className="flex gap-2 absolute top-4 right-4 z-30">
                        <button
                          onClick={() => handleDeleteClick(item._id)}
                          className="p-2 bg-black dark:bg-white rounded-full shadow-md hover:bg-red-700 transition-colors"
                          disabled={loadingId === item._id}
                        >
                          <span className="text-white dark:text-black font-bold">{getSystemLabel('delete_short', isCn) || (isCn ? '删' : 'Del')}</span>
                        </button>
                      </div>
                      {/* Loading overlay */}
                      {loadingId === item._id && (
                        <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-75 flex items-center justify-center z-40">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        </div>
                      )}
                      {/* Text Content */}
                      <div className="flex-1 flex flex-col justify-start pr-16 mt-2">
                        <div className="flex flex-wrap gap-4 items-center mb-2">
                          <span className="font-bold text-gray-900 text-lg md:text-xl break-words text-left">
                            {item.name}
                          </span>
                          <span className="text-gray-600 text-sm md:text-base break-words">{item.email}</span>
                        </div>
                        <div className="flex gap-6 text-sm md:text-base text-gray-700">
                          <span>
                            {getSystemLabel('status', isCn) || (isCn ? '状态' : 'Status')}: {item.isActive ? (getSystemLabel('active', isCn) || (isCn ? '激活' : 'Active')) : (getSystemLabel('inactive', isCn) || (isCn ? '停用' : 'Inactive'))}
                          </span>
                          <span>
                            {getSystemLabel('createdAt', isCn) || (isCn ? '创建时间' : 'Created At')}: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Dialog */}
        <DeleteDialog
          open={openDialogId !== null}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          item={itemToDelete}
          loadingId={loadingId}
          title={getSystemLabel('confirmDelete', isCn) || (isCn ? '确认删除' : 'Confirm Delete')}
          content={getSystemLabel('confirmDeleteSubscribe', isCn) || (isCn ? '确定要删除该订阅吗？' : 'Are you sure you want to delete this subscription?')}
          cancelLabel={getSystemLabel('cancel', isCn) || (isCn ? '取消' : 'Cancel')}
          confirmLabel={getSystemLabel('delete', isCn) || (isCn ? '删除' : 'Delete')}
          thisLabel={getSystemLabel('thisSubscribe', isCn) || (isCn ? '该订阅' : 'this subscription')}
        />
      </Container>
    </div>
  );
}