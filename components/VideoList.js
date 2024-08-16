import Masonry from 'react-masonry-css';
import VideoCard from './VideoCard';

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1, // changed to 1 column for mobile
};

const VideoList = ({ videos, lastVideoElementRef }) => {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {videos.map((video, index) => {
        if (videos.length === index + 1) {
          return <VideoCard key={video._id} video={video} ref={lastVideoElementRef} />;
        } else {
          return <VideoCard key={video._id} video={video} />;
        }
      })}
    </Masonry>
  );
};


export default VideoList;
