import { useEffect, useState } from "react";

/**
 * Reports whether the viewport is a portrait-shaped small screen (phone held
 * upright). Read after mount so SSR and hydration agree.
 */
export function useIsPortraitPhone() {
  const [isPortraitPhone, setIsPortraitPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait) and (max-width: 1023px)");
    const update = () => setIsPortraitPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isPortraitPhone;
}
