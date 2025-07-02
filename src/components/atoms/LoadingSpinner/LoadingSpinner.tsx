import React from "react";
import "./loadingSpinner.css";

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner" aria-label="Loading">
    <div className="spinner" />
  </div>
);

export default LoadingSpinner;
