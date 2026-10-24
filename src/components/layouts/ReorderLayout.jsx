"use client";
import React, { useState, useEffect, useContext } from 'react';
import { ORDER_PAGE_CSS } from '@/components/pages/manager/order/orderPageStyles';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { ArrowUpDown, Edit } from 'lucide-react';
import { LanguageContext } from "@/components/contexts/LanguageContext";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import { getSystemLabel } from "@/components/labels/system_labels";

// Generic Draggable Row Component
function DraggableItemRow({ item, index, fields, onEdit, isGrouped = false, getLabel, config }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id || item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: 'transparent',
        border: '2px solid var(--border-light, #000000)',
        color: 'white',
      }}
      {...attributes}
      {...listeners}
      className={`
        flex items-center rounded-lg px-4 py-3 mb-3
        ${isDragging ? 'shadow-lg  z-50' : ''}
        cursor-grab active:cursor-grabbing transition-all duration-200
        hover:shadow-md
        ${isGrouped ? 'ml-6' : ''}
      `}
    >
      {/* Index Chip */}
      <div 
        className="font-bold px-3 py-1 rounded-full text-sm mr-4 min-w-8 text-center"
        style={{
          backgroundColor: 'white',
          color: '#000000',
        }}
      >
        {index + 1}
      </div>
      
      {/* Content */}
      <div 
        className="flex-1 flex items-center font-medium"
        style={{ color: 'white' }}
      >
        <span className="flex items-center">
          {fields.map((field, i) => (
            <span key={field} className="mr-3">
              {item[field] || ''}
              {i < fields.length - 1 && (
                <span 
                  className="ml-3"
                  style={{ color: 'white' }}
                >
                  |
                </span>
              )}
            </span>
          ))}
        </span>
      </div>
      
      {/* Drag indicator */}
      <div 
        className="ml-4"
        style={{ color: 'white' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        </svg>
      </div>
      
      {/* Edit button */}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item._id || item.id);
          }}
          className="ml-4 p-1 rounded transition-colors"
          style={{
            color: 'var(--text-primary, white)',
            backgroundColor: 'transparent',
          }}
          title={getLabel('editItem')}
        >
          <Edit size={14} />
        </button>
      )}
    </div>
  );
}

