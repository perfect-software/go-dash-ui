import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/articlePopup.module.css";
import Cross from "../assets/cross.svg";
import { getApiService } from "../service/apiService";

const ArticlePopup = ({ onCancel, onSubmitArticleData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [rowSelect, setRowSelect] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  const fetchAllBuyers = async () => {
    const url = "article/getArticle";
    try {
      const response = await getApiService(url);
      setBuyers(response);
     
    } catch (error) {
      console.error("Failed to Article", error);
    }
  };

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);

    fetchAllBuyers();
  }, []);

  const onRowDataChanged = useCallback(() => {
    if (gridApi) {
      gridApi.hideOverlay();
    }
  }, [gridApi]);

  const dateFilterParams = {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      if (!cellValue) return -1;
      console.log(filterLocalDateAtMidnight);
      const formattedCellValue = formatDDMMYYYYDate(cellValue);
      const formattedFilterDate = filterLocalDateAtMidnight
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");
      if (formattedCellValue < formattedFilterDate) {
        return -1;
      } else if (formattedCellValue > formattedFilterDate) {
        return 1;
      }
      return 0;
    },
  };
  const columnDefs = [
    { headerName: "Select", maxWidth: 80, checkboxSelection: true },
    { headerName: "Article No",  width:150, field: "articleName", sortable: true, filter: true },
    {
      headerName: "Animal",
      field: "animal",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Color",
      field: "color",
      sortable: true,
      width:130,
      filter: true,
    },
    { headerName: "Gender",  width:110, field: "gender", sortable: true, filter: true },
    {
      headerName: "Sole Type",
      field: "soleType",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Toe Shape",
      field: "toeShape",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Category",
      field: "category",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Platform Type",
      field: "platformType",
      sortable: true,
      filter: true,
      width:150,
    },
    {
      headerName: "Platform No",
      field: "platformNo",
      sortable: true,
      width:150,
      filter: true,
    },
    {
      headerName: "Heel Type",
      field: "heelType",
      width:140,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Heel No",
      field: "heelNo",
      width:140,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Heel Height",
      field: "heelHeight",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Last No",
      field: "lastNo",
      width:140,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Lining Material",
      field: "liningMaterial",
      sortable: true,
      width:160,
      filter: true,
    },
    {
      headerName: "Socks Material",
      field: "socksMaterial",
      sortable: true,
      width:160,
      filter: true,
    },
    {
      headerName: "Comment",
      field: "comment",
      sortable: true,
      width:250,
      filter: true,
    },
    {
      headerName: "User Name",
      field: "username",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Entry Date",
      field: "entDate",
      sortable: true,
      width:150,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
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
        <div className={styles.articlePopupContainer}>
          <div className={styles.toparticlePopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Article Directory</h1>
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
              style={{ height: 600, width: "100%", marginTop: "10px" }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={buyers}
                pagination={true}
                paginationPageSize={12}
                paginationPageSizeSelector={[10, 12, 20, 50, 100]}
                animateRows={true}
                filter={true}
                onCellKeyDown={onCellKeyDown}
                onGridReady={onGridReady}
                onSelectionChanged={onRowSelected}
                onRowDataChanged={onRowDataChanged}
              />
            </div>
          </div>

         
       
          <div className={styles.bottomarticleButtonContainer}>
            <h3>Couldn't find the Article ?</h3>
            <button
              className={styles.articlePopupButton}
              onClick={() => navigate("/articledirectory")}
            >
              Add New Article
            </button>
            <button
           disabled={!rowSelect}
              className={styles.articleSelectPopupButton}
              onClick={() => {
                onSubmitArticleData(selectedArticle);
              }}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ArticlePopup;
