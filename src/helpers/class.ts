export const classNames = (...classes: (string | boolean)[]) => {
    return classes.filter(Boolean).join(' ');
};
