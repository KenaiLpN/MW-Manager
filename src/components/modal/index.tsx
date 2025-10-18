"use client";

import React, { ReactNode } from 'react';

// Definindo os tipos para as props do componente
type ModalProps = {
  isOpen: boolean;
  onClose: () => void; // Uma função que não recebe argumentos e não retorna nada
  children: ReactNode; // 'ReactNode' é o tipo ideal para 'children' em React
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    // Overlay (fundo escurecido)
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
    >
      {/* Conteúdo do Modal */}
      <div
        // Tipamos o evento para maior segurança
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl p-6 relative w-full max-w-md"
      >
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        
        {children}
      </div>
    </div>
  );
};

export default Modal;