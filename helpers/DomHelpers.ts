export function findClassInParent(element, _class) {
  let parent = element.parentElement;
  let parentClass;
  for (let i = 0; i < 10; i++) {
    if (parent == null) return null;

    parentClass = parent.classList;

    if (parentClass.contains(_class)) return parent;
    parent = parent.parentElement;
  }
  return null;
}
