import React, { useContext, useState } from "react";
import { CModal, CModalBody, CModalFooter, CButton } from "@coreui/react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { PushSpinner } from "react-spinners-kit";

const FarmerModal = ({ visiblePin, setVisiblePin, farmerData, onDeleteSuccess }) => {
  const { deleteFarmer } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!farmerData?._id) {
      toast.error("Farmer ID not found!");
      return;
    }

    setLoading(true);
    try {
      const message = await deleteFarmer(farmerData._id);
      toast.success(message || "Farmer deleted successfully!");
      setVisiblePin(false);

      // Ensure callback is triggered after deletion
      if (typeof onDeleteSuccess === "function") {
        await onDeleteSuccess(); // Refresh farmers list
      }
    } catch (error) {
      toast.error(error?.message || "Failed to delete farmer!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal
      visible={visiblePin}
      alignment="center"
      onClose={() => setVisiblePin(false)}
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalBody>
        <div className="container">
          <p><strong>Name:</strong> {farmerData?.name || "N/A"}</p>
          <p><strong>Phone:</strong> {farmerData?.phone || "N/A"}</p>
          <p><strong>Email:</strong> {farmerData?.email || "N/A"}</p>
          <p><strong>Role:</strong> {farmerData?.role || "N/A"}</p>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={() => setVisiblePin(false)}>
          Close
        </CButton>
        <CButton color="danger" onClick={handleDelete} disabled={loading}>
          {loading ? <PushSpinner size={30} color="white" /> : "Delete Farmer"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default FarmerModal;
