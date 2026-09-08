import { useCallback, useEffect, useState } from "react";

/**
 * Reports whether the viewport is a portrait-shaped small screen (phone held
 * upright). Measured from actual box size so it also works inside embedded
 * previews where media-query orientation can be unreliable. Read after mount so
 * SSR and hydration agree. The user can override with `showAnyway`.
 */
export function useIsPortraitPhone() {
  const [isPortraitPhone, setIsPortraitPhone] = useState(false);
  const [override, setOverride] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Narrow screen that is taller than it is wide: upright phone.
      setIsPortraitPhone(w < 1024 && h > w);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    const mq = window.matchMedia("(orientation: portrait)");
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      mq.removeEventListener("change", update);
    };
  }, []);

  const showAnyway = useCallback(() => setOverride(true), []);

  return { isPortraitPhone: isPortraitPhone && !override, showAnyway };
}
