import React from 'react';
import './ListItem.scss';

function ListItem(props) {
  const { listData, songInfoActive, addQueueList, formatNumber, numberOrder, itemsPerPage} = props;
  return (
    <>
      {listData &&
          listData.map((element, i) => {
            return (
              <div
                className={`list-item ${songInfoActive?.id && songInfoActive?.id === element?.id ? 'active-click' : '' } ${songInfoActive?.youtubeId && songInfoActive?.youtubeId === element?.youtubeId ? 'playing' : ''}`}
                key={i}
                onClick={(event) => addQueueList(event, element)}
              >
                <div>
                  <div className="list-item--icon">
                    {numberOrder > 0
                      ? formatNumber(numberOrder * itemsPerPage + i + 1)
                      : formatNumber(i + 1)}
                  </div>
                  <div className="list-item--thumb">
                    <img
                      src={element?.snippet?.thumbnails?.high?.url || element.audioThumb}
                      alt={element?.snippet?.channelTitle || element.name}
                    />
                  </div>
                  <div className="list-item--name">
                    <div>{element?.snippet?.title || element.name}</div>
                    <div>{element?.snippet?.channelTitle || element.authorName}</div>
                  </div>
                </div>
              </div>
            );
          })}
    </>
  );
}

export default ListItem;