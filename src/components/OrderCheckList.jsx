import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import Delete3dIcon from "../assets/eraser.svg";




const PictureUpload = () => {
  const [formData, setFormData] = useState({
    picture1: null,
    picture1Comments: "",
    picture2: null,
    picture2Comments: "",
    picture3: null,
    picture3Comments: "",
    picture4: null,
    picture4Comments: "",
    picture5: null,
    picture5Comments: "",
  });

  const [inputKeys, setInputKeys] = useState({
    picture1: Date.now(),
    picture2: Date.now(),
    picture3: Date.now(),
    picture4: Date.now(),
    picture5: Date.now(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleRemoveFile = (name) => {
    setFormData({
      ...formData,
      [name]: null,
    });
    setInputKeys({
      ...inputKeys,
      [name]: Date.now(), 
    });
  };

  return (
    <div className={styles.pOSubContainer}>
      <div className={styles.titleContainer}>
        <h1>Picture Upload : Section G</h1>
      </div>
      <div className={styles.topContainer}>
        {Array.from({ length: 5 }).map((_, index) => {
          const pictureName = `picture${index + 1}`;
          const commentName = `picture${index + 1}Comments`;

          return (
            <div className={styles.orderCheckArticleGrid} key={index}>
              <div className={styles.colSpan}>
                <div className={styles.otherHeadTitle}>
                  <h3>Picture {index + 1} :</h3>
                </div>
              </div>
              <div className={styles.colSpan2}>
                <div className={styles.imageInputBox}>
                  <input
                    key={inputKeys[pictureName]} 
                    type="file"
                    name={pictureName}
                    onChange={handleFileChange}
                    className={styles.basicInput}
                  />
                  <span>No file chosen</span>
                </div>
              </div>
              <div className={styles.colSpan2}>
                <div className={styles.imageInputBox}>
                  <input
                    type="text"
                    name={commentName}
                    value={formData[commentName]}
                    onChange={handleInputChange}
                    className={styles.basicInput}
                  />
                  <span>Picture {index + 1} Comments</span>
                </div>
              </div>
              <div className={styles.colSpan}>
                <img
                  onClick={() => handleRemoveFile(pictureName)}
                  className={styles.removeFileButton}
                  src={Delete3dIcon}
                  alt="remove"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const History = () => {
  const [formData, setFormData] = useState({
    merchandiserNotes: null,
    merchandiserNotesComments: "",
    toolingNotesImage: null,
    toolingNotesImageComments: "",
    toolingNotesFile: null,
    toolingNotesFileComments: "",
    historyFile: null,
    historyFileComments: "",
  });

  const [inputKeys, setInputKeys] = useState({
    merchandiserNotes: Date.now(),
    toolingNotesImage: Date.now(),
    toolingNotesFile: Date.now(),
    historyFile: Date.now(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleRemoveFile = (name) => {
    setFormData({
      ...formData,
      [name]: null,
    });
    setInputKeys({
      ...inputKeys,
      [name]: Date.now(),
    });
  };

  return (
    <div className={styles.pOSubContainer}>
      <div className={styles.titleContainer}>
        <h1>History : Section F</h1>
      </div>
      <div className={styles.topContainer}>
        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.otherHeadTitle}>
              <h3>Merchandiser Notes (xlsx, docx) :</h3>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.imageInputBox}>
              <input
                key={inputKeys.merchandiserNotes}
                type="file"
                name="merchandiserNotes"
                onChange={handleFileChange}
                className={styles.basicInput}
              />
              <span>No file chosen</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.imageInputBox}>
              <input
                type="text"
                name="merchandiserNotesComments"
                value={formData.merchandiserNotesComments}
                onChange={handleInputChange}
                className={styles.basicInput}
              />
              <span>Merchandiser Notes Comments</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <img
              onClick={() => handleRemoveFile("merchandiserNotes")}
              className={styles.removeFileButton}
              src={Delete3dIcon}
              alt="remove"
            />
          </div>
        </div>

        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.otherHeadTitle}>
              <h3>Tooling Notes (Choose Image) :</h3>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.imageInputBox}>
              <input
                key={inputKeys.toolingNotesImage}
                type="file"
                name="toolingNotesImage"
                onChange={handleFileChange}
                className={styles.basicInput}
              />
              <span>No file chosen</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.imageInputBox}>
              <input
                type="text"
                name="toolingNotesImageComments"
                value={formData.toolingNotesImageComments}
                onChange={handleInputChange}
                className={styles.basicInput}
              />
              <span>Tooling Notes Image Comments</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <img
              onClick={() => handleRemoveFile("toolingNotesImage")}
              className={styles.removeFileButton}
              src={Delete3dIcon}
              alt="remove"
            />
          </div>
        </div>

        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.otherHeadTitle}>
              <h3>Tooling Notes (xlsx, docx) :</h3>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.imageInputBox}>
              <input
                key={inputKeys.toolingNotesFile}
                type="file"
                name="toolingNotesFile"
                onChange={handleFileChange}
                className={styles.basicInput}
              />
              <span>No file chosen</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.imageInputBox}>
              <input
                type="text"
                name="toolingNotesFileComments"
                value={formData.toolingNotesFileComments}
                onChange={handleInputChange}
                className={styles.basicInput}
              />
              <span>Tooling Notes File Comments</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <img
              onClick={() => handleRemoveFile("toolingNotesFile")}
              className={styles.removeFileButton}
              src={Delete3dIcon}
              alt="remove"
            />
          </div>
        </div>

        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.otherHeadTitle}>
              <h3>History (xlsx, docx) :</h3>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.imageInputBox}>
              <input
                key={inputKeys.historyFile}
                type="file"
                name="historyFile"
                onChange={handleFileChange}
                className={styles.basicInput}
              />
              <span>No file chosen</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.imageInputBox}>
              <input
                type="text"
                name="historyFileComments"
                value={formData.historyFileComments}
                onChange={handleInputChange}
                className={styles.basicInput}
              />
              <span>History File Comments</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <img
              onClick={() => handleRemoveFile("historyFile")}
              className={styles.removeFileButton}
              src={Delete3dIcon}
              alt="remove"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


const SamplingSummary = () => {
  const [formData, setFormData] = useState({
    confirmationSampleStatus: "Confirmed",
    confirmationSampleComments: "",
    fittingSampleStatus: "Confirmed",
    fittingSampleComments: "",
    sizeSetSampleStatus: "Confirmed",
    sizeSetSampleComments: "",
    productionSampleStatus: "Confirmed",
    productionSampleComments: "",
    shipmentSampleStatus: "Confirmed",
    shipmentSampleComments: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className={styles.pOSubContainer}>
      <div className={styles.titleContainer}>
        <h1>Sampling Summary : Section E</h1>
      </div>
      <div className={styles.topContainer}>
        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.otherHeadTitle}>
              <h3>Confirmation Sample :</h3>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="confirmationSampleStatus"
                value={formData.confirmationSampleStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Not-Confirmed">Not-Confirmed</option>
              </select>
              <span>Status</span>
            </div>
          </div>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="confirmationSampleComments"
                value={formData.confirmationSampleComments}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
        </div>

        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.otherHeadTitle}>
              <h3>Fitting Sample :</h3>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="fittingSampleStatus"
                value={formData.fittingSampleStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Not-Confirmed">Not-Confirmed</option>
              </select>
              <span>Status</span>
            </div>
          </div>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="fittingSampleComments"
                value={formData.fittingSampleComments}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
        </div>

        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.otherHeadTitle}>
              <h3>Size Set Sample :</h3>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="sizeSetSampleStatus"
                value={formData.sizeSetSampleStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Not-Confirmed">Not-Confirmed</option>
              </select>
              <span>Status</span>
            </div>
          </div>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="sizeSetSampleComments"
                value={formData.sizeSetSampleComments}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
        </div>

        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.otherHeadTitle}>
              <h3>Production Sample :</h3>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="productionSampleStatus"
                value={formData.productionSampleStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Not-Confirmed">Not-Confirmed</option>
              </select>
              <span>Status</span>
            </div>
          </div>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="productionSampleComments"
                value={formData.productionSampleComments}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
        </div>

        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.otherHeadTitle}>
              <h3>Shipment Sample :</h3>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="shipmentSampleStatus"
                value={formData.shipmentSampleStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Not-Confirmed">Not-Confirmed</option>
              </select>
              <span>Status</span>
            </div>
          </div>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="shipmentSampleComments"
                value={formData.shipmentSampleComments}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const OtherDetails = () => {
  const [formData, setFormData] = useState({
    customerCheck: "",
    countryCheck: "",
    checkSampling: "",
    physicalTesting: "Confirmed",
    physicalTestingRemarks: "",
    chemicalTesting: "Confirmed",
    chemicalTestingRemarks: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={styles.pOSubContainer}>
      <div className={styles.titleContainer}>
        <h1>Other Details : Section D</h1>
      </div>
      <div className={styles.topContainer}>
        <div className={styles.otherHeadTitle}>
          <h2>Restricted List Verification</h2>
          <h3>If Article & Last is OLD :</h3>
        </div>
        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="customerCheck"
                value={formData.customerCheck}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Customer Check</span>
            </div>
          </div>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="countryCheck"
                value={formData.countryCheck}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Country Check</span>
            </div>
          </div>
        </div>

        <div className={styles.otherHeadTitle}>
          <h3 style={{ marginTop: "4px" }}>If Article & Last is New :</h3>
        </div>
        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="checkSampling"
                value={formData.checkSampling}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Check Sampling of Same Country</span>
            </div>
          </div>
        </div>

        <div className={styles.otherHeadTitle}>
          <h2 style={{ marginTop: "4px", marginBottom: "4px" }}>Testing</h2>
        </div>
        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <select
                name="physicalTesting"
                value={formData.physicalTesting}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Not-Confirmed">Not-Confirmed</option>
              </select>
              <span>Physical Testing</span>
            </div>
          </div>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="physicalTestingRemarks"
                value={formData.physicalTestingRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remark</span>
            </div>
          </div>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <select
                name="chemicalTesting"
                value={formData.chemicalTesting}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Not-Confirmed">Not-Confirmed</option>
              </select>
              <span>Chemical Testing</span>
            </div>
          </div>
          <div className={styles.colSpan3}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="chemicalTestingRemarks"
                value={formData.chemicalTestingRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PackingDetails = () => {
  const [formData, setFormData] = useState({
    packingMaterial: "",
    packingMaterialStatus: "Confirmed",
    packingMaterialRemarks: "",
    box: "",
    boxStatus: "Confirmed",
    boxRemarks: "",
    boxEndLabel: "",
    boxEndLabelStatus: "Confirmed",
    boxEndLabelRemarks: "",
    pictogram: "",
    pictogramStatus: "Confirmed",
    pictogramRemarks: "",
    hangTag: "",
    hangTagStatus: "Confirmed",
    hangTagRemarks: "",
    barcode: "",
    barcodeStatus: "Confirmed",
    barcodeRemarks: "",
    otherLabels: "",
    otherLabelsStatus: "Confirmed",
    otherLabelsRemarks: "",
    packing: "",
    packingStatus: "Not-Confirmed",
    packingRemarks: "",
    cartonMeasurement: "",
    cartonMeasurementStatus: "Not-Confirmed",
    cartonMeasurementRemarks: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={styles.pOSubContainer}>
      <div className={styles.titleContainer}>
        <h1>Packing Details : Section C</h1>
      </div>
      <div className={styles.topContainer}>
        <div className={styles.orderCheckArticleGrid}>
          {[
            { label: "Packing Material", name: "packingMaterial" },
            { label: "Box", name: "box" },
            { label: "Box End Label", name: "boxEndLabel" },
            { label: "Pictogram", name: "pictogram" },
            { label: "Hang Tag", name: "hangTag" },
            { label: "Barcode", name: "barcode" },
            { label: "Other Labels", name: "otherLabels" },
            { label: "Packing", name: "packing" },
            { label: "Carton Measurement", name: "cartonMeasurement" },
          ].map((item) => (
            <React.Fragment key={item.name}>
              <div className={styles.colSpan2}>
                <div className={styles.inputbox}>
                  <input
                    type="text"
                    name={item.name}
                    value={formData[item.name]}
                    onChange={handleInputChange}
                    className={styles.basicInput}
                    required
                  />
                  <span>{item.label}</span>
                </div>
              </div>
              <div className={styles.colSpan2}>
                <div className={styles.inputbox}>
                  <select
                    name={`${item.name}Status`}
                    value={formData[`${item.name}Status`]}
                    onChange={handleInputChange}
                    className={styles.basicInput}
                    required
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Not-Confirmed">Not-Confirmed</option>
                  </select>
                  <span>Status</span>
                </div>
              </div>
              <div className={styles.colSpan2}>
                <div className={styles.inputbox}>
                  <input
                    type="text"
                    name={`${item.name}Remarks`}
                    value={formData[`${item.name}Remarks`]}
                    onChange={handleInputChange}
                    className={styles.basicInput}
                    required
                  />
                  <span>Remarks</span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleDetails = () => {
  const [formData, setFormData] = useState({
    lastNumber: "",
    lastSeriesStatus: "Not Adopted",
    remarks: "",
    previouslyProducedDate: "",
    typeOfLast: "Sandal",
    fittingType: "Normal",
    soleDetail: "",
    soleMoldStatus: "Not Adopted",
    soleMoldRemarks: "",
    heelDetail: "",
    heelAdoptedStatus: "Not Adopted",
    heelAdoptedRemarks: "",
    plateauPlatform: "",
    adoptedStatus: "Not Adopted",
    plateauPlatformDetails: "",
    leather: "",
    leatherStatus: "Not-Confirmed",
    leatherRemarks: "",
    leatherColours: "",
    leatherColoursStatus: "Not-Confirmed",
    leatherColoursRemarks: "",
    lining: "",
    liningStatus: "Not-Confirmed",
    liningRemarks: "",
    socks: "",
    socksStatus: "Not-Confirmed",
    socksRemarks: "",
    socksLabel: "",
    socksLabelStatus: "Not-Confirmed",
    socksLabelRemarks: "",
    laceBuckleTrim: "",
    laceBuckleTrimStatus: "Not-Confirmed",
    laceBuckleTrimRemarks: "",
    importedMaterial: "NO",
    listImportedMaterials: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={styles.pOSubContainer}>
      <div className={styles.titleContainer}>
        <h1>Article Details : Section B</h1>
      </div>
      <div className={styles.topContainer}>
        <div className={styles.orderCheckArticleGrid}>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="lastNumber"
                value={formData.lastNumber}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Last Number</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <select
                name="lastSeriesStatus"
                value={formData.lastSeriesStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not Adopted">Not Adopted</option>
                <option value="Adopted">Adopted</option>
              </select>
              <span>Last Series Status</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="date"
                name="previouslyProducedDate"
                value={formData.previouslyProducedDate}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Previously Pro. Date</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <select
                name="typeOfLast"
                value={formData.typeOfLast}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Sandal">Sandal</option>
                <option value="Shoe">Shoe</option>
              </select>
              <span>Type of Last</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <select
                name="fittingType"
                value={formData.fittingType}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Normal">Normal</option>
                <option value="Wide">Wide</option>
              </select>
              <span>Fitting Type</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="soleDetail"
                value={formData.soleDetail}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Sole Detail</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="soleMoldStatus"
                value={formData.soleMoldStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not Adopted">Not Adopted</option>
                <option value="Adopted">Adopted</option>
              </select>
              <span>Sole Mold Status</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="soleMoldRemarks"
                value={formData.soleMoldRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="heelDetail"
                value={formData.heelDetail}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Heel Detail</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="heelAdoptedStatus"
                value={formData.heelAdoptedStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not Adopted">Not Adopted</option>
                <option value="Adopted">Adopted</option>
              </select>
              <span>Heel Adopted Status</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="heelAdoptedRemarks"
                value={formData.heelAdoptedRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="plateauPlatform"
                value={formData.plateauPlatform}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Plateau/Platform</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="adoptedStatus"
                value={formData.adoptedStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not Adopted">Not Adopted</option>
                <option value="Adopted">Adopted</option>
              </select>
              <span>Adopted Status</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="plateauPlatformDetails"
                value={formData.plateauPlatformDetails}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Plateau/Plat. Details</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="leather"
                value={formData.leather}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Leather</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="leatherStatus"
                value={formData.leatherStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not-Confirmed">Not-Confirmed</option>
                <option value="Confirmed">Confirmed</option>
              </select>
              <span>Leather Status</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="leatherRemarks"
                value={formData.leatherRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="leatherColours"
                value={formData.leatherColours}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Leather Colours</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="leatherColoursStatus"
                value={formData.leatherColoursStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not-Confirmed">Not-Confirmed</option>
                <option value="Confirmed">Confirmed</option>
              </select>
              <span>Leather Col. Status</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="leatherColoursRemarks"
                value={formData.leatherColoursRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="lining"
                value={formData.lining}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Lining</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="liningStatus"
                value={formData.liningStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not-Confirmed">Not-Confirmed</option>
                <option value="Confirmed">Confirmed</option>
              </select>
              <span>Lining Status</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="liningRemarks"
                value={formData.liningRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="socks"
                value={formData.socks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Socks</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="socksStatus"
                value={formData.socksStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not-Confirmed">Not-Confirmed</option>
                <option value="Confirmed">Confirmed</option>
              </select>
              <span>Socks Status</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="socksRemarks"
                value={formData.socksRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="socksLabel"
                value={formData.socksLabel}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Socks Label</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="socksLabelStatus"
                value={formData.socksLabelStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not-Confirmed">Not-Confirmed</option>
                <option value="Confirmed">Confirmed</option>
              </select>
              <span>Socks Label Status</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="socksLabelRemarks"
                value={formData.socksLabelRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="laceBuckleTrim"
                value={formData.laceBuckleTrim}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Lace/Buckle/Trim</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <select
                name="laceBuckleTrimStatus"
                value={formData.laceBuckleTrimStatus}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="Not-Confirmed">Not-Confirmed</option>
                <option value="Confirmed">Confirmed</option>
              </select>
              <span>Lace/Buck/Trim Status</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="laceBuckleTrimRemarks"
                value={formData.laceBuckleTrimRemarks}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Remarks</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <select
                name="importedMaterial"
                value={formData.importedMaterial}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              >
                <option value="NO">NO</option>
                <option value="YES">YES</option>
              </select>
              <span>Imported Material</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="listImportedMaterials"
                value={formData.listImportedMaterials}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>List Imp Materials</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetails = () => {
  const [formData, setFormData] = useState({
    isRepeat: "New",
    halfSize: "No",
    // Additional fields for the form
    buyerTesting: "",
    customer: "",
    articleNo: "",
    articleNo2: "",
    color: "",
    orderNo: "",
    price: "",
    currency: "USD",
    deliveryDate: "",
    sizeAssortment: "",
    commission: "",
    copyFrom: "",
    date: "",
    country: "",
    sampleOrder: "",
    styleName: "",
    quantity: "",
    discount: "",
    deliveryTerms: "",
    invoiceReq: "NO",
    listOfHalfSizes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={styles.pOSubContainer}>
      <div className={styles.titleContainer}>
        <h1>Order Details : Section A</h1>
        <label
          className={styles.switch}
          style={{ marginLeft: "auto", marginRight: "20px" }}
        >
          <input
            type="checkbox"
            hidden
            checked={formData.isRepeat === "Repeat"}
            onChange={(e) =>
              handleToggleChange(
                "isRepeat",
                e.target.checked ? "Repeat" : "New"
              )
            }
          />
          <div className={styles.switchWrapper}>
            <div className={styles.switchToggle}>
              {formData.isRepeat === "Repeat" ? "Repeat" : "New"}
            </div>
          </div>
        </label>

        <div className={styles.inputbox} style={{ width: "250px" }}>
          <input
            type="text"
            name="copyFrom"
            value={formData.copyFrom}
            onChange={handleInputChange}
            className={styles.basicInput}
            required
          />
          <span>Copy From</span>
        </div>
      </div>

      <div className={styles.topContainer}>
        <div className={styles.gateOutTopGrid}>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="buyerTesting"
                value={formData.buyerTesting}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Search Buyer Testing</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Customer</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Date</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="orderNo"
                value={formData.orderNo}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Order Check List No</span>
            </div>
          </div>

          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Country</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="articleNo"
                value={formData.articleNo}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Article No.</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="sampleOrder"
                value={formData.sampleOrder}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Sample Order</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Color</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="styleName"
                value={formData.styleName}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Style Name</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="orderNo"
                value={formData.orderNo}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Order No</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Quantity</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Price</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Currency</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Discount</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Delivery Date</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="deliveryTerms"
                value={formData.deliveryTerms}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Delivery Terms</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Size</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Discount</span>
            </div>
          </div>
          <div className={styles.inputbox}>
            <select className={styles.basicInput} required>
              <option value="">Performa Inv Req</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <span>Performa Inv Req.</span>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="commission"
                value={formData.commission}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>Commission</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <select className={styles.basicInput} required>
                <option value="">Half Size Req</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <span>Half Size Req.</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="listOfHalfSizes"
                value={formData.listOfHalfSizes}
                onChange={handleInputChange}
                className={styles.basicInput}
                required
              />
              <span>List of All Half Sizes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCheckList = () => {
  return (
    <div className={styles.pOMainContainer}>
      <OrderDetails />
      <div style={{ marginTop: "20px" }}></div>
      <ArticleDetails />
      <div style={{ marginTop: "20px" }}></div>
      <PackingDetails />
      <div style={{ marginTop: "20px" }}></div>
      <OtherDetails />
      <div style={{ marginTop: "20px" }}></div>
      <SamplingSummary />
      <div style={{ marginTop: "20px" }}></div>
      <History />
      <div style={{ marginTop: "20px" }}></div>
      <PictureUpload />
    </div>
  );
};
export default OrderCheckList;
