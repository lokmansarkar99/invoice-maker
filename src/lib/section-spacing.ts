export function sectionClasses(compact?: boolean) {
  return compact ? "py-8 md:py-10 px-6" : "py-12 md:py-16 px-6";
}

export function sectionHeaderClasses(compact?: boolean) {
  return compact ? "text-center mb-8 md:mb-10" : "text-center mb-12 md:mb-16";
}

export function sectionPageWrapperClasses(compact?: boolean) {
  return compact ? "scroll-mt-28" : "pt-28 pb-12 min-h-[85vh]";
}
