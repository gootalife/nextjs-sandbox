export const useData = <T,>(data: T, fetcher: Promise<T | void>): T => {
  if (!data) {
    throw fetcher
  }
  return data
}
