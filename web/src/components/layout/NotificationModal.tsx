'use client'
import React, { useRef, useEffect } from 'react';

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  notifications: { id: number; title: string; description: string; date: string }[];
  anchorRef?: React.RefObject<HTMLButtonElement>;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ open, onClose, notifications, anchorRef }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 z-50 w-80 bg-[#2A4A2A] rounded-xl shadow-lg p-4 border border-[#4A7C4A]"
      style={{ minWidth: 320 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-white">Notificações</h2>
        <button
          className="text-[#9EBF9E] hover:text-white text-xl"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
      </div>
      {notifications.length === 0 ? (
        <p className="text-[#9EBF9E] text-sm">Nenhuma notificação no momento.</p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {notifications.map((n) => (
            <li key={n.id} className="bg-[#223822] rounded-lg p-3">
              <div className="text-white font-medium">{n.title}</div>
              <div className="text-[#9EBF9E] text-sm">{n.description}</div>
              <div className="text-xs text-right text-[#9EBF9E] mt-1">{n.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationModal; 