const getIndexById = <T extends { id: string }>(arr: T[], id: string) => {
  let indexOfItem: number;
  arr.forEach((item, index) => {
    if (item.id === id) {
      indexOfItem = index;
    }
  });
  return indexOfItem;
};
export { getIndexById };
