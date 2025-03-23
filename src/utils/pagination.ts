interface Pagination {
  list: any
  total: number
  pageNum: number
}
export function resetPagination(pagination: Pagination) {
  pagination.list = []
  pagination.total = 0
  pagination.pageNum = 1
}
