declare global {
  interface Window {
    FlutterwaveCheckout?: (config: Record<string, unknown>) => void;
  }
}

let loadPromise: Promise<void> | null = null;

export function loadFlutterwaveScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Flutterwave can only load in the browser"));
  }
  if (window.FlutterwaveCheckout) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Flutterwave"));
    document.body.appendChild(script);
  });

  return loadPromise;
}
