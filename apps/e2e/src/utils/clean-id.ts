export function cleanId(id: string) {
  return id.replace('~u', '');
}

export function idObjectToArray(obj: Record<string, any>, newId: string) {
  return Object.values(obj).map((item) => {
    item[':id'] = newId;
    return item;
  });
}
