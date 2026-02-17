import Pagination from "rc-pagination"
import "rc-pagination/assets/index.css"
import { useShallow } from "zustand/shallow"
import { paginationStore, type PaginationStoreType } from "../store/projectStore"
export const PaginationComp = () => {
  const { currentPage, pageSize, total, setCurrentPage } = paginationStore(useShallow((state: PaginationStoreType) => ({
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    total: state.total,
    setCurrentPage: state.setCurrentPage
  })))
  return (
    <div className="pagination-div flex align-self">
      <Pagination
        current={currentPage}           // current active page
        pageSize={pageSize}             // items per page
        total={total}              // total items
        onChange={(page) => setCurrentPage(page)} // runs when user clicks page
      />
    </div>
  )
}