export function uniq<T>(a: T[]) {
    var seen = {};
    return a.filter(function (item) {
        // const hash =
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
