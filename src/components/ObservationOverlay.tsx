import { useState, useEffect } from 'react';

interface ObservationOverlayProps {
  message: string | null;
}

export function ObservationOverlay({ message }: ObservationOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  return (
    <div 
      className={`
        fixed top-0 left-0 w-full py-2 text-center text-sm
        text-muted-foreground/60 z-50
        transition-opacity duration-medium
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {message}
    </div>
  );
}
