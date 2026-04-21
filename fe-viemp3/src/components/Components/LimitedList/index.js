import React, { useState } from 'react';

function LimitedList({
  items = [],
  renderItem,
  limit = 6,
  showAllText = 'Hiện tất cả',
  showLessText = 'Ẩn bớt',
  wrapInRow = true,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? items : items.slice(0, limit);

  return (
    <div>
      {wrapInRow ? (
        <div className="row">{displayedItems.map((item, index) => renderItem(item, index))}</div>
      ) : (
        <>{displayedItems.map((item, index) => renderItem(item, index))}</>
      )}

      {items.length > limit && (
        <div className="text-center mt-3">
          <button className="btn btn-outline-light" onClick={() => setShowAll(!showAll)}>
            {showAll ? showLessText : showAllText}
          </button>
        </div>
      )}
    </div>
  );
}

export default LimitedList;
