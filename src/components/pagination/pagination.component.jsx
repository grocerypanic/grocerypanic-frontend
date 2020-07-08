import React from "react";

import { PaginationControl } from "./pagination.styles";

const Pagination = ({ apiObject, handlePagination }) => {
  const isDisabled = (condition) => {
    if (condition !== null) return "";
    return "disabled";
  };

  return (
    <PaginationControl>
      <ul className="pagination">
        <li className={`page-item ${isDisabled(apiObject.previous)}`}>
          <div
            data-testid="previous"
            onClick={() => handlePagination(apiObject.previous)}
            className="page-link"
          >{`\u{25C0}`}</div>
        </li>
        <li className={`page-item ${isDisabled(apiObject.next)}`}>
          <div
            data-testid="next"
            onClick={() => handlePagination(apiObject.next)}
            className="page-link"
          >
            {" "}
            {`\u{25B6}`}{" "}
          </div>
        </li>
      </ul>
    </PaginationControl>
  );
};

export default Pagination;
