import { FilterTag } from "../../configuration/backend";

export const calculateTitle = (title) => {
  const regex = /\(.*\)/gi;
  const filter = new URLSearchParams(window.location.search);
  const filter_tag = filter.get(FilterTag);
  if (filter_tag) return title.replace(regex, `(${filter_tag})`);
  return title;
};
