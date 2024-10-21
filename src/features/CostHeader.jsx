import React, { useEffect } from 'react';
import styles from "../styles/newPo.module.css";

const CostHeader = ({ api }) => {
  const calculateTotalCost = () => {
    let total = 0;
    api.forEachNode((node) => {
      const cost = parseFloat(node.data.cost) || 0;
      total += cost;
    });
    return total.toFixed(2);
  };

  useEffect(() => {
    const onCellValueChanged = (event) => {
      if (event.colDef.field === 'cost') {
        api.refreshHeader();
      }
    };

    api.addEventListener('cellValueChanged', onCellValueChanged);

    return () => {
      api.removeEventListener('cellValueChanged', onCellValueChanged);
    };
  }, [api]);

  const totalCost = calculateTotalCost();

  return (
    <div className={styles.costHeader}>
      Cost [ Total: {totalCost} ]
    </div>
  );
};

export default CostHeader;
