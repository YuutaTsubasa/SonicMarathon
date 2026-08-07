export type DomainSuccess<T> = Readonly<{ ok: true; value: T }>;
export type DomainFailure = Readonly<{ ok: false; error: string }>;
export type DomainResult<T> = DomainSuccess<T> | DomainFailure;

export const createDomainSuccess = <T>(value: T): DomainSuccess<T> => ({ ok: true, value });

export const createDomainFailure = (error: string): DomainFailure => ({ ok: false, error });

export const isDomainFailure = <T>(result: DomainResult<T>): result is DomainFailure => !result.ok;
