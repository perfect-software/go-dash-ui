import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/inputDetails.module.css";
import UpIcon from "../assets/up.svg";
import Upload from "../assets/folder-upload.png";
import BlankImage from "../assets/no-photo.png";
import IButtonIcon from "../assets/iButton.svg";
import ArticlePopup from "../popups/ArticlePopup";
import { useNavigate } from "react-router-dom";
import Cross from "../assets/cross.svg";
import BuyerPopup from "../popups/BuyerPopup";
import ViewSr from "./ViewSr";
import axios from "axios";
import SampleDirPopup from "../popups/SampleDirPopup";
import {
  getApiService,
  postApiService,
  putApiService,
} from "../service/apiService";
import { getformatDate } from "../features/convertDate";
import { useSidebar } from "../context/SidebarContext";
import Downshift from "downshift";
import { fetchAllSamples } from "../reducer/sampleSlice";
import { useDispatch, useSelector } from "react-redux";
import { generatePDF } from "../features/generatePDF";
import { fetchAllArticles } from "../reducer/articleSlice";
import { generateOnSubmitPDF } from "../features/generateOnSubmitPDF";
import InfoPopup from "../popups/InfoPopup";
import ItemHeadPopup from "../popups/ItemHeadPopup";
import { ARTICLE_IMAGE_PATH, SAMPLE_REQUEST_IMAGE_PATH } from "../features/url";

