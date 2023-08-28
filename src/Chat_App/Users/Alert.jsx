import React from "react";

const Alert = () =>{
    return (

        <div className="alert alert-dismissible bg-primary d-flex flex-column flex-sm-row p-5 mb-10">
  <span className="svg-icon svg-icon-2hx svg-icon-light me-4 mb-5 mb-sm-0">...</span>
  <div className="d-flex flex-column text-light pe-0 pe-sm-10">
    <h5 className="mb-1">This is an alert</h5>
    <span>The alert component can be used to highlight certain parts of your page for higher content visibility.</span>
  </div>

  <button type="button" className="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto" data-bs-dismiss="alert">
    <span className="svg-icon svg-icon-2x svg-icon-light">...</span>
  </button>
</div>
    )
}
export default Alert;