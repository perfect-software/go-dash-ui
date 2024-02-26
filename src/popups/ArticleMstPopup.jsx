import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import inputStyles from "../styles/inputDetails.module.css";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";
import { fetchAllArticleMst } from "../reducer/articleMstSlice";
import { useDispatch, useSelector } from "react-redux";
import { ARTICLE_IMAGE_PATH } from "../features/url";

const ArticleMstPopup = ({ onCancel, onSubmitArticleData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [rowSelect, setRowSelect] = useState(false);
  const dispatch = useDispatch();
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);

  const { articleMst, loaded, loading, error } = useSelector(
    (state) => state.articleMst
  );
  const [gridApi, setGridApi] = useState(null);
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    if (!loaded && !loading) {
      dispatch(fetchAllArticleMst());
    }
  }, [loaded, loading, dispatch]);
  
  useEffect(() => {
    if (gridApi) {
      if (loading) {
        gridApi.showLoadingOverlay();
      } else if (error) {
        gridApi.showNoRowsOverlay();
      } else if (loaded && articleMst.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, loaded, loading, error, articleMst]);


  const columnDefs = [
  { headerName: "Edit",  field:'edit' , maxWidth: 150,
     checkboxSelection: true,
     showDisabledCheckboxes: true},
    { headerName: "Article No",  width:200, field: "articleNo", sortable: true, filter: true },
    {
      headerName: "Last No",
      field: "lastNo",
      sortable: true,
      width:200,
      filter: true,
    },

  ];
  const onCellKeyDown = useCallback((e) => {
    if (!e.event) {
      return;
    }
    const keyboardEvent = e.event;
    const key = keyboardEvent.key;
    if (key.length) {
      if (key === 'Enter') {
        var rowNode = e.node;
        var newSelection = !rowNode.isSelected();
        rowNode.setSelected(newSelection);
      }
    }
  }, []);
  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    setRowSelect(selectedData.length > 0);
    setSelectedArticle(selectedData);

  };

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Article MST</h1>
              <img
                onClick={() => {
                  setIsPopupVisible(false);
                  onCancel();
                }}
                src={Cross}
                alt="Select Icon"
                className={styles.crossIcon}
              />
            </div>
            <div
              className={`ag-theme-quartz ${styles.agThemeQuartz}`}
              style={{ height: 550, width: "100%", marginTop: "5px" }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={articleMst}
                pagination={true}
                paginationPageSize={12}
                paginationPageSizeSelector={[10, 12, 20, 50, 100]}
                animateRows={true}
                filter={true}
                onCellKeyDown={onCellKeyDown}
                onGridReady={onGridReady}
                onSelectionChanged={onRowSelected}
                overlayLoadingTemplate={
                  '<span class="ag-overlay-loading-center">Loading...</span>'
                }
                overlayNoRowsTemplate={
                  `<span class="ag-overlay-loading-center">${error ? 'Failed to load data' : 'No data found'}</span>`
                }
              />
            </div>
          </div>


          <div className={styles.bottomButtonContainer}>
           
            <button
           disabled={!rowSelect}
              className={styles.selectPopupButton}
              onClick={() => {
                onSubmitArticleData(selectedArticle);
              }}
            >
              Select
            </button>
          </div>
        </div>
        {isImagePopup && (
        <div className={inputStyles.popupOverlay}>
          <div className={inputStyles.imagePopupContent}>
            <img
              src={`${ARTICLE_IMAGE_PATH}${imagePreview}`}
              className={inputStyles.imagepreviewPopup}
              alt=""
            />
            <img
              onClick={() => {
                setIsImagePopup(false);
              }}
              src={Cross}
              alt="Select Icon"
              className={inputStyles.crossIcon}
            />
          </div>
        </div>
      )}
      </div>
      
    )
  );
};

export default ArticleMstPopup;
