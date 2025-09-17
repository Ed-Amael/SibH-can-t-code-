// Fix for Leaflet default icons in Next.js
export async function fixLeafletIcons() {
  if (typeof window !== 'undefined') {
    const L = await import('leaflet')
    
    // Create a simple blue icon for all markers
    const createIcon = (color = '#3b82f6') => {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transform: rotate(-45deg);
          position: relative;
          top: -12px;
          left: -12px;
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null
      })
    }

    // Override the default icon
    L.Icon.Default.mergeOptions({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#3b82f6" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `),
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
      shadowUrl: null,
      shadowSize: null,
      shadowAnchor: null
    })
  }
}