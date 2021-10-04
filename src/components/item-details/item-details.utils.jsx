// Calculate Default Values Based On Query Strings
export const calculateDefaults = (
  queryParams,
  emptyDefault,
  allShelves,
  allStores
) => {
  const preferred_stores = queryParams.get("preferred_stores");
  const shelf = queryParams.get("shelf");

  const return_value = { ...emptyDefault };

  if (preferred_stores) {
    const search_stores = allStores.find(
      (o) => o.id === parseInt(preferred_stores)
    );
    if (search_stores)
      return_value.preferred_stores = [parseInt(preferred_stores)];
  }

  if (shelf) {
    const search_shelves = allShelves.find((o) => o.id === parseInt(shelf));
    if (search_shelves) return_value.shelf = parseInt(shelf);
  }

  return return_value;
};
