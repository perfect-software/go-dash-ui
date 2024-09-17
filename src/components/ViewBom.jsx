import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAgGridSecond from "../features/CustomAgGridSecond";
import { fetchAllBom } from "../reducer/bomSlice";
import { SAMPLE_REQUEST_IMAGE_PATH } from "../features/url";
import { formatDDMMYYYYDate } from "../features/convertDate";
import Cross from "../assets/cross.svg";
import BomDetailsPopup from "../popups/BomDetailsPopup";
import styles from "../styles/viewDetails.module.css";
import inputStyles from "../styles/inputDetails.module.css";
const ViewBom = ({ onBOMSelect ,handleEditClick,handleViewPDF}) => {
  const dispatch = useDispatch();
  const [bomDetailsPopup,setBomDetailsPopup] = useState(false);
  const [bomId, setBomId] = useState('');
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const { bom, loaded, loading, error } = useSelector(
    (state) => state.bom
  );

  useEffect(() => {
    dispatch(fetchAllBom());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteBom(id));
  };

  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    onBOMSelect(selectedData.length > 0 ? selectedData : null);
  };
  const dateFilterParams = {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      if (!cellValue) return -1;
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
   const actionButton = (params) => {
    setBomId(params);
     setBomDetailsPopup(true);
    console.log(params);
  };

  const columnDefs = [
    { headerName: "Edit",  field:'edit' , maxWidth: 80,
    checkboxSelection: true,
    showDisabledCheckboxes: true},
    { headerName: "SR No.", width:150, field: "srno", sortable: true, filter: true },
    {
      headerName: "BOM Type",
      field: "bomType",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "BOM Status",
      field: "bomStatus",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Created By",
      field: "createdBy",
      sortable: true,
      width:125,
      filter: true,
    },
    {
      headerName: "Approved By",
      field: "bomApprovedBy",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Date",
      field: "entDate",
      sortable: true,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      width:140,
  
    },
    {
        headerName: "BOM Details",
        field:'bomId',
        width:120,
        cellRenderer: function (params) {
          return (
            <div style={{
              height: '100%', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center' 
            }}>
              <button className={styles.viewButton}
                onClick={() => actionButton(params.value)}
              >
                View{" "}
              </button>
            </div>
          );
        },
  
     
      },
  ];
  return (
    <>
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data: {error}</p>
      ) : (
        <CustomAgGridSecond
          columnDefs={columnDefs}
          rowData={bom}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          handlePrintClick={handleViewPDF}
          onRowSelect={onRowSelected}
          deleteEnabled={true}
          editEnabled={true}
          pagination={true}
        />
      )}
    </div>
    {isImagePopup && (
        <div className={inputStyles.popupOverlay}>
          <div className={inputStyles.imagePopupContent}>
            <img
              src={`${SAMPLE_REQUEST_IMAGE_PATH}${imagePreview}`}
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
 {bomDetailsPopup && (<BomDetailsPopup bomId={bomId && bomId} onCancel={()=> setBomDetailsPopup(false)} />)}
    </>
  );
};

export default ViewBom;
