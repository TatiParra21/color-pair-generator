import Pagination from "rc-pagination"
import "rc-pagination/assets/index.css"

export const PaginationComp = ({currentPage,pageSize,total,setCurrentPage}:{currentPage: number,pageSize:number,total:number, setCurrentPage:(page:number)=>void}) => {
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