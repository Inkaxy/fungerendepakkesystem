import React, { useEffect, useState } from 'react';
import { CheckCircle2, PartyPopper, Truck } from 'lucide-react';
import { DisplaySettings } from '@/types/displaySettings';
import { cn } from '@/lib/utils';

interface CompletionAnimationProps {
  isVisible: boolean;
  settings: DisplaySettings | undefined;
  customerName: string;
}

const CompletionAnimation = ({ isVisible, settings, customerName }: CompletionAnimationProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Delay content animation for entrance effect
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  if (!isVisible || !(settings?.customer_show_completion_animation ?? true)) {
    return null;
  }

  const completionMessage = settings?.customer_completion_message || 'Ferdig pakket!';
  const completedColor = settings?.status_completed_color || '#10b981';
  const reducedMotion = settings?.reduce_motion ?? false;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/60 backdrop-blur-sm",
        reducedMotion ? "" : "transition-opacity duration-500",
        showContent ? "opacity-100" : "opacity-0"
      )}
    >
      <div 
        className={cn(
          "text-center p-12 rounded-3xl max-w-lg mx-4",
          reducedMotion ? "" : "transform transition-all duration-700 ease-out",
          showContent ? "scale-100 translate-y-0" : (reducedMotion ? "scale-100" : "scale-75 translate-y-8")
        )}
        style={{
          backgroundColor: settings?.card_background_color || '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div className="flex justify-center gap-4 mb-6">
          <PartyPopper 
            className={cn(
              "h-12 w-12",
              !reducedMotion && "animate-bounce",
              showContent && !reducedMotion && "delay-200"
            )}
            style={{ color: '#f59e0b' }}
          />
          <CheckCircle2 
            className={cn(
              "h-16 w-16",
              showContent && !reducedMotion && "animate-pulse"
            )}
            style={{ color: completedColor }}
          />
          <PartyPopper 
            className={cn(
              "h-12 w-12 transform scale-x-[-1]",
              !reducedMotion && "animate-bounce",
              showContent && !reducedMotion && "delay-300"
            )}
            style={{ color: '#f59e0b' }}
          />
        </div>

        <h1 
          className={cn(
            "text-4xl font-bold mb-4",
            reducedMotion ? "" : "transform transition-all duration-500 delay-300",
            showContent ? "translate-y-0 opacity-100" : (reducedMotion ? "opacity-100" : "translate-y-4 opacity-0")
          )}
          style={{ color: completedColor }}
        >
          {completionMessage}
        </h1>

        <p 
          className={cn(
            "text-2xl font-medium mb-6",
            reducedMotion ? "" : "transform transition-all duration-500 delay-500",
            showContent ? "translate-y-0 opacity-100" : (reducedMotion ? "opacity-100" : "translate-y-4 opacity-0")
          )}
          style={{ color: settings?.text_color || '#374151' }}
        >
          {customerName}
        </p>

        <div 
          className={cn(
            "flex justify-center",
            reducedMotion ? "" : "transform transition-all duration-700 delay-700",
            showContent ? "translate-x-0 opacity-100" : (reducedMotion ? "opacity-100" : "-translate-x-12 opacity-0")
          )}
        >
          <div className="relative">
            <img
              src="/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png"
              alt="Varebil"
              className={cn("h-20 w-20 object-contain", !reducedMotion && "animate-bounce")}
            />
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full"
              style={{ backgroundColor: settings?.progress_bar_color || '#3b82f6' }}
            />
          </div>
        </div>

        <p 
          className={cn(
            "text-lg mt-6",
            reducedMotion ? "" : "transform transition-all duration-500 delay-1000",
            showContent ? "translate-y-0 opacity-100" : (reducedMotion ? "opacity-100" : "translate-y-4 opacity-0")
          )}
          style={{ color: settings?.text_color || '#6b7280', opacity: 0.7 }}
        >
          Alle produkter er ferdig pakket
        </p>
      </div>
    </div>
  );
};

export default CompletionAnimation;
