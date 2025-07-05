import React, { useState } from "react";
import ProjectTableList from "./ProjectTableList";
import AddProject from "./AddProject";
import { useDispatch } from "react-redux";
import { getProjects } from "../../../features/products/projectSlice";
import UpdateProject from "./UpdateProject";

const ProjectsMainpage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState(null);

  const dispatch = useDispatch();

  const handleSaveSuccess = () => {
    setShowAddModal(false);
    dispatch(getProjects());
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setProjectToUpdate(null);
    dispatch(getProjects());
  };

  const handleUpdateClick = (project) => {
    setProjectToUpdate(project);
    setShowUpdateModal(true);
  };

  return (
    <>
      <ProjectTableList
        setShowAddModal={setShowAddModal}
        onUpdateClick={handleUpdateClick}
      />
      <AddProject
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSaveSuccess={handleSaveSuccess}
      />
      <UpdateProject
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        project={projectToUpdate}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default ProjectsMainpage;