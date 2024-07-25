
import React from "react";
import AutoTable from "../features/AutoTable";

const GenieEffect = () => {
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Doe", email: "jane@example.com" },
    { id: 3, name: "Alice Smith", email: "alice@example.com" },
    { id: 4, name: "Bob Johnson", email: "bob@example.com" },
  ];

  const columns = {
    id: { label: "ID", width: "50px", visible: false },
    name: { label: "Name", width: "150px", visible: true },
    email: { label: "Email", width: "200px", visible: true },
  };

  return (
    <div>
      <h1>My Table Page</h1>
      <AutoTable data={data} columns={columns} delete={true}  />
    </div>
  );
};

export default GenieEffect;
