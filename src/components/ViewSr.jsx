import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAgGridSecond from "../features/CustomAgGridSecond";
import { fetchAllSamples } from "../reducer/sampleSlice";
import { SAMPLE_REQUEST_IMAGE_PATH } from "../features/url";
import { formatDDMMYYYYDate } from "../features/convertDate";

const ViewSr = ({ onSampleSelect, handleEditClick, handlePrintClick, isEditSelected }) => {
  const dispatch = useDispatch();
  const { samples, loading, error } = useSelector((state) => state.sample);

  useEffect(() => {
    dispatch(fetchAllSamples());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteSample(id));
  };

  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    onSampleSelect(selectedData.length > 0 ? selectedData : null);
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
  const columnDefs = [
    {
      headerName: "Select",
      field: "select",
      maxWidth: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },
    {
      headerName: "SR No.",
      width: 150,
      field: "sr_no",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Date of Order",
      field: "dateOfOrder",
      sortable: true,
      width: 150,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    // {
    //   headerName: "Username",
    //   field: "username",
    //   sortable: true,
    //   width:130,
    //   filter: true,
    // },
    {
      headerName: "SR Image",
      field: "image_nm",
      width: 150,
      filter: true,
      cellRenderer: (params) => {
        return params.value ? (
          <img
            src={`${SAMPLE_REQUEST_IMAGE_PATH}${params.value}`}
            alt="Image"
            style={{ height: "50px", width: "50px" }}
            onClick={() => actionButton(params)}
          />
        ) : (
          "No Image"
        );
      },
    },
    {
      headerName: "Buyer",
      field: "buyer.bsName",
      sortable: true,
      width: 300,
      filter: true,
    },
    {
      headerName: "Article No",
      field: "articleNo",
      sortable: true,
      width: 125,
      filter: true,
    },
    {
      headerName: "Upper Color",
      field: "upperColor",
      sortable: true,
      width: 140,
      filter: true,
    },
    {
      headerName: "Lining Color",
      field: "liningColor",
      sortable: true,
      width: 140,
      filter: true,
    },
    {
      headerName: "Last",
      width: 140,
      field: "last",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Sample Type",
      width: 150,
      field: "sampleType",
      sortable: true,
      filter: true,
    },

    {
      headerName: "Season",
      width: 110,
      field: "season",
      sortable: true,
      filter: true,
    },

    {
      headerName: "Sample Refrence",
      width: 170,
      field: "sampleRef",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Buyer Article",
      field: "buyerArticle",
      sortable: true,
      width: 150,
      filter: true,
    },

    {
      headerName: "Size",
      field: "size",
      sortable: true,
      width: 100,
      filter: true,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      sortable: true,
      width: 120,
      filter: true,
    },
    {
      headerName: "Pair",
      field: "pair",
      sortable: true,
      width: 100,
      filter: true,
    },
    {
      headerName: "Insole",
      width: 140,
      field: "insole",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Sole Label",
      field: "soleLabel",
      sortable: true,
      width: 140,
      filter: true,
    },
    {
      headerName: "Socks",
      field: "socks",
      sortable: true,
      width: 130,
      filter: true,
    },
    {
      headerName: "Heel",
      field: "heel",
      sortable: true,
      width: 130,
      filter: true,
    },
    {
      headerName: "Pattern",
      field: "pattern",
      width: 140,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Buyer Refrence",
      field: "buyerRef",
      sortable: true,
      width: 160,
      filter: true,
    },
    {
      headerName: "Upper Leather",
      field: "inUpperLeather",
      width: 160,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Internal Lining",
      field: "inLining",
      sortable: true,
      width: 160,
      filter: true,
    },
    {
      headerName: "Internal Socks",
      field: "inSocks",
      sortable: true,
      width: 160,
      filter: true,
    },
    {
      headerName: "Internal Quantity",
      field: "inQuantity",
      sortable: true,
      width: 180,
      filter: true,
    },
    {
      headerName: "Comments",
      field: "comments",
      width: 250,
      sortable: true,
      filter: true,
    },

    {
      headerName: "Delivery Date",
      field: "deliveryDate",
      sortable: true,
      width: 150,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "ProdEx Date",
      field: "prodExDate",
      sortable: true,
      width: 150,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },

    {
      headerName: "Financial Year",
      field: "finYear",
      width: 150,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Internal Ref",
      field: "internal_ref",
      width: 200,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Leather Remark",
      field: "leather_remark",
      width: 200,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Sole Remark",
      field: "sole_remark",
      width: 200,
      sortable: true,
      filter: true,
    },
  ];
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data: {error}</p>
      ) : (
        <CustomAgGridSecond
          columnDefs={columnDefs}
          rowData={samples}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          handlePrintClick={handlePrintClick}
          onRowSelect={onRowSelected}
          deleteEnabled={false}
          editEnabled={true}
          pagination={true}
        />
      )}
    </div>
  );
};

export default ViewSr;
