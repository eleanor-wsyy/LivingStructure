/**
 * Living Images Algorithm Implementation
 * Based on "Living Images: A Recursive Approach to Computing the Structural Beauty"
 * by Bin Jiang & Chris de Rijke.
 */

// Head/Tail Breaks to calculate Hierarchy (H)
export function calculateHTBreaks(data: number[]): number {
  if (!data || data.length === 0) return 0;
  if (data.length === 1) return 1;

  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const head = data.filter((val) => val > mean);
  
  // The head must be a minority (less than or equal to 50% usually, or just < 50%)
  if (head.length > 0 && head.length <= data.length / 2) {
    return 1 + calculateHTBreaks(head);
  }
  return 1;
}

export interface Point {
  x: number;
  y: number;
}

export interface Substructure {
  id: number;
  pixels: Point[];
  area: number;
  boundingBox: { minX: number; minY: number; maxX: number; maxY: number };
  centroid: Point;
  // Indicates if this substructure is decomposable (has variance, big enough)
  isDecomposable: boolean; 
  children: Substructure[];
  depth: number;
}

export interface ComputationResult {
  S: number; // Number of substructures at root
  H: number; // HT levels at root
  L: number; // L = S * H at root
  LR: number; // Recursive L = sum(S_i * H_i)
  D: number; // Number of decomposable substructures
  V: number; // V = D * I (I is max depth/iterations)
  maxDepth: number;
  rootSubstructures: Substructure[];
  allDecomposable: Substructure[];
}

/**
 * Flood-fill Connected Component Labeling
 */
function getConnectedComponents(
  width: number,
  height: number,
  figureMask: boolean[][]
): Point[][] {
  const visited = Array.from({ length: height }, () => new Array(width).fill(false));
  const components: Point[][] = [];

  // 8-way connectivity
  const dirs = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (figureMask[y][x] && !visited[y][x]) {
        // Start new component (BFS)
        const comp: Point[] = [];
        const queue: Point[] = [{ x, y }];
        visited[y][x] = true;

        let head = 0;
        while (head < queue.length) {
          const p = queue[head++];
          comp.push(p);

          for (const [dx, dy] of dirs) {
            const nx = p.x + dx;
            const ny = p.y + dy;
            if (
              nx >= 0 && nx < width &&
              ny >= 0 && ny < height &&
              figureMask[ny][nx] &&
              !visited[ny][nx]
            ) {
              visited[ny][nx] = true;
              queue.push({ x: nx, y: ny });
            }
          }
        }
        components.push(comp);
      }
    }
  }

  return components;
}

/**
 * Recursive decomposition of an image/mask.
 * Since this can be slow, we limit depth and max area.
 */
let decomposableCount = 0;
let lrSum = 0;
let nextId = 1;
const allDecompRefs: Substructure[] = [];

