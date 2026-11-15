function matchesFilter(value, filter) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "object") {
    return Object.values(value).some((nestedValue) =>
      matchesFilter(nestedValue, filter),
    );
  }

  return String(value).toLocaleLowerCase().includes(filter);
}

export default matchesFilter;