const SampleRequest = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isInfoPopup, setIsInfoPopup] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [sampleType, setSampleType] = useState([]);
  const [articleURL, setArticleURL] = useState(null);
  const [printForm, setPrintForm] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [multipleSelected, setMultipleSelected] = useState(false);
  const [isItemHeadPopup, setIsItemHeadPopup] = useState(false);
  const dispatch = useDispatch();
  const [showSuggestions, setShowSuggestions] = useState({
    buyer: false,
    upperColor: false,
    liningColor: false,
    soleLabel: false,
    season: false,
    pattern: false,
    sampleRef: false,
    articleNo: false,
    sampleType: false,
  });
  const [showInputLoading, setShowInputLoading] = useState({
    buyer: false,
    upperColor: false,
    liningColor: false,
    soleLabel: false,
    season: false,
    pattern: false,
    sampleRef: false,
    articleNo: false,
    sampleType: false,
  });
  const commentTextareaRef = useRef(null);
  const soleRemarkTextareaRef = useRef(null);
  const leatherRemarkTextareaRef = useRef(null);
  const [activeButton, setActiveButton] = useState("details");
  const [buyers, setBuyers] = useState([]);
  const [filteredList, setFilteredList] = useState({
    seasonList: [],
    patternList: [],
    articleNoList: [],
  });
  const [itemForm, setItemForm] = useState({
    year: "",
  });
  const { isCollapsed, toggleNavbar } = useSidebar();
  const [colors, setColors] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [sampleRefrences, setSampleRefrences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [bsId, setBsID] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [isArticleImagePopup, setIsArticleImagePopup] = useState(false);
  const [tempArticleNo, setTempArticeNo] = useState("");
  const [isArticlePopup, setIsArticlePopup] = useState(false);
  const [isBuyerPopup, setIsBuyerPopup] = useState(false);
  const [allowPrint, setAllowPrint] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const initialValidationState = {};
  const [validation, setValidation] = useState(initialValidationState);
  const [isSampleDirPopup, setIsSampleDirPopup] = useState(false);
  const [isEditSelected, setIsEditSelected] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [editSample, setEditSample] = useState(null);
  const [printSrNo, setPrintSrNo] = useState("");
  const { articles, articleLoaded, articleLoading, articleError } = useSelector(
    (state) => state.article
  );
  const [sampleDetailsForm, setSampleDetailsForm] = useState(() => {
    const savedForm = localStorage.getItem("sampleDetailsForm");
    return savedForm
      ? JSON.parse(savedForm)
      : {
          season: "",
          sampleRef: "",
          sampleType: "",
          bsName: "",
          articleNo: "",
          deliveryAddress: "",
          buyerArticle: "",
          size: "",
          quantity: "",
          pair: "",
          upperColor: "",
          liningColor: "",
          last: "",
          insole: "",
          internal_ref: "",
          leather_remark: "",
          sole_remark: "",
          soleLabel: "",
          socks: "",
          dateOfOrder: "",
          heel: "",
          pattern: "",
          buyerRef: "",
          inUpperLeather: "",
          inLining: "",
          inSocks: "",
          inQuantity: "",
          comments: "",
          deliveryDate: "",
          prodExDate: "",
        };
  });
  useEffect(() => {
    const { articleNo, ...formToSave } = sampleDetailsForm;
    localStorage.setItem("sampleDetailsForm", JSON.stringify(formToSave));
  }, [sampleDetailsForm]);
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
    setAllowPrint(false);
    if (allowPrint) {
      resetAllFields();
      setImageUrl("");
      setArticleURL("");
    }
  };

  const autosize = (el) => {
    if (el) {
      el.style.cssText = "height:auto;";
      el.style.cssText = "height:" + el.scrollHeight + "px";
    }
  };

  useEffect(() => {
    const textareas = [
      commentTextareaRef.current,
      soleRemarkTextareaRef.current,
      leatherRemarkTextareaRef.current,
    ];

    const autosizeListener = (event) => autosize(event.target);

    textareas.forEach((textarea) => {
      if (textarea) {
        textarea.addEventListener("keydown", autosizeListener);
      }
    });

    return () => {
      textareas.forEach((textarea) => {
        if (textarea) {
          textarea.removeEventListener("keydown", autosizeListener);
        }
      });
    };
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newValidation = {};

    const requiredFields = [
      "sampleType",
      "bsName",
      "buyerArticle",
      "size",
      "quantity",
      "pair",
      "articleNo",
      "upperColor",
      "liningColor",
      "last",
      "internal_ref",
      "insole",
      "soleLabel",
      "socks",
      "heel",
      "pattern",
      "inUpperLeather",
      "inLining",
      "inSocks",
      "inQuantity",
      "deliveryDate",
      "prodExDate",
    ];

    requiredFields.forEach((field) => {
      if (!sampleDetailsForm[field] || sampleDetailsForm[field].trim() === "") {
        isValid = false;
        newValidation[field] = "invalid";
      } else {
        newValidation[field] = "valid";
      }
    });

    setValidation(newValidation);
    return isValid;
  };
  const handleCreateSampleChange = (e) => {
    const { name, value } = e.target;
    let newFormState = { ...sampleDetailsForm, [name]: value };
    if (name === "prodExDate" && value) {
      const prodExDate = new Date(value);
      const deliveryDate = new Date(prodExDate);
      deliveryDate.setDate(prodExDate.getDate() + 7); // Add 7 days
      const deliveryDateFormatted = deliveryDate.toISOString().split("T")[0];
      newFormState = {
        ...newFormState,
        deliveryDate: deliveryDateFormatted,
      };
    }
    if (name === "quantity" && value.length > 5) {
      return;
    }
    if (name === "size" && value.length > 5) {
      return;
    }
    if (name === "inQuantity" && value.length > 20) {
      return;
    }
    setSampleDetailsForm(newFormState);
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };
  const handleSampleEdit = (sample) => {
    setIsEditSelected(false);
    setMultipleSelected(false);
    setPrintForm([]);
    if (sample) {
      setIsEditSelected(true);
      const sampleArray = Array.isArray(sample) ? sample : [sample];

      if (sampleArray.length > 1) {
        setPrintForm(sampleArray);
        setMultipleSelected(false);
      } else {
        setEditSample(sampleArray[0]);
        setPrintForm(sampleArray);
        setMultipleSelected(true);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditClicked(true);
    setActiveButton("details");
    const { articleNo, articleName, ...restOfEditSample } = editSample;
    setBsID(editSample.buyer?.bs_id);
    const bsName = editSample.buyer?.bsName;
    const billingAddress = editSample.buyer?.billingAddress;
    const deliveryDate = editSample.deliveryDate
      ? getformatDate(editSample.deliveryDate)
      : "";
    const prodExDate = editSample.prodExDate
      ? getformatDate(editSample.prodExDate)
      : "";
    const dateOfOrder = editSample.dateOfOrder
      ? getformatDate(editSample.dateOfOrder)
      : "";

    setSampleDetailsForm({
      ...sampleDetailsForm,
      ...restOfEditSample,
      articleNo: articleName,
      bsName: bsName,
      deliveryAddress: billingAddress,
      deliveryDate: deliveryDate,
      prodExDate: prodExDate,
      dateOfOrder: dateOfOrder,
    });
    setTempArticeNo(articleNo);
  };

  const handlePrintClick = async () => {
    try {
      setLoading(true);
      await generateOnSubmitPDF(printForm);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const [isGridVisible, setIsGridVisible] = useState({
    basic: true,
    internal: true,
    delivery: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [articleImageView, setArticleImageView] = useState(null);

  const handleBuyerInputChange = async (e) => {
    const { name, value } = e.target;
    setSampleDetailsForm({ ...sampleDetailsForm, bsName: value });
    if (value.length >= 3) {
      toggleInputLoaderVisibility("buyer", true);
      const BASE_URL = `sample/getBuyer?input=${encodeURIComponent(value)}`;
      try {
        const fetchedBuyers = await getApiService(BASE_URL);
        setBuyers(fetchedBuyers);
        toggleSuggestVisibility("buyer", true);
        toggleInputLoaderVisibility("buyer", false);
      } catch (error) {
        console.error("Failed to fetch buyers:", error);
      } finally {
        toggleInputLoaderVisibility("buyer", false);
      }
    } else {
      toggleSuggestVisibility("buyer", false);
    }
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };
  useEffect(() => {
    const toggleActiveButton = (event) => {
      if (event.code === "ControlRight") {
        setActiveButton((prevButton) =>
          prevButton === "details" ? "view" : "details"
        );
        if (activeButton === "view" && !isCollapsed) {
          toggleNavbar();
        }
      }
    };
    window.addEventListener("keydown", toggleActiveButton);
    return () => {
      window.removeEventListener("keydown", toggleActiveButton);
    };
  }, [activeButton, isCollapsed, toggleNavbar]);
  const handleCreateColorChange = async (e) => {
    const { name, value } = e.target;
    setSampleDetailsForm({ ...sampleDetailsForm, [name]: value });
    if (value.length >= 2) {
      toggleInputLoaderVisibility(`${name}`, true);
      const BASE_URL = `sample/color/{input}?input=${encodeURIComponent(
        value
      )}`;

      try {
        const fetchedColors = await getApiService(BASE_URL);
        setColors(fetchedColors);
        toggleSuggestVisibility(`${name}`, true);
        toggleInputLoaderVisibility(`${name}`, false);
      } catch (error) {
        console.error("Failed to fetch Colors:", error);
      } finally {
        toggleInputLoaderVisibility(`${name}`, false);
      }
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const handleSampleRefChange = async (e) => {
    const { name, value } = e.target;
    setSampleDetailsForm({ ...sampleDetailsForm, sampleRef: value });
    const encodedInput = encodeURIComponent(value);
    if (value.length >= 1) {
      const BASE_URL = `sample/getSRNO/{bsId}?input=${encodedInput}&bsId=${bsId}`;
      toggleInputLoaderVisibility("sampleRef", true);
      try {
        const fetchedRef = await getApiService(BASE_URL);
        setSampleRefrences(fetchedRef);
        toggleSuggestVisibility("sampleRef", true);
        toggleInputLoaderVisibility("sampleRef", false);
      } catch (error) {
        console.error("Failed to fetch SampleRefs:", error);
      } finally {
        toggleInputLoaderVisibility("sampleRef", false);
      }
    } else {
      toggleSuggestVisibility("sampleRef", false);
    }
  };

  const handleArticleNoSubmit = (selectedArticles) => {
    if (Array.isArray(selectedArticles) && selectedArticles.length > 0) {
      const selectedArticle = selectedArticles[0];
      setSampleDetailsForm({
        ...sampleDetailsForm,
        articleNo: selectedArticle.articleName,
      });
      const articleImageUrl = selectedArticle.image_nm
        ? `${ARTICLE_IMAGE_PATH}${selectedArticle.image_nm}`
        : null;
      setArticleImageView(articleImageUrl);
      setArticleURL(selectedArticle.image_nm);
      setTempArticeNo(selectedArticle.articleId);
      toggleSuggestVisibility("article", false);
      setIsArticlePopup(false);
    }
    setValidation((prev) => ({ ...prev, articleNo: "valid" }));
  };
  const handleBuyerSubmit = (selectedBuyers) => {
    if (Array.isArray(selectedBuyers) && selectedBuyers.length > 0) {
      const selectedBuyer = selectedBuyers[0];
      setBsID(selectedBuyer.bs_id);
      setSampleDetailsForm({
        ...sampleDetailsForm,
        bsName: selectedBuyer.bsName,
        deliveryAddress: selectedBuyer.billingAddress,
      });
      toggleSuggestVisibility("buyer", false);
      setIsBuyerPopup(false);
    }
    setValidation((prev) => ({ ...prev, bsName: "valid" }));
  };

  const handleSampleSubmit = (selectedSamples) => {
    if (Array.isArray(selectedSamples) && selectedSamples.length > 0) {
      const selectedSample = selectedSamples[0];
      setBsID(selectedSample.buyer?.bs_id);
      const {
        article_image,
        image_nm,
        articleNo,
        articleName,
        ...restOfSelectedSample
      } = selectedSample;
      setSampleDetailsForm((prevForm) => ({
        ...prevForm,
        ...restOfSelectedSample,
        articleNo: articleName,
        bsName: selectedSample.buyer?.bsName,
        deliveryAddress: selectedSample.buyer?.billingAddress,
        deliveryDate: selectedSample.deliveryDate
          ? getformatDate(selectedSample.deliveryDate)
          : "",
        prodExDate: selectedSample.prodExDate
          ? getformatDate(selectedSample.prodExDate)
          : "",
        }));
     
      const articleImageUrl = selectedSample.article_image
        ? `${ARTICLE_IMAGE_PATH}${selectedSample.article_image}`
        : null;
      setArticleImageView(articleImageUrl);
      setImageUrl("");
      setArticleURL(selectedSample.article_image);
      setTempArticeNo(articleNo);
      setIsSampleDirPopup(false);
      setValidation((prev) => ({ ...prev, bsName: "valid" }));
    }
  };
  const handleViewPDF = async () => {
    setPrintLoading(true);
    try {
      await generatePDF(sampleDetailsForm, imageUrl, printSrNo, articleURL);
    } catch (error) {
      console.log("Error in printing pdf");
    } finally {
      setPrintLoading(false);
    }
  };

  const handleDropItemChange = (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
    setSampleDetailsForm({ ...sampleDetailsForm, [name]: value });
    const concatenatedString = `${name}List`;
    const filtered = itemsData
      .filter(
        (item) =>
          item.head.toLowerCase() === name.toLowerCase() &&
          item.value.toLowerCase().includes(value.toLowerCase())
      )
      .map((item) => ({
        name: item.value,
      }));
    const updatedFilteredList = {
      ...filteredList,
      [concatenatedString]: filtered,
    };
    setFilteredList(updatedFilteredList);
    toggleInputLoaderVisibility(`${name}`, false);
    if (value.length > 0) {
      toggleSuggestVisibility(`${name}`, true);
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
  };

  const handleArticleChange = (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(name, true);
    setSampleDetailsForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (value.trim().length > 0) {
      const concatenatedString = `${name}List`;
      const filtered = articles
        .filter((item) =>
          item.articleName.toLowerCase().includes(value.trim().toLowerCase())
        )
        .map((item) => ({
          articleId: item.articleId,
          articleName: item.articleName,
          imageUrl: item.image_nm,
        }));

      setFilteredList((prevList) => ({
        ...prevList,
        [concatenatedString]: filtered,
      }));
      setValidation((prev) => ({ ...prev, [name]: "valid" }));
      toggleSuggestVisibility(name, filtered.length > 0);
    } else {
      toggleSuggestVisibility(name, false);
      setFilteredList((prevList) => ({
        ...prevList,
        [`${name}List`]: [],
      }));
    }
    toggleInputLoaderVisibility(name, false);
  };

  useEffect(() => {
    if (itemsData.length === 0) {
      getItems();
    }
    if (!articleLoaded && !articleLoading) {
      dispatch(fetchAllArticles());
    }
  }, []);

  const getItems = async () => {
    const BASE_URL = "item/getItemHead";
    try {
      const response = await getApiService(BASE_URL);
      setItemsData(response);
    } catch (error) {
      console.error("Failed to fetch Items:", error);
    }
  };
  useEffect(() => {
    let inactivityTimer;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        resetAllFields();
      }, 5 * 60 * 1000);
    };
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("scroll", resetInactivityTimer);
    resetInactivityTimer();
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("scroll", resetInactivityTimer);
    };
  }, []);
  const resetAllFields = () => {
    setSampleDetailsForm({
      season: "",
      sampleRef: "",
      sampleType: "",
      articleNo: "",
      buyerArticle: "",
      size: "",
      quantity: "",
      pair: "",
      bsName: "",
      deliveryAddress: "",
      upperColor: "",
      liningColor: "",
      last: "",
      insole: "",
      soleLabel: "",
      internal_ref: "",
      leather_remark: "",
      sole_remark: "",
      socks: "",
      heel: "",
      pattern: "",
      buyerRef: "",
      inUpperLeather: "",
      inLining: "",
      inSocks: "",
      inQuantity: "",
      comments: "",
      deliveryDate: "",
      prodExDate: "",
    });

    setBsID("");
    setTempArticeNo("");
    setArticleImageView(null);
    setImagePreview(null);
    setRemoveImage(false);
    setValidation(initialValidationState);
    localStorage.setItem(
      "sampleDetailsForm",
      JSON.stringify(sampleDetailsForm)
    );
  };

  const uploadImage = async (srno) => {
    if (!imageFile) {
      console.log("No image file selected for upload");
      return null;
    }
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("fileName", srno);
    formData.append("type", "sample");

    try {
      const response = await axios.post(
        "http://localhost:8081/api/generic/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data ",
          },
        }
      );
      console.log("Image uploaded successfully:", response.data);
      return response.data;
    } catch (error) {
      let errorMessage;
      if (response.data.responseStatus) {
        errorMessage =
          error.response.data.responseStatus.description ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response received from the server.";
      }
      togglePopup(errorMessage);
      return null;
    }
  };

  const handleCreateSampleSubmit = async (e) => {
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const updatedSampleDetailsForm = {
      ...sampleDetailsForm,
      dateOfOrder: formattedDate,
      articleNo: tempArticleNo,
      finYear: "2024",
    };
    console.log(updatedSampleDetailsForm);
    try {
      const createSampleResponse = await postApiService(
        updatedSampleDetailsForm,
        "sample/create"
      );
      if (
        createSampleResponse.responseStatus &&
        createSampleResponse.responseStatus.description
      ) {
        const srno = createSampleResponse.response;
        console.log(srno);
        if(imageFile)
        {
          const imageResponseData = await uploadImage(srno);
        if (imageResponseData && imageResponseData.response) {
          setImageUrl(imageResponseData.response);
          console.log(imageResponseData.response);
        }
        }
        setPrintSrNo(srno);
        togglePopup(
          createSampleResponse.responseStatus.description + " For " + srno
        );
        setAllowPrint(true);
      }
      dispatch(fetchAllSamples());
    } catch (error) {
      let errorMessage;
      if (error.response && error.response.data.responseStatus) {
        errorMessage =
          error.response.data.responseStatus.description ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response received from the server.";
      }
      togglePopup(errorMessage);
    } finally {
      setLoading(false);
      setArticleImageView(null);
      setRemoveImage(false);
      setImageFile(null);
      setImagePreview(null);
      setBsID("");
      setTempArticeNo("");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (activeButton == "view" && isEditSelected) {
        if (
          event.key == "P" ||
          (event.key == "p" && activeButton == "view" && isEditSelected)
        ) {
          handlePrintClick();
        }
        if (
          event.key == "U" ||
          (event.key == "u" && activeButton == "view" && isEditSelected)
        ) {
          handleEditClick();
        }
      }
      window.addEventListener("keydown", handleKeyPress);
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    };
  }, [activeButton, isEditSelected, handlePrintClick]);
  useEffect(() => {
    if (isEditClicked && editSample.image_nm) {
      const imageUrl = editSample.image_nm
        ? `${SAMPLE_REQUEST_IMAGE_PATH}${editSample.image_nm}`
        : null;
      const articleImageUrl = editSample.article_image
        ? `${ARTICLE_IMAGE_PATH}${editSample.article_image}`
        : null;
      setImagePreview(imageUrl);
      setArticleImageView(articleImageUrl);
      setRemoveImage(true);
    }
  }, [isEditClicked, editSample]);

  const handleUpdateSampleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const imageResponseData = await uploadImage(editSample.sr_no);
    const imageNm = imageResponseData ? imageResponseData.response : null;
    const BASE_URL = "sample/update";
    try {
      const updatedSampleDetailsForm = {
        ...sampleDetailsForm,
        sample_id: editSample.sampleId,
        articleNo: tempArticleNo,
        image_nm: imageNm,
      };
      const responseData = await putApiService(
        updatedSampleDetailsForm,
        BASE_URL
      );
      togglePopup(
        responseData.responseStatus.description + " For " + editSample.sr_no
      );
      dispatch(fetchAllSamples());
      resetAllFields();
      setIsEditClicked(false);
      setIsEditSelected(false);
      setEditSample(null);
      setBsID("");
      setArticleImageView(null);
      setRemoveImage(false);
      setImagePreview(null);
      setTempArticeNo("");
    } catch (error) {
      let errorMessage;
      if (error.response && error.response.data.responseStatus) {
        errorMessage =
          error.response.data.responseStatus.description ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response received from the server.";
      }
      togglePopup(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleSampleType = async (name) => {
    toggleInputLoaderVisibility(`${name}`, true);
    const BASE_URL = "sample/getSampleType";
    try {
      const fetchedType = await getApiService(BASE_URL);
      setSampleType(fetchedType);
      toggleInputLoaderVisibility(`${name}`, false);
    } catch (error) {
      console.error("Failed to fetch Sample Type:", error);
    } finally {
      toggleInputLoaderVisibility(`${name}`, false);
    }
    toggleSuggestVisibility(name, !showSuggestions[name]);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        togglePopup("Please upload an image less than 1 MB.");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const toggleGridVisibility = (grid) => {
    setIsGridVisible((prevState) => ({
      ...prevState,
      [grid]: !prevState[grid],
    }));
  };
  useEffect(() => {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];
    setFormattedDate(currentDate);
  }, []);
  const handleDropItemClick = (name) => {
    toggleInputLoaderVisibility(`${name}`, true);
    const filtered = itemsData
      .filter((item) => item.head.toLowerCase() === name.toLowerCase())
      .map((item) => ({
        name: item.value,
      }));

    const updatedFilteredList = {
      ...filteredList,
      seasonList: filtered,
    };
    setFilteredList(updatedFilteredList);
    toggleSuggestVisibility(name, !showSuggestions[name]);
    toggleInputLoaderVisibility(`${name}`, false);
  };

  // Suggestions here
  const downshiftBuyer = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            bsName: selectedItem.bsName,
            deliveryAddress: selectedItem.deliveryAddress,
          });
          setBsID(selectedItem.bsId);
          toggleSuggestVisibility("buyer", false);
        }
      }}
      selectedItem={sampleDetailsForm.bsName}
      itemToString={(item) => (item ? item.bsName : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleBuyerInputChange,
              name: "bsName",
            })}
            type="text"
            style={
              validation.bsName === "invalid" ? { border: "2px solid red" } : {}
            }
            className={styles.basicInput2}
            disabled={isEditClicked}
            placeholder="Click on Search"
            value={sampleDetailsForm.bsName}
          />
          {showInputLoading.buyer ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <div>
              {" "}
              <button
                disabled={isEditClicked}
                onClick={() => setIsBuyerPopup(true)}
                className={styles.searchBtn}
                aria-label="Search"
              ></button>{" "}
            </div>
          )}

          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.buyer &&
              buyers.map((buyer, index) => (
                <div
                  {...getItemProps({ key: buyer.bsId, index, item: buyer })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {buyer.bsName}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const downshiftSampleRef = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            sampleRef: selectedItem,
          });
          toggleSuggestVisibility("sampleRef", false);
        }
      }}
      selectedItem={sampleDetailsForm.sampleRef}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleSampleRefChange,
              name: "sampleRef",
            })}
            type="text"
            maxLength="30"
            className={styles.basicInput2}
            placeholder="Type any word"
            value={sampleDetailsForm.sampleRef}
          />

          {showInputLoading.sampleRef ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <div>
              {" "}
              <button
                className={styles.searchBtn}
                aria-label="Search"
              ></button>{" "}
            </div>
          )}
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.sampleRef &&
              sampleRefrences.map((sample, index) => (
                <div
                  {...getItemProps({ key: index, index, item: sample })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {sample}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const downshiftUpperColor = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            upperColor: selectedItem,
          });
          toggleSuggestVisibility("upperColor", false);
        }
      }}
      selectedItem={sampleDetailsForm.upperColor}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateColorChange,
              name: "upperColor",
            })}
            type="text"
            maxLength="20"
            className={styles.basicInput}
            style={
              validation.upperColor === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            placeholder="Insert Two Letter"
            value={sampleDetailsForm.upperColor}
          />
          {showInputLoading.upperColor && (
            <div className={styles.dropLoader}></div>
          )}
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.upperColor &&
              colors.map((color, index) => (
                <div
                  {...getItemProps({ key: index, index, item: color })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {color}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const downshiftLiningColor = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            liningColor: selectedItem,
          });
          toggleSuggestVisibility("liningColor", false);
        }
      }}
      selectedItem={sampleDetailsForm.liningColor}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateColorChange,
              name: "liningColor",
            })}
            type="text"
            maxLength="20"
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            style={
              validation.liningColor === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            value={sampleDetailsForm.liningColor}
          />
          {showInputLoading.liningColor && (
            <div className={styles.dropLoader}></div>
          )}
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.liningColor &&
              colors.map((color, index) => (
                <div
                  {...getItemProps({ key: index, index, item: color })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {color}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const downshiftSoleLabel = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            soleLabel: selectedItem,
          });
          toggleSuggestVisibility("soleLabel", false);
        }
      }}
      selectedItem={sampleDetailsForm.soleLabel}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateColorChange,
              name: "soleLabel",
            })}
            type="text"
            className={styles.basicInput}
            maxLength="20"
            placeholder="Insert Two Letter"
            style={
              validation.soleLabel === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            value={sampleDetailsForm.soleLabel}
          />
          {showInputLoading.soleLabel && (
            <div className={styles.dropLoader}></div>
          )}
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.soleLabel &&
              colors.map((color, index) => (
                <div
                  {...getItemProps({ key: index, index, item: color })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {color}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );
  const articleNoRef = useRef(null);
  const downshiftArticleNo = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            articleNo: selectedItem.articleName,
          });
          setTempArticeNo(selectedItem.articleId);
          const articleImageUrl = selectedItem.imageUrl
            ? `${ARTICLE_IMAGE_PATH}${selectedItem.imageUrl}`
            : null;
          setArticleURL(selectedItem.imageUrl);
          setArticleImageView(articleImageUrl);
          toggleSuggestVisibility("articleNo", false);
        }
      }}
      selectedItem={sampleDetailsForm.articleNo}
      itemToString={(item) => (item ? item.articleNo : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleArticleChange,
              name: "articleNo",
            })}
            type="text"
            maxLength="10"
            ref={articleNoRef}
            style={
              validation.articleNo === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            className={styles.basicInput2}
            placeholder="Type any word"
            value={sampleDetailsForm.articleNo}
          />
          <div>
            <button
              onClick={() => {
                setIsArticlePopup(true);
              }}
              className={styles.searchBtn}
              aria-label="Search"
            ></button>
          </div>

          {showSuggestions.articleNo && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.articleNoList.map((item, index) => (
                <div
                  {...getItemProps({ key: index, index, item })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {item.articleName}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );

  const sampleTypeRef = useRef(null);
  const downshiftSampleType = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            sampleType: selectedItem,
          });
          setValidation((prev) => ({ ...prev, sampleType: "valid" }));
          toggleSuggestVisibility("sampleType", false);
        }
      }}
      selectedItem={sampleDetailsForm.sampleType}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateSampleChange,
              name: "sampleType",
            })}
            type="text"
            ref={sampleTypeRef}
            className={styles.basicInput2}
            placeholder="Click on Search"
            style={
              validation.sampleType === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            value={sampleDetailsForm.sampleType}
            readOnly
          />
          {showInputLoading.sampleType ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <div>
              <button
                onClick={() => {
                  handleSampleType("sampleType");
                  sampleTypeRef.current?.focus();
                }}
                className={styles.dropBtn}
                aria-label="Search"
              ></button>
            </div>
          )}

          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.sampleType &&
              sampleType.map((type, index) => (
                <div
                  {...getItemProps({ key: index, index, item: type })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {type}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );
  const seasonInputRef = useRef(null);
  const downshiftSeason = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            season: selectedItem.name,
          });
          toggleSuggestVisibility("season", false);
        }
      }}
      selectedItem={sampleDetailsForm.season}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleDropItemChange,
              name: "season",
            })}
            type="text"
            maxLength="20"
            ref={seasonInputRef}
            className={styles.buttonBasicInput}
            placeholder="Insert First Letter"
            value={sampleDetailsForm.season}
          />

          {showInputLoading.season ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <div>
              {" "}
              <button
                onClick={() => {
                  handleDropItemClick("season");
                  seasonInputRef.current?.focus();
                }}
                className={styles.dropBtn}
                aria-label="dropDorn"
              ></button>{" "}
            </div>
          )}

          {showSuggestions.season && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.seasonList.map((item, index) => (
                <div
                  {...getItemProps({ key: index, index, item })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );

  const patternInputRef = useRef(null);
  const downshiftPattern = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            pattern: selectedItem.name,
          });
          toggleSuggestVisibility("pattern", false);
        }
      }}
      selectedItem={sampleDetailsForm.pattern}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleDropItemChange,
              name: "pattern",
            })}
            style={
              validation.pattern === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            type="text"
            maxLength="20"
            ref={patternInputRef}
            className={styles.buttonBasicInput}
            placeholder="Insert First Letter"
            value={sampleDetailsForm.pattern}
          />

          {showInputLoading.pattern ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <div>
              {" "}
              <button
                onClick={() => {
                  handleDropItemClick("pattern");
                  patternInputRef.current?.focus();
                }}
                className={styles.dropBtn}
                aria-label="dropDorn"
              ></button>{" "}
            </div>
          )}

          {showSuggestions.pattern && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.seasonList.map((item, index) => (
                <div
                  {...getItemProps({ key: index, index, item })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );

  return (
    <div className={styles.sampleRequestMainContainer}>
      <div className={styles.headContainer}>
        <div className={styles.sampleRequestSubHeadContainer}>
          <h1
            className={styles.sampleRequestheadText}
            style={activeButton === "view" ? { marginTop: "2px" } : {}}
          >
            {activeButton === "details"
              ? isEditClicked
                ? `Update Sample Request: ${
                    isEditClicked && editSample.sr_no && editSample.sr_no
                  }`
                : "Sample Request"
              : "Sample Request Search"}
          </h1>
          {activeButton === "details" && (
            <div className={styles.headInputContainer}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label className={styles.inputLabel} htmlFor="Copyfrom">
                  Copy from
                </label>
                <div className={styles.headInputWithIcon}>
                  <input
                    type="text"
                    name="input1"
                    placeholder="Search Sample Request to duplicate"
                    className={styles.headInput}
                    readOnly
                  />
                  <button
                    onClick={() => {
                      setIsSampleDirPopup(true);
                    }}
                    className={styles.searchBtn}
                    aria-label="Search"
                  ></button>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <button
                  className={styles.headInsertValueButton}
                  onClick={() => setIsItemHeadPopup(true)}
                >
                  Insert New Value
                </button>

                <div>
                  <img
                    src={IButtonIcon}
                    onClick={() => {
                      setIsInfoPopup(true);
                    }}
                    className={styles.ibutton}
                    alt="iButton"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.subHeadContainerTwo}>
          {/* <h2>Sample Order Details</h2> */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className={styles.topButtons}>
              <button
                className={`${styles.screenChangeButton} ${
                  activeButton === "details" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveButton("details");
                  setIsEditSelected(false);
                  setMultipleSelected(false);
                  setPrintForm(null);
                }}
              >
                Sample Order Details
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activeButton === "view" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveButton("view");
                  {
                    !isCollapsed && toggleNavbar();
                  }
                }}
              >
                View SRs
              </button>
            </div>
            {/* {activeButton === "view" && (
              <div className={styles.editContainer}>
                <button
               //   disabled={!multipleSelected}
                  className={styles.headButton}
                 // onClick={handleEditClick}
                >
                  Update
                </button>

                {loading ? (
                  <div className={styles.buttonContainer}>
                    <div className={styles.loader}></div>
                  </div>
                ) : (
                  <button
                    disabled={!isEditSelected}
                    className={styles.headButtonPrint}
                  //  onClick={handlePrintClick}
                  >
                    Print
                  </button>
                )}
              </div>
            )} */}
          </div>

          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "details" ? (
        <>
          <div className={styles.topContainer}>
            <div className={styles.sampleRequestTopGrid}>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="season">
                  Season
                </label>
                {downshiftSeason}
              </div>

              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="bsName">
                  Buyer Name
                </label>
                {downshiftBuyer}
              </div>
              <div className={styles.imgColSpan}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className={styles.fileinputcontainer2}>
                    {imagePreview ? (
                      <div className={styles.imagepreview2}>
                        <img
                          src={imagePreview}
                          onClick={() => setIsImagePopup(true)}
                          alt="Preview"
                        />
                        <img
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          src={Cross}
                          alt="Select Icon"
                          className={styles.removeImageButton2}
                        />
                      </div>
                    ) : (
                      <label htmlFor="file" className={styles.filelabel2}>
                        <img
                          src={Upload}
                          alt="Image Placeholder"
                          className={styles.uploadImagePlaceholder}
                        />
                        Upload Image
                        <input
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                  <p className={styles.articleImageText}>SR Image</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className={styles.fileinputcontainer2}>
                    {articleImageView ? (
                      <div className={styles.imagepreview2}>
                        <img
                          onClick={() => setIsArticleImagePopup(true)}
                          src={articleImageView}
                          alt="Preview"
                        />
                      </div>
                    ) : (
                      <div className={styles.imagepreview2}>
                        <img
                          src={BlankImage}
                          alt="Image Placeholder"
                          className={styles.blankImagePlaceholder}
                        />
                      </div>
                    )}
                  </div>
                  <p className={styles.articleImageText}>Article Image</p>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="sampleRef">
                  Sample Ref.
                </label>
                {downshiftSampleRef}
              </div>

              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="sampleType">
                  Type of Sample
                </label>
                {downshiftSampleType}
              </div>
            </div>
          </div>

          <div className={styles.headSmallBorder}></div>

          <div className={styles.middleContainer}>
            <div
              className={styles.middleContainerTop}
              onClick={() => toggleGridVisibility("basic")}
            >
              <span>Basic Details</span>
              <img
                src={UpIcon}
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.basic ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              className={`${styles.sampleRequestMiddleGrid} ${
                isGridVisible.basic ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="articleNo">
                  Article No
                </label>
                {downshiftArticleNo}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="buyerArticle">
                  Buyer <br /> Article
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input 3"
                  maxLength="50"
                  name="buyerArticle"
                  style={
                    validation.buyerArticle === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  value={sampleDetailsForm.buyerArticle}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyerRef">
                  Buyer Ref.
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="buyerRef"
                  maxLength="50"
                  disabled={isEditClicked}
                  value={sampleDetailsForm.buyerRef}
                  onChange={handleCreateSampleChange}
                />
              </div>
              {isEditClicked ? (
                <div className={styles.colSpan}>
                  <label
                    className={styles.impsampleLabel}
                    htmlFor="dateOfOrder"
                  >
                    Date Of Order
                  </label>
                  <input
                    type="date"
                    className={`${styles.basicInput} ${styles.dateInput}`}
                    readOnly
                    value={sampleDetailsForm.dateOfOrder}
                    name="dateOfOrder"
                    style={{ backgroundColor: "#F7F7F7" }}
                  />
                </div>
              ) : (
                <div className={styles.colSpan}>
                  <label
                    className={styles.impsampleLabel}
                    htmlFor="dateOfOrder"
                  >
                    Date Of Order
                  </label>
                  <input
                    type="date"
                    className={`${styles.basicInput} ${styles.dateInput}`}
                    readOnly
                    defaultValue={formattedDate}
                    name="dateOfOrder"
                    style={{ backgroundColor: "#F7F7F7" }}
                  />
                </div>
              )}
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="size">
                  Size
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  style={
                    validation.size === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  name="size"
                  value={sampleDetailsForm.size}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="quantity">
                  Quantity
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  style={
                    validation.quantity === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  name="quantity"
                  value={sampleDetailsForm.quantity}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label
                  className={styles.impsampleLabel}
                  htmlFor="pair"
                  required
                >
                  Pair
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    name="pair"
                    value={sampleDetailsForm.pair}
                    style={
                      validation.pair === "invalid"
                        ? { border: "2px solid red" }
                        : {}
                    }
                    onChange={handleCreateSampleChange}
                  >
                    <option value="" selected disabled hidden>
                      Select Pair
                    </option>
                    <option value="L">Left</option>
                    <option value="R">Right</option>
                    <option value="B">Both</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="upperColor">
                  Upper <br /> Color
                </label>
                {downshiftUpperColor}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="liningColor">
                  Lining Color
                </label>
                {downshiftLiningColor}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="last">
                  Last
                </label>
                <input
                  type="text"
                  maxLength="20"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  style={
                    validation.last === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  name="last"
                  value={sampleDetailsForm.last}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="insole">
                  Insole
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="insole"
                  maxLength="20"
                  style={
                    validation.insole === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  value={sampleDetailsForm.insole}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="soleLabel">
                  Sole Label <br />& Color
                </label>
                {downshiftSoleLabel}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="socks">
                  Socks
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="socks"
                  maxLength="20"
                  style={
                    validation.socks === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  value={sampleDetailsForm.socks}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="heel">
                  Heel
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="heel"
                  maxLength="20"
                  style={
                    validation.heel === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  value={sampleDetailsForm.heel}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="pattern">
                  Pattern
                </label>
                {downshiftPattern}
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="commentLeather">
                  Comment
                </label>
                <textarea
                  ref={commentTextareaRef}
                  className={styles.commentInput}
                  placeholder="Enter Here"
                  maxLength="200"
                  name="comments"
                  value={sampleDetailsForm.comments}
                  onChange={handleCreateSampleChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div className={styles.headSmallBorder}></div>

          <div className={styles.middleContainer}>
            <div
              className={styles.middleContainerBottom}
              onClick={() => toggleGridVisibility("internal")}
            >
              <span>Internal Info Own</span>
              <img
                src={UpIcon} // Replace with the actual path to your icon
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.internal ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              id="detailsGrid"
              className={`${styles.sampleRequestSecondMiddleGrid} ${
                isGridVisible.internal ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan}>
                <label
                  className={styles.impsampleLabel}
                  htmlFor="inUpperLeather"
                >
                  Upper <br /> Leather
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="inUpperLeather"
                  maxLength="50"
                  value={sampleDetailsForm.inUpperLeather}
                  onChange={handleCreateSampleChange}
                  style={
                    validation.inUpperLeather === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  placeholder="Enter.."
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="inLining">
                  Lining
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                  name="inLining"
                  maxLength="50"
                  value={sampleDetailsForm.inLining}
                  style={
                    validation.inLining === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="inSocks">
                  Socks
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                  name="inSocks"
                  maxLength="50"
                  style={
                    validation.inSocks === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  value={sampleDetailsForm.inSocks}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="quantity">
                  Quantity
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Enter.."
                  name="inQuantity"
                  style={
                    validation.inQuantity === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  value={sampleDetailsForm.inQuantity}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="internal_ref">
                  Internal Ref.
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                  name="internal_ref"
                  maxLength="50"
                  style={
                    validation.internal_ref === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  value={sampleDetailsForm.internal_ref}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="leather_remark">
                  Leather Remark
                </label>
                <textarea
                  type="text"
                  ref={soleRemarkTextareaRef}
                  className={styles.commentInput}
                  placeholder="Enter.."
                  maxLength="200"
                  name="leather_remark"
                  value={sampleDetailsForm.leather_remark}
                  onChange={handleCreateSampleChange}
                  rows="3"
                ></textarea>
              </div>

              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="sole_remark">
                  Sole Remark
                </label>
                <textarea
                  ref={leatherRemarkTextareaRef}
                  className={styles.commentInput}
                  placeholder="Enter Here"
                  name="sole_remark"
                  maxLength="200"
                  value={sampleDetailsForm.sole_remark}
                  onChange={handleCreateSampleChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          <div className={styles.headSmallBorder}></div>

          <div className={styles.bottomContainer}>
            <div
              className={styles.insideBottomContainer}
              onClick={() => toggleGridVisibility("delivery")}
            >
              <span>Delivey Details</span>
              <img
                src={UpIcon}
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.delivery ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              id="detailsGrid"
              className={`${styles.sampleRequestBottomGrid} ${
                isGridVisible.delivery ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="prodExDate">
                  Prod-Ex Date
                </label>
                <input
                  type="date"
                  className={`${styles.basicInput} ${styles.dateInput}`}
                  name="prodExDate"
                  style={
                    validation.prodExDate === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  value={sampleDetailsForm.prodExDate}
                  onChange={handleCreateSampleChange}
                  min={
                    isEditClicked
                      ? sampleDetailsForm.dateOfOrder
                      : formattedDate
                  }
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="deliveryDate">
                  Delivery Date
                </label>
                <input
                  type="date"
                  className={`${styles.basicInput} ${styles.dateInput}`}
                  name="deliveryDate"
                  value={sampleDetailsForm.deliveryDate}
                  onChange={handleCreateSampleChange}
                  style={
                    validation.deliveryDate === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  disabled={!sampleDetailsForm.prodExDate}
                  min={sampleDetailsForm.prodExDate}
                  required
                />
              </div>

              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="deliveryAddress">
                  Delivery Address
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  className={styles.basicInput}
                  value={sampleDetailsForm.deliveryAddress}
                  onChange={handleCreateSampleChange}
                />
              </div>
            </div>
          </div>

          <div className={styles.parentButtonContainer}>
            {loading ? (
              <div className={styles.buttonContainer}>
                <div className={styles.loader}></div>
              </div>
            ) : (
              <div className={styles.buttonContainer}>
                {isEditClicked ? (
                  <>
                    <button
                      onClick={handleUpdateSampleSubmit}
                      className={styles.submitButton}
                    >
                      Submit
                    </button>{" "}
                    <button
                      className={styles.resetButton}
                      onClick={() => {
                        resetAllFields();
                        setIsEditClicked(false);
                        setIsEditSelected(false);
                        setEditSample(null);
                      }}
                    >
                      Go Back
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.resetButton}
                      onClick={resetAllFields}
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleCreateSampleSubmit}
                      className={styles.submitButton}
                    >
                      Submit
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {isPopupVisible && (
            <div className={styles.popupOverlay}>
              <div className={styles.popupContent}>
                <h2>{popupMessage}</h2>
                <button
                  className={styles.popupButton}
                  onClick={() => {
                    togglePopup();
                  
                  }}
                >
                  OK
                </button>

                {allowPrint &&
                  (printLoading ? (
                    <div
                      style={{ marginLeft: "35px", marginTop: "15px" }}
                      className={styles.loader}
                    ></div>
                  ) : (
                    <button
                      className={styles.popupButtonPrint}
                      onClick={handleViewPDF}
                    >
                      Print
                    </button>
                  ))}
              </div>
            </div>
          )}
          {isImagePopup && (
            <div className={styles.popupOverlay}>
              <div className={styles.imagePopupContent}>
                <img
                  src={imagePreview}
                  className={styles.imagepreviewPopup}
                  alt=""
                />
                <img
                  onClick={() => {
                    setIsImagePopup(false);
                  }}
                  src={Cross}
                  alt="Select Icon"
                  className={styles.crossIcon}
                />
              </div>
            </div>
          )}
          {isArticleImagePopup && (
            <div className={styles.popupOverlay}>
              <div className={styles.imagePopupContent}>
                <img
                  src={articleImageView}
                  className={styles.imagepreviewPopup}
                  alt=""
                />
                <img
                  onClick={() => {
                    setIsArticleImagePopup(false);
                  }}
                  src={Cross}
                  alt="Select Icon"
                  className={styles.crossIcon}
                />
              </div>
            </div>
          )}

          {isArticlePopup && (
            <ArticlePopup
              onCancel={() => {
                setIsArticlePopup(false);
              }}
              onSubmitArticleData={handleArticleNoSubmit}
            />
          )}

          {isInfoPopup && (
            <InfoPopup
              onCancel={() => {
                setIsInfoPopup(false);
              }}
              infoName={"Sample Details"}
            />
          )}
          {isBuyerPopup && (
            <BuyerPopup
              onCancel={() => {
                setIsBuyerPopup(false);
              }}
              onSubmitBuyerData={handleBuyerSubmit}
            />
          )}
          {isSampleDirPopup && (
            <SampleDirPopup
              onCancel={() => {
                setIsSampleDirPopup(false);
              }}
              onSubmitSampleData={handleSampleSubmit}
            />
          )}
          {isItemHeadPopup && (
            <ItemHeadPopup
              onCancel={() => {
                setIsItemHeadPopup(false);
              }}
              itemForm={itemForm}
            />
          )}
        </>
      ) : (
        <ViewSr onSampleSelect={handleSampleEdit} multipleSelected={multipleSelected} handleEditClick={handleEditClick} handlePrintClick={handlePrintClick} isEditSelected={isEditSelected} />
      )}
    </div>
  );
};

export default SampleRequest;
