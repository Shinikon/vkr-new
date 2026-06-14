import React from "react";

const LoadMoreTrigger = React.forwardRef(({ loading }, ref) => {
  return (
    <div ref={ref} className="load-more-trigger">
      {loading && (
        <div className="loading-more">
          <div className="loading-spinner-small"></div>
          <p>Загрузить ещё...</p>
        </div>
      )}
    </div>
  );
});

LoadMoreTrigger.displayName = "LoadMoreTrigger";

export default LoadMoreTrigger;
