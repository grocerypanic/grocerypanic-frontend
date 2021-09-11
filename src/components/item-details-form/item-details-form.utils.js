import { ShelfLifeConstants } from "../../configuration/backend";

const defaultName = (objectList) => {
  if (objectList.length > 0) return objectList[0].name;
  return "";
};

const defaultId = (objectList) => {
  if (objectList.length > 0) return objectList[0].id;
  return "";
};

export const normalizeNameArray = (idList, objectList) => {
  return objectList.filter((o) => idList.includes(o.id));
};

export const normalizeName = (id, objectList) => {
  const search = objectList.find((o) => o.id === id);
  if (search) return search.name;
  return defaultName(objectList);
};

export const normalizeId = (name, objectList) => {
  const search = objectList.find((o) => o.name === name);
  if (search) return search.id;
  return defaultId(objectList);
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
