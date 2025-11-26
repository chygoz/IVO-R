import React from "react";
import AccountPageHeader from "../page-header";

function AddressManagement() {
  return (
    <div>
      <AccountPageHeader>
        <div className="text-xl">My Shipping Address</div>
        <div className="ml-auto">
          <button className="text-primary-500">Add new Address</button>
        </div>
      </AccountPageHeader>
    </div>
  );
}

export default AddressManagement;
