import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

function Folder({ folder }) {
  return (
    <Button
      to={`/folder/${folder.id}`}
      as={Link}
      variant="outline-dark"
      className="text-truncate w-100"
    >
      <FontAwesomeIcon icon={faFolder} className="mr-2" /> {folder.name}
    </Button>
  );
}

export default Folder;