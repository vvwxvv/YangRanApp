import { 
  DndContext, 
  closestCenter, 
  useSensors, 
  useSensor, 
  PointerSensor, 
  KeyboardSensor,
  DragOverlay
} from '@dnd-kit/core';
import { 
  SortableContext, 
  rectSortingStrategy 
} from '@dnd-kit/sortable';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import DraggableImage from '@/components/images/DraggableImage';

export const DragDropImageGridLayout = ({ images = [], onDragEnd, isCn = false }) => {
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoize sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, { context }) => {
        // Add keyboard navigation support
        if (event.code === 'Space' || event.code === 'Enter') {
          return context.active.rect.current.translated;
        }
      },
    })
  );

  // Memoize image items to prevent unnecessary re-renders
  const imageItems = useMemo(() => 
    images.map((image) => image._id).filter(Boolean),
    [images]
  );

  // Get active image for drag overlay
  const activeImage = useMemo(() => 
    activeId ? images.find(image => image._id === activeId) : null,
    [activeId, images]
  );

  // Safe state updates with mounted check
  const safeSetState = useCallback((setter) => {
    if (mountedRef.current) {
      setter();
    }
  }, []);

  const handleDragStart = useCallback((event) => {
    safeSetState(() => setActiveId(event.active.id));
  }, [safeSetState]);

  const handleDragOver = useCallback((event) => {
    safeSetState(() => setOverId(event.over ? event.over.id : null));
  }, [safeSetState]);

  const handleDragCancel = useCallback(() => {
    safeSetState(() => {
      setActiveId(null);
      setOverId(null);
    });
  }, [safeSetState]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    // Clear states with a small delay to prevent race conditions
    timeoutRef.current = setTimeout(() => {
      safeSetState(() => {
        setActiveId(null);
        setOverId(null);
      });
    }, 100);

    // Early return if no valid drop target or same position
    if (!over || active.id === over.id || !onDragEnd) {
      return;
    }

    try {
      // Find indices with validation
      const sourceIndex = images.findIndex(image => image?._id === active.id);
      const destinationIndex = images.findIndex(image => image?._id === over.id);

      // Validate indices
      if (sourceIndex === -1 || destinationIndex === -1) {
        console.warn('Invalid drag operation: source or destination not found');
        return;
      }

      // Validate array bounds
      if (sourceIndex < 0 || sourceIndex >= images.length || 
          destinationIndex < 0 || destinationIndex >= images.length) {
        console.warn('Invalid drag operation: indices out of bounds');
        return;
      }

      // Call onDragEnd with comprehensive event structure
      onDragEnd({
        active,
        over,
        source: { 
          index: sourceIndex,
          item: images[sourceIndex]
        },
        destination: { 
          index: destinationIndex,
          item: images[destinationIndex]
        }
      });
    } catch (error) {
      console.log('Error in drag end handler:', error);
    }
  }, [images, onDragEnd, safeSetState]);

  // Grid styles with responsive design
  const gridStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '10px',
    backgroundColor: 'transparent',
    borderRadius: '12px',
    padding: '12px',
    border: '1px solid #eee',
    minHeight: '200px', // Prevent layout shift
    width: '100%',
    boxSizing: 'border-box',
    // Add smooth transitions
    transition: 'all 0.2s ease-in-out',
  }), []);

  // Early return for empty or invalid images
  if (!Array.isArray(images) || images.length === 0) {
    return (
      <div style={gridStyles}>
        <div style={{ 
          gridColumn: '1 / -1', 
          textAlign: 'center', 
          color: '#666',
          padding: '2rem',
          fontSize: '14px'
        }}>
          No images to display
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      // Add accessibility
      accessibility={{
        announcements: {
          onDragStart: ({ active }) => `Picked up image ${active.id}`,
          onDragOver: ({ active, over }) => 
            over ? `Image ${active.id} is over ${over.id}` : `Image ${active.id} is no longer over a droppable area`,
          onDragEnd: ({ active, over }) => 
            over ? `Image ${active.id} was dropped over ${over.id}` : `Image ${active.id} was dropped`,
          onDragCancel: ({ active }) => `Dragging was cancelled. Image ${active.id} was dropped`,
        },
      }}
    >
      <SortableContext
        items={imageItems}
        strategy={rectSortingStrategy}
      >
        <div style={gridStyles}>
          {images.map((image, index) => {
            // Validate image object
            if (!image || !image._id) {
              console.warn(`Invalid image at index ${index}:`, image);
              return null;
            }

            return (
              <DraggableImage
                key={image._id}
                image={image}
                index={index}
                isCn={isCn}
                isOver={overId === image._id}
                isDragging={activeId === image._id}
              />
            );
          })}
        </div>
      </SortableContext>
      
      {/* Drag overlay for better UX */}
      <DragOverlay
        adjustScale={true}
        style={{
          cursor: 'grabbing',
        }}
      >
        {activeImage && (
          <DraggableImage
            image={activeImage}
            index={-1}
            isCn={isCn}
            isOver={false}
            isDragging={true}
            isOverlay={true}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

// Add prop types for better development experience (optional)
DragDropImageGridLayout.displayName = 'DragDropImageGridLayout';

export default DragDropImageGridLayout;