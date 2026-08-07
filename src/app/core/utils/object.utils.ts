export function removeEmptyProperties<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => 
            value != null && value != undefined && value != ''
        )
    ) as Partial<T>;
}