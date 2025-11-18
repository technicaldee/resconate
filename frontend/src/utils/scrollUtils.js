// Scroll utility functions
export const smoothScrollTo = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export const handleAnchorClick = (e, targetId, offset = 80) => {
  e.preventDefault();
  smoothScrollTo(targetId, offset);
};

