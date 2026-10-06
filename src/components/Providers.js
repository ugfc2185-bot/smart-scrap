'use client';
import { AppProvider, useApp } from '@/context/AppContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const icons = { success: <CheckCircle size={18}/>, error: <AlertCircle size={18}/>, info: <Info size={18}/> };
  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type}`}>
        {icons[toast.type] || icons.info}
        {toast.message}
      </div>
    </div>
  );
}

function Inner({ children }) {
  return (
    <>
      {children}
      <Toast />
    </>
  );
}

export default function Providers({ children }) {
  return (
    <AppProvider>
      <Inner>{children}</Inner>
    </AppProvider>
  );
}
