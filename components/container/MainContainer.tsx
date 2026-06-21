"use client";

import React from "react";
import ModalContainer from "./ModalContainer";
import { useUtilityStore } from "@/lib/zustand/utilityStore";

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer = ({ children }: MainContainerProps) => {
  const { isModalOpen, modalContent, modalOptions, closeModal } =
    useUtilityStore();

  return (
    <div className="relative min-h-screen w-full">
      {/* modal container */}
      <ModalContainer
        isOpen={isModalOpen}
        onClose={closeModal}
        showOverlay={modalOptions.showOverlay}
        closeOnOverlayClick={modalOptions.closeOnOverlayClick}
        overlayClassName={modalOptions.overlayClassName}
        contentClassName={modalOptions.contentClassName}
      >
        {modalContent}
      </ModalContainer>

      {/* Page Content */}
      {children}
    </div>
  );
};

export default MainContainer;