// Generic Group Component
function ItemGroup({ groupKey, items, fields, onEdit, groupIndex, getLabel, config }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `group-${groupKey}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: '#000000',
        border: '2px solid var(--border-light, #000000)',
        color: 'white',
      }}
      {...attributes}
      {...listeners}
      className={`
        mb-4 rounded-lg p-4
        ${isDragging ? 'shadow-lg  z-50' : ''}
        cursor-grab active:cursor-grabbing transition-all duration-200
        hover:shadow-md
      `}
    >
      <div 
        className="font-bold text-lg mb-3"
        style={{ color: 'white' }}
      >
        {config.groupTitleTemplate.replace('{groupKey}', groupKey).replace('{count}', items.length)}
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <DraggableItemRow
            key={item._id || item.id}
            item={item}
            index={index}
            fields={fields}
            onEdit={onEdit}
            isGrouped={true}
            getLabel={getLabel}
            config={config}
          />
        ))}
      </div>
    </div>
  );
}

// Main Generic Reorder Component
function GenericReorderLayout({ 
  config,
  data = [],
  onSave,
  onEdit,
  loading = false,
  saving = false,
  error = null,
  success = false
}) {
  const { isCn } = useContext(LanguageContext);
  
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [sortedByField, setSortedByField] = useState({});
  const [groupedByField, setGroupedByField] = useState(null);
  const [sortDirections, setSortDirections] = useState({});
  
  // Helper function to get labels
  const getLabel = (key) => getSystemLabel(key, isCn);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize data
  useEffect(() => {
    if (data && data.length > 0) {
      // Filter items by language if language field exists
      const filteredData = data.filter(item => {
        if (!item.language) return true;
        if (isCn) {
          return item.language === 'CN' || item.language === 'BILINGUAL';
        } else {
          return item.language === 'EN' || item.language === 'BILINGUAL';
        }
      });
      
      setItems(filteredData);
      setOriginalItems(filteredData);
    }
  }, [data, isCn]);

  // Group items by field
  const groupItemsByField = (itemsToGroup, field) => {
    const groups = {};
    itemsToGroup.forEach(item => {
      const groupKey = item[field] || config.noGroupLabel;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });
    return groups;
  };

  // Sort items by field with direction
  const sortByField = (field, direction = 'asc') => {
    const sorted = [...items].sort((a, b) => {
      const valueA = a[field] || '';
      const valueB = b[field] || '';
      
      if (config.sortTypes[field] === 'number') {
        const numA = parseInt(valueA) || 0;
        const numB = parseInt(valueB) || 0;
        return direction === 'asc' ? numA - numB : numB - numA;
      } else {
        const strA = valueA.toString().toLowerCase();
        const strB = valueB.toString().toLowerCase();
        return direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      }
    });
    
    setItems(sorted);
    setSortedByField({ [field]: true });
    setGroupedByField(null);
    setSortDirections({ [field]: direction });
  };

  // Group by field
  const groupByField = (field) => {
    setGroupedByField(field);
    setSortedByField({});
    setSortDirections({});
  };

  // Toggle sort direction
  const toggleSort = (field) => {
    if (!sortedByField[field]) {
      sortByField(field, 'asc');
    } else {
      const newDirection = sortDirections[field] === 'asc' ? 'desc' : 'asc';
      sortByField(field, newDirection);
    }
  };

  // Reset to original order
  const resetToOriginal = () => {
    setItems(originalItems);
    setSortedByField({});
    setGroupedByField(null);
    setSortDirections({});
  };

  // Handle drag end
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (groupedByField && active.id.startsWith('group-') && over.id.startsWith('group-')) {
        // Reordering groups
        const groups = groupItemsByField(items, groupedByField);
        const groupKeys = Object.keys(groups);
        const oldIndex = groupKeys.findIndex(key => `group-${key}` === active.id);
        const newIndex = groupKeys.findIndex(key => `group-${key}` === over.id);
        
        const reorderedGroups = arrayMove(groupKeys, oldIndex, newIndex);
        const newItems = reorderedGroups.flatMap(groupKey => groups[groupKey]);
        
        setItems(newItems);
        // Defer the onSave call to avoid state updates during render
        setTimeout(() => onSave(newItems), 0);
      } else if (!groupedByField) {
        // Reordering individual items
        setItems((currentItems) => {
          const oldIndex = currentItems.findIndex((item) => item._id === active.id || item.id === active.id);
          const newIndex = currentItems.findIndex((item) => item._id === over.id || item.id === over.id);
          
          const newItems = arrayMove(currentItems, oldIndex, newIndex);
          
          // Update order property to reflect new positions
          const updatedItems = newItems.map((item, index) => ({
            ...item,
            order: String(index + 1)
          }));
          
          // Defer the onSave call to avoid state updates during render
          setTimeout(() => onSave(updatedItems), 0);
          
          return updatedItems;
        });
      }
    }
  }

  if (loading) {
    return <LoadingLayer isLoading={true} />;
  }

  if (error) {
    return (
      <AlertInfo
        message={getLabel('errorLoadingItems')}
        subMessage={error}
        buttonText={getLabel('retry')}
        messageCn={getLabel('errorLoadingItems')}
        subMessageCn={error}
        buttonTextCn={getLabel('retry')}
        onBack={() => window.location.reload()}
        isCn={isCn}
      />
    );
  }

  // Prepare data for rendering
  const renderData = groupedByField ? groupItemsByField(items, groupedByField) : null;
  const groupKeys = renderData ? Object.keys(renderData) : [];

  return (
    <div 
      className="max-w-4xl mx-auto p-6"
      style={{ backgroundColor: 'var(--background-primary, white)' }}
    >
      <style>{ORDER_PAGE_CSS}</style>
      {/* Shared order-page chrome: a bold, underlined title + a dashed rule. */}
      <h1 
        className="text-2xl mb-0"
        style={{
          color: 'var(--text-primary, #000000)',
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: '1.8px',
          textTransform: 'uppercase',
          textDecoration: 'underline',
          textDecorationThickness: 2,
          textUnderlineOffset: 5,
        }}
      >
        {getLabel(config.pageTitleKey)}
      </h1>
      <div
        style={{
          borderTop: '1px dashed var(--border-light, rgba(0,0,0,0.28))',
          marginTop: 14,
          marginBottom: 18,
        }}
      />
      
      {/* Language Filter Info */}
      <div 
        className="mb-4 p-3 border rounded-lg"
        style={{
          backgroundColor: 'var(--background-secondary, white)',
          borderColor: 'var(--border-light, #000000)',
        }}
      >
        <span 
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary, #000000)' }}
        >
          {getLabel('showingLanguageItems').replace('{language}', isCn ? getLabel('chineseItems') : getLabel('englishItems'))}
        </span>
      </div>
      
      {/* Sort Controls */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        {config.sortFields.map((field) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className="ordbtn flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-primary, #000000)',
              fontWeight: sortedByField[field] ? 800 : 500,
              border: `1px solid ${sortedByField[field] ? 'var(--text-primary, #000000)' : 'var(--border-light, #d1d5db)'}`,
              textDecoration: sortedByField[field] ? 'underline' : 'none',
              textDecorationThickness: 2,
              textUnderlineOffset: 3,
            }}
          >
            <ArrowUpDown 
              size={16} 
              style={{ 
                color: 'var(--text-primary, #000000)' 
              }} 
            />
            <span style={{ 
              color: 'var(--text-primary, #000000)' 
            }}>
              {getLabel(`sortBy${field.charAt(0).toUpperCase() + field.slice(1).replace('_en', '').replace('_cn', '')}`)}
            </span>
            {sortedByField[field] && (
              <span 
                className="text-xs"
                style={{ 
                  color: 'var(--text-primary, #000000)' 
                }}
              >
                ({sortDirections[field] === 'asc' ? getLabel('ascending') : getLabel('descending')})
              </span>
            )}
          </button>
        ))}

        {config.groupFields.map((field) => (
          <button
            key={field}
            onClick={() => groupByField(field)}
            className="ordbtn flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-primary, #000000)',
              fontWeight: groupedByField === field ? 800 : 500,
              border: `1px solid ${groupedByField === field ? 'var(--text-primary, #000000)' : 'var(--border-light, #d1d5db)'}`,
              textDecoration: groupedByField === field ? 'underline' : 'none',
              textDecorationThickness: 2,
              textUnderlineOffset: 3,
            }}
          >
            <ArrowUpDown 
              size={16} 
              style={{ 
                color: 'var(--text-primary, #000000)' 
              }} 
            />
            <span style={{ 
              color: 'var(--text-primary, #000000)' 
            }}>
              {getLabel(`groupBy${field.charAt(0).toUpperCase() + field.slice(1)}`)}
            </span>
            {groupedByField === field && (
              <span 
                className="text-xs"
                style={{ 
                  color: 'var(--text-primary, #000000)' 
                }}
              >
                ({getLabel('dragGroups')})
              </span>
            )}
          </button>
        ))}
        
        {(Object.keys(sortedByField).some(key => sortedByField[key]) || groupedByField) && (
          <button
            onClick={resetToOriginal}
            className="px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor: 'white',
              color: '#000000',
              borderColor: '#e5e7eb',
            }}
          >
            {getLabel('resetToOriginalOrder')}
          </button>
        )}
      </div>
      
      {success && (
        <div 
          className="border rounded-lg p-4 mb-6"
          style={{
            backgroundColor: 'var(--background-secondary, white)',
            borderColor: 'var(--border-light, #000000)',
          }}
        >
          <p style={{ color: 'var(--text-primary, #000000)' }}>{getLabel('orderSavedSuccessfully')}</p>
        </div>
      )}
      
      {saving && (
        <div 
          className="border rounded-lg p-4 mb-6"
          style={{
            backgroundColor: 'var(--background-secondary, white)',
            borderColor: 'var(--border-light, #000000)',
          }}
        >
          <p style={{ color: 'var(--text-primary, #000000)' }}>{getLabel('savingOrder')}</p>
        </div>
      )}
      
      <div 
        className="rounded-lg p-4"
        style={{
          backgroundColor: 'var(--background-secondary, white)',
          border: '1px solid var(--border-light, #000000)',
        }}
      >
        <h2 
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary, #000000)' }}
        >
          {groupedByField ? getLabel('itemGroups') : getLabel('draggableItems')} ({items.length})
        </h2>
        
        {items.length === 0 ? (
          <div 
            className="text-center py-8"
            style={{ color: 'var(--text-primary, #000000)' }}
          >
            {getLabel('noLanguageItemsFound').replace('{language}', isCn ? getLabel('chineseItems') : getLabel('englishItems'))}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            {groupedByField ? (
              <SortableContext items={groupKeys.map(key => `group-${key}`)} strategy={verticalListSortingStrategy}>
                {groupKeys.map((groupKey, groupIndex) => (
                  <ItemGroup
                    key={groupKey}
                    groupKey={groupKey}
                    items={renderData[groupKey]}
                    fields={config.displayFields}
                    onEdit={onEdit}
                    groupIndex={groupIndex}
                    getLabel={getLabel}
                    config={config}
                  />
                ))}
              </SortableContext>
            ) : (
              <SortableContext items={items.map(item => item._id || item.id)} strategy={verticalListSortingStrategy}>
                {items.map((item, index) => (
                  <DraggableItemRow
                    key={item._id || item.id}
                    item={item}
                    index={index}
                    fields={config.displayFields}
                    onEdit={onEdit}
                    getLabel={getLabel}
                    config={config}
                  />
                ))}
              </SortableContext>
            )}
          </DndContext>
        )}
      </div>
      
      {/* Debug info */}
      <div 
        className="mt-6 p-4 rounded-lg"
        style={{
          backgroundColor: 'var(--background-secondary, white)',
          border: '1px solid var(--border-light, #000000)',
        }}
      >
        <h3 
          className="font-semibold mb-2"
          style={{ color: 'var(--text-primary, #000000)' }}
        >
          {getLabel('currentOrder')}:
        </h3>
        <div 
          className="text-sm"
          style={{ color: 'var(--text-primary, #000000)' }}
        >
          {items.map((item, index) => (
            <div key={item._id || item.id}>
              {index + 1}. {item[config.titleField] || getLabel('untitled')} {item[config.artistField] ? `by ${item[config.artistField]}` : `by ${getLabel('unknownArtist')}`} 
              {item[config.yearField] && ` (${item[config.yearField]})`}
              {item[config.seriesField] && ` [${getLabel('series')}: ${item[config.seriesField]}]`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GenericReorderLayout;
