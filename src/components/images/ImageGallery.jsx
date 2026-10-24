import { motion, AnimatePresence } from "framer-motion";
import ImageCard from '@/components/pages/manager/image/ImageCard';
import VideoCard from '@/components/pages/manager/video/VideoCard';
import ImageListRowWithActions from '@/components/pages/manager/image/ImageListRowWithActions';
import VideoListRowWithActions from '@/components/pages/manager/video/VideoListRowWithActions';

const ImageGallery = ({ 
    images, 
    viewMode, 
    expandedCards, 
    onToggle, 
    onEdit, 
    onDelete, 
    isCn, 
    loadingId, 
    onListRowHover
  }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <div className="relative">
        <AnimatePresence>
          {viewMode === 'grid' ? (
            <div
              className="grid gap-6 w-full"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                justifyItems: 'center',
              }}
            >
              {images.map(item => (
                <div key={item._id} className="w-full max-w-4xl">
                  {item.video_url ? (
                    <VideoCard
                      video={item}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      expanded={expandedCards.has(item._id)}
                      onToggle={onToggle}
                      isCn={isCn}
                      loadingId={loadingId}
                    />
                  ) : (
                    <ImageCard
                      image={item}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      expanded={expandedCards.has(item._id)}
                      onToggle={onToggle}
                      isCn={isCn}
                      loadingId={loadingId}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {images.map(item => (
                item.video_url ? (
                  <VideoListRowWithActions
                    key={item._id}
                    video={item}
                    isCn={isCn}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    loadingId={loadingId}
                    onHover={onListRowHover ? (hovered => onListRowHover(hovered ? item._id : null)) : undefined}
                  />
                ) : (
                  <ImageListRowWithActions
                    key={item._id}
                    image={item}
                    isCn={isCn}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    loadingId={loadingId}
                    onHover={onListRowHover ? (hovered => onListRowHover(hovered ? item._id : null)) : undefined}
                  />
                )
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  export default ImageGallery;