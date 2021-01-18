import React from "react";

import { rewriteUrlWithPagination } from "./pagination.query.utils";
import { PaginationControl, Spacer } from "./pagination.styles";

const Pagination = ({ apiObject, handlePagination }) => {
  const isDisabled = (paginationLink) => {
    if (paginationLink !== null && !apiObject.transaction) return "";
    return "disabled";
  };

  const paginationWrapper = (direction) => {
    if (!direction || apiObject.transaction) return;
    rewriteUrlWithPagination(direction);
    handlePagination(direction);
  };

  // TODO: add a router to this component, and push state to add a page offset query string

  if (
    isDisabled(apiObject.previous) !== "" &&
    isDisabled(apiObject.next) !== ""
  ) {
    return <Spacer data-testid="spacer" />;
  }

  return (
    <PaginationControl>
      <ul className="pagination">
        <li className={`page-item ${isDisabled(apiObject.previous)}`}>
          <div
            data-testid="previous"
            onClick={() => paginationWrapper(apiObject.previous)}
            className="page-link"
          >{`\u{25C0}`}</div>
        </li>
        <li className={`page-item ${isDisabled(apiObject.next)}`}>
          <div
            data-testid="next"
            onClick={() => paginationWrapper(apiObject.next)}
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
