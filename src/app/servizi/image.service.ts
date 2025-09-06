import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly basePath = '/assets/images';

  constructor() { }

  /**
   * Costruisce l'URL completo per l'immagine del ristorante
   * @param filename Nome del file (es: "rist1.jpg")
   * @returns URL completo (es: "/assets/images/ristoranti/rist1.jpg")
   */
  getRistoranteImageUrl(filename: string | null | undefined): string {
    if (!filename) {
      // Restituisce un placeholder SVG inline
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f8f9fa"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="18" fill="#6c757d">
            Immagine non disponibile
          </text>
        </svg>
      `);
    }
    return `${this.basePath}/ristoranti/${filename}`;
  }

  /**
   * Costruisce l'URL completo per l'immagine del menu
   * @param filename Nome del file (es: "menu1.jpg")
   * @returns URL completo (es: "/assets/images/menu/menu1.jpg")
   */
  getMenuImageUrl(filename: string | null | undefined): string {
    if (!filename) {
      return `${this.basePath}/menu/placeholder.jpg`; // immagine di default
    }
    return `${this.basePath}/menu/${filename}`;
  }

  /**
   * Gestisce l'errore di caricamento immagine
   * @param event Evento di errore
   */
  onImageError(event: any): void {
    const img = event.target as HTMLImageElement;
    // Fallback su immagine placeholder SVG
    img.src = 'data:image/svg+xml;base64,' + btoa(`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="18" fill="#6c757d">
          Immagine non trovata
        </text>
      </svg>
    `);
  }
}
