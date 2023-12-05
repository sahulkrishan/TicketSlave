import {
  DynamicScheme,
  Hct,
  QuantizerCelebi,
  SchemeContent, SchemeTonalSpot,
  SchemeVibrant,
  Score
} from "@material/material-color-utilities";
import {FastAverageColor, FastAverageColorResult, FastAverageColorRgba} from "fast-average-color";

interface IDynamicScheme {
  new(sourceColorHct: Hct, isDark: boolean, contrastLevel: number): DynamicScheme;
}

export class AdaptiveColor {
  quantizeMaxColorCount: number = 64;
  imageTargetWidth: number = 128;
  imageTargetHeight: number = 128;

  /**
   * Generate Material Color Scheme from image.
   * Uses FastAverageColor to generate a DynamicScheme from an image
   * @param imageSrc image source to derive color scheme from
   * @param isDark Whether the scheme is in dark mode or light mode.
   * @param schemeType type of DynamicScheme color to generate. Defaults to SchemeVibrant
   */
  getSchemeFromImageFast(
    imageSrc: string,
    isDark: boolean = false,
    schemeType: IDynamicScheme = SchemeTonalSpot,
  ) {
    return new Promise<SchemeContent>((resolve) => {
      this.getFastAverageColor(imageSrc).then(color => {
        const argb = this.fastAverageColorRgbaToArgbInt(color.value);
        console.log(color.rgba)
          const scheme = new schemeType(Hct.fromInt(argb), isDark, 0.39);
        resolve(scheme);
      })
    });
  }

  getFastAverageColor(imageSrc: string) {
    return new Promise<FastAverageColorResult>((resolve) => {
      const fac = new FastAverageColor();
      fac.getColorAsync(imageSrc)
        .then(color => {
          resolve(color);
        })
        .catch(e => {
          console.log(e);
        });
    });
  }


  /**
   * Generate Material Color Scheme from image.
   * Uses Material QuantizerCelebi and Score to generate a DynamicScheme from an image
   * @param imageSrc image source to derive color scheme from
   * @param schemeType type of DynamicScheme color to generate. Defaults to SchemeVibrant
   * @param maxColors maximum number of colors to use in quantization. Defaults to 32
   * @param targetWidth target width of image to use in quantization. Defaults to 64px
   * @param targetHeight target height of image to use in quantization Defaults to 64px
   */
  getSchemeFromImage(
    imageSrc: string,
    schemeType: IDynamicScheme = SchemeVibrant,
    maxColors: number = this.quantizeMaxColorCount,
    targetWidth: number = this.imageTargetWidth,
    targetHeight: number = this.imageTargetHeight
  ) {
    return new Promise<SchemeContent>((resolve) => {
      this.imageToPixels(imageSrc, targetWidth, targetHeight)
        .then((pixels) => {
          const quantizerResult = QuantizerCelebi.quantize(pixels, maxColors);
          const scoredColors = Score.score(quantizerResult);
          const scheme = new schemeType(Hct.fromInt(scoredColors[0]), false, 0);
          resolve(scheme);
        });
    });
  }

  fastAverageColorRgbaToArgbInt(rgba: FastAverageColorRgba): number {
    // Shifting the color components to form the ARGB value
    let argbInt = (rgba[3] << 24) | (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];

    // Masking the value to ensure it's a 32-bit integer
    argbInt = argbInt >>> 0; // Using unsigned right shift to convert to unsigned 32-bit int

    return argbInt;
  }

  argbIntToRgba(argb: number): string {
    const alpha = (argb >> 24) & 0xff; // Extract alpha component
    const red = (argb >> 16) & 0xff;   // Extract red component
    const green = (argb >> 8) & 0xff;  // Extract green component
    const blue = argb & 0xff;          // Extract blue component

    // Construct the RGBA CSS string
    return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
  }

  argbIntToRgb(argb: number, alpha: number = 1): string {
    const red = (argb >> 16) & 0xff;   // Extract red component
    const green = (argb >> 8) & 0xff;  // Extract green component
    const blue = argb & 0xff;          // Extract blue component

    // Construct the RGBA CSS string
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  async imageToPixels(imageSrc: string, targetWidth: number, targetHeight: number): Promise<number[]> {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          const resizedCanvas = await this.resizeImage(img, targetWidth, targetHeight);
          const bitmap = await createImageBitmap(resizedCanvas);

          const pixelsArray = new Uint32Array(targetWidth * targetHeight);
          const offscreen = new OffscreenCanvas(targetWidth, targetHeight);
          const ctx = offscreen.getContext('2d');

          if (!ctx) {
            reject(new Error('OffscreenCanvas 2D context is not supported'));
            return;
          }

          ctx.drawImage(bitmap, 0, 0);
          const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
          const imageDataArray = new Uint32Array(imageData.data.buffer);

          pixelsArray.set(imageDataArray);

          resolve(Array.from(pixelsArray));
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = imageSrc;
    });
  }

  async resizeImage(image: HTMLImageElement, targetWidth: number, targetHeight: number): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Canvas 2D context is not supported'));
        return;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      resolve(canvas);
    });
  }


}
