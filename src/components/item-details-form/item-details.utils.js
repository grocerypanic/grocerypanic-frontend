import { ShelfLifeConstants } from "../../configuration/backend";

// Normalize API Data to Work With UI Components

export const normalizeNameArray = (idList, objectList) => {
  return objectList.filter((o) => idList.includes(o.id));
};

export const normalizeName = (id, objectList) => {
  const search = objectList.find((o) => o.id === id);
  if (search) return search.name;
  return "";
};

export const normalizeId = (name, objectList) => {
  const search = objectList.find((o) => o.name === name);
  if (search) return search.id;
  return "";
};

export const normalizeShelfLifeName = (value) => {
  const search = ShelfLifeConstants.find((o) => o.id === value);
  if (search) return search.name;
  return `${value} Days`;
};