function decomposeRecursive(
  imgData: Uint8ClampedArray,
  width: number,
  height: number,
  mask: Point[],
  depth: number,
  maxDepthLimit: number = 8
): Substructure[] {
  if (depth > maxDepthLimit) return [];
  if (mask.length < 9) return []; // Too small to decompose

  // 1. Calculate mean luminance of the MASKED region
  let sumLuminance = 0;
  let minL = 255;
  let maxL = 0;
  
  for (const p of mask) {
    // Grayscale luminance (0.299 R + 0.587 G + 0.114 B) or just read pre-computed
    const idx = (p.y * width + p.x) * 4;
    const l = 0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2];
    sumLuminance += l;
    if (l < minL) minL = l;
    if (l > maxL) maxL = l;
  }

  // If there's no variance, we can't decompose
  if (maxL - minL < 2) return [];

  const meanL = sumLuminance / mask.length;

  // 2. Dichotomy
  let darkCount = 0;
  let lightCount = 0;
  
  // We need to map which pixel goes to which
  // true = minority (Figure)
  const isDarkMinority = (() => {
    for (const p of mask) {
      const idx = (p.y * width + p.x) * 4;
      const l = 0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2];
      if (l <= meanL) darkCount++;
      else lightCount++;
    }
    return darkCount <= lightCount;
  })();

  // Build a local boolean mask for CCL
  // To save memory, we find the bounding box of the current mask
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (const p of mask) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const localMask = Array.from({ length: h }, () => new Array(w).fill(false));

  for (const p of mask) {
    const idx = (p.y * width + p.x) * 4;
    const l = 0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2];
    const isFigure = isDarkMinority ? (l <= meanL) : (l > meanL);
    if (isFigure) {
      localMask[p.y - minY][p.x - minX] = true;
    }
  }

  // 3. Vectorization (CCL)
  const localComponents = getConnectedComponents(w, h, localMask);

  // Translate local coordinates back to global
  const substructures: Substructure[] = localComponents.map(comp => {
    let sX = 0, sY = 0;
    let bMinX = width, bMinY = height, bMaxX = 0, bMaxY = 0;
    
    const globalComp = comp.map(p => {
      const gx = p.x + minX;
      const gy = p.y + minY;
      sX += gx; sY += gy;
      if (gx < bMinX) bMinX = gx;
      if (gy < bMinY) bMinY = gy;
      if (gx > bMaxX) bMaxX = gx;
      if (gy > bMaxY) bMaxY = gy;
      return { x: gx, y: gy };
    });

    const isDecomposable = globalComp.length >= 9 && depth < maxDepthLimit;

    const sub: Substructure = {
      id: nextId++,
      pixels: globalComp,
      area: globalComp.length,
      boundingBox: { minX: bMinX, minY: bMinY, maxX: bMaxX, maxY: bMaxY },
      centroid: { x: sX / globalComp.length, y: sY / globalComp.length },
      isDecomposable,
      children: [],
      depth: depth + 1
    };

    return sub;
  });

  // Filter out microscopic noise (e.g. area < 3)
  const validSubstructures = substructures.filter(s => s.area > 3);
  
  if (validSubstructures.length === 0) return [];

  // Calculate H for this level
  const areas = validSubstructures.map(s => s.area);
  const H = calculateHTBreaks(areas);
  const S = validSubstructures.length;
  
  lrSum += (S * H);
  decomposableCount++;

  // Record this as a decomposable node (the parent of these substructures)
  // Wait, decomposableCount is D.
  
  for (const sub of validSubstructures) {
    if (sub.isDecomposable) {
      sub.children = decomposeRecursive(imgData, width, height, sub.pixels, depth + 1, maxDepthLimit);
      if (sub.children.length > 0) {
        allDecompRefs.push(sub);
      }
    }
  }

  return validSubstructures;
}

/**
 * Main entry point for the algorithm.
 */
export async function computeLivingImages(
  imageData: ImageData,
  maxDepthLimit: number = 6
): Promise<ComputationResult> {
  // Reset globals
  decomposableCount = 0; // Starts at 1 for the root image itself
  lrSum = 0;
  nextId = 1;
  allDecompRefs.length = 0;

  const width = imageData.width;
  const height = imageData.height;

  // Root mask is all pixels
  const rootMask: Point[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      rootMask.push({ x, y });
    }
  }

  // To prevent freezing on large images, one should scale down the image before calling this.
  // Recommended size: 200x200 or 300x300 max.

  const rootSubstructures = decomposeRecursive(imageData.data, width, height, rootMask, 0, maxDepthLimit);

  // Root level stats
  const S = rootSubstructures.length;
  const areas = rootSubstructures.map(s => s.area);
  const H = calculateHTBreaks(areas);
  const L = S * H;
  
  // D is the number of decomposable substructures. 
  // The image itself is decomposable (root), so we add 1.
  const D = allDecompRefs.length + 1; 

  // Max depth achieved
  let maxDepth = 0;
  for (const d of allDecompRefs) {
    if (d.depth > maxDepth) maxDepth = d.depth;
  }
  const I = maxDepth + 1;
  const V = D * I;

  return {
    S,
    H,
    L,
    LR: lrSum,
    D,
    V,
    maxDepth,
    rootSubstructures,
    allDecomposable: allDecompRefs
  };
}
