export const dragHandler = (el: HTMLElement, move?: () => void) => {
  let currentTranslate = { x: 0, y: 0 };
  let initialTranslate = { x: 0, y: 0 };
  let initialClientPosition = { x: 0, y: 0 };

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const { clientX: moveX, clientY: moveY } = moveEvent;
    const deltaX = moveX - initialClientPosition.x + initialTranslate.x;
    const deltaY = moveY - initialClientPosition.y + initialTranslate.y;

    currentTranslate = { x: deltaX, y: deltaY };

    el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    move?.();
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: MouseEvent) => {
    initialClientPosition = { x: e.clientX, y: e.clientY };
    initialTranslate = { x: currentTranslate.x, y: currentTranslate.y };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  el.addEventListener('mousedown', handleMouseDown);

  return handleMouseUp;
};
