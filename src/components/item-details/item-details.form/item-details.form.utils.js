import { ShelfLifeConstants } from "../../../configuration/backend";

export const normalizeNameArray = (idList, objectList) => {
  return objectList.filter((o) => idList.includes(o.id));
};

export const normalizeShelfName = (id, objectList) => {
  const search = objectList.find((o) => o.id === id);
  if (search) return search.name;
  return null;
};

export const normalizeShelfId = (name, objectList) => {
  const search = objectList.find((o) => o.name === name);
  if (search) return search.id;
  return null;
};

export const normalizeShelfLifeName = (value) => {
  const search = ShelfLifeConstants.find((o) => o.id === value);
  if (search) return search.name;
  return `${value} Days`;
};

export const normalizeShelfLifeId = (value, defaultValue) => {
  const search = ShelfLifeConstants.find((o) => o.name === value);
  if (search) return search.id;
  return defaultValue;
};
