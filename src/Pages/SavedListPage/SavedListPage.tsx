import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import SavedLabelCard from "../../Components/SavedLabelCard/SavedLabelCard";
import { isAuthenticated } from "../../Utils/Auth/AuthUtil";
import "./Pagination.css";
import "./SavedListPage.css";

const SavedListPage = () => {
  const [fetching, setFetching] = useState(true);

  const listContainer = useRef<HTMLDivElement>(null);

  // Constant for the number of labels per page
  const labelsPerPage = 5;
  // State for the list of labels and the current page
  const [labels, setLabels] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  // Calculate the total number of pages
  const pageCount = Math.ceil(labels.length / labelsPerPage);
  // Calculate the labels to be displayed on the current page
  const currentLabels = labels.slice(
    currentPage * labelsPerPage,
    (currentPage + 1) * labelsPerPage,
  );
  // Function to handle page change
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    scrollToTop();
  };

  const scrollToTop = () => {
    if (listContainer.current) {
      listContainer.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) navigate("/settings");
  }, []);

  // Effect for fetching labels data
  useEffect(() => {
    if (process.env.REACT_APP_ACTIVATE_USING_JSON == "true") {
      fetch("/label_list.json")
        .then((response) => response.json())
        .then((data) => {
          setLabels(data);
          setFetching(false);
        });
    } else {
      fetch(process.env.VITE_API_URL + "/inspections", {
        headers: {
          Authorization:
            "Basic " + document.cookie.split("auth=")[1].split(";")[0],
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            setLabels([]);
          } else {
            setLabels(data);
          }
          setFetching(false);
        });
    }
  }, []);

  return (
    <div className="saved-label-list" ref={listContainer}>
      {/* Display the current labels */}
      {currentLabels.length > 0 &&
        currentLabels.map((label, index) => (
          <SavedLabelCard key={index} label={label} />
        ))}
      {currentLabels.length == 0 && !fetching && (
        <p className={"center full-width"}>No labels found</p>
      )}
      {/* Pagination Container */}
      <div className="pagination-container">
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item previous"
          previousLinkClassName="page-link"
          nextClassName="page-item next"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default SavedListPage;
