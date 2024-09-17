import React, { useState, useEffect , useCallback} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import Cross from "../assets/cross.svg";
import Back from "../assets/back.png";
import {  formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/viewDetails.module.css";
import inputStyles from "../styles/inputDetails.module.css";
import { fetchAllArticleMst } from "../reducer/articleMstSlice";
import { useDispatch, useSelector } from "react-redux";
import { ARTICLE_IMAGE_PATH } from "../features/url";
import ArticlePopup from "../popups/ArticlePopup";
import ArticleDetailsPopup from "../popups/ArticleDetailsPopup";
import CustomAgGridSecond from "../features/CustomAgGridSecond";


const ViewArticle = ({updateArticle}) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const dispatch = useDispatch();
  const [articleMstId, setArticleMstId] = useState('');
  const [articlePopup,setArticlePopup] = useState(false);
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const { articleMst, loaded, loading, error } = useSelector(
    (state) => state.articleMst
  );
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    dispatch(fetchAllArticleMst());
  }, [dispatch]);

  
  const dateFilterParams = {
    comparator: function(filterLocalDateAtMidnight, cellValue) {
      if (!cellValue) return -1;
      const formattedCellValue = formatDDMMYYYYDate(cellValue);
      const formattedFilterDate = filterLocalDateAtMidnight.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      if (formattedCellValue < formattedFilterDate) {
        return -1;
      } else if (formattedCellValue > formattedFilterDate) {
        return 1;
      }
      return 0;
    }
  };

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
 
  const handleArticleUpdate = (article)=>{
     updateArticle(article);
  }
  const actionButton = (params) => {
    setIsImagePopup(true);
    setImagePreview(params.data.image_nm)
  };
  const viewActionButton = (params) => {
    setArticleMstId(params);
    setArticlePopup(true);
   console.log(params);
 };
  const columnDefsMst = [
    // { headerName: "Edit",  field:'edit' , maxWidth: 80,
    // checkboxSelection: true,
    // showDisabledCheckboxes: true},
    { headerName: "Article No",  width:200, field: "articleNo", sortable: true, filter: true },
    {
      headerName: "Last No",
      field: "lastNo",
      sortable: true,
      width:200,
      filter: true,
    },
    {
      headerName: "Article Details",
      field:'articleMstId',
      width:200,
      cellRenderer: function (params) {
        return (
          <div style={{
            height: '100%', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center' 
          }}>
            <button className={styles.viewButton}
             onClick={() => viewActionButton(params.value)}
            >
              View{" "}
            </button>
          </div>
        );
      },
    },

  ];
  const columnDefs = [
    { headerName: "Edit",  field:'edit' , maxWidth: 80,
    checkboxSelection: true,
    showDisabledCheckboxes: true},
    
    { headerName: "Article No",  width:150, field: "articleName", sortable: true, filter: true },
    {
      headerName: "Animal",
      field: "animal",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Article Image",
      field: "image_nm",
      width: 150,
      filter: true,
      cellRenderer: (params) => {
        const imageUrl = `${ARTICLE_IMAGE_PATH}${params.value}`;
          return params.value ? (
          <img
            src={imageUrl}
            alt="Image"
            style={{ height: '50px', width: '50px' }}
            onClick={() => actionButton(params)}
          />
        ): 'No Image';
      },
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
      headerName: "Entry Date",
      field: "entDate",
      sortable: true,
      width:150,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "Go Back",
      field:'goBack',
      width:120,
      cellRenderer: function (params) {
        return (
          <div style={{
            height: '100%', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center' 
          }}>
            <img className={styles.viewButton2}
             src={Back}
             onClick={()=>setArticlePopup(false)}
            >
            </img>
          </div>
        );
      },
    },
  ];


  return (
    <> <div>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error loading data: {error}</p>
    ) : (
      <CustomAgGridSecond
        columnDefs={columnDefsMst}
        rowData={articleMst}
    
        deleteEnabled={false}
        editEnabled={false}
        pagination={true}
      />
    )}
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
       {articlePopup && (
            <ArticleDetailsPopup
              onCancel={() => {
                setArticlePopup(false);
              }}
              articleMstId={articleMstId && articleMstId}
               onSubmitArticleData={handleArticleUpdate}
            />
          )}
 
      </>
  );
};

export default ViewArticle;
