'use client'
import React, { useEffect } from 'react';

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Forçar tema verde em todos os elementos
    const applyTheme = () => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.style) {
          htmlElement.style.setProperty('background-color', '#122112', 'important');
          htmlElement.style.setProperty('color', 'white', 'important');
        }
      });
      
      // Forçar no body e html
      document.body.style.setProperty('background-color', '#122112', 'important');
      document.body.style.setProperty('color', 'white', 'important');
      document.documentElement.style.setProperty('background-color', '#122112', 'important');
    };

    // Aplicar imediatamente
    applyTheme();
    
    // Aplicar novamente após um delay
    setTimeout(applyTheme, 100);
    setTimeout(applyTheme, 500);
    setTimeout(applyTheme, 1000);
    
    // Observer para elementos que são adicionados dinamicamente
    const observer = new MutationObserver(() => {
      applyTheme();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#122112', 
      color: 'white', 
      minHeight: '100vh',
      width: '100%'
    }}>
      {children}
    </div>
  );
};

export default ThemeWrapper;



