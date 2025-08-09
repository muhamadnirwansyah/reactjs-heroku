export interface Pagination<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}