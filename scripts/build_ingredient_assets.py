"""
Build the transparent ingredient sprites used by the cocktail "ingredient
atmosphere" layer of the can carousel.

Sources: Media/ingredientes/<name>.jpg  (photos shot on a flat magenta or
green backdrop).  Output: shopify-theme/assets/ing-<name>.webp (RGBA).

Chroma keying is done on "how magenta / how green" a pixel is (not on the
distance to one exact colour) so soft studio shadows and gradients in the
backdrop disappear too.  Edge spill is removed afterwards.

Run:  python scripts/build_ingredient_assets.py
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Media" / "ingredientes"
OUT = ROOT / "shopify-theme" / "assets"
MAX_SIDE = 560

MAGENTA = {
    "lime-wheel", "lime-half", "lemon-twist", "pineapple-wedge", "mint", "ginger",
    "coconut-half", "agave", "juniper", "sea-salt", "olive",
}
GREEN = {
    "lemon-wheel", "orange-wheel", "orange-peel", "grapefruit-half", "peach",
    "cranberries", "coffee-beans", "sugar-cubes", "cherry",
}


def smoothstep(x, a, b):
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def key(arr, mode):
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    if mode == "magenta":
        m = np.minimum(r, b) - g          # high on a magenta backdrop
    else:
        m = g - np.maximum(r, b)          # high on a green backdrop
    alpha = 1.0 - smoothstep(m, 38.0, 96.0)

    # spill suppression: pull the backdrop tint out of the kept pixels
    out = arr.copy()
    if mode == "magenta":
        spill = np.clip(m - 2.0, 0.0, None)
        out[..., 0] = r - spill
        out[..., 2] = b - spill
    else:
        # no green subject sits on a green backdrop, so green can never exceed red/blue by much
        out[..., 1] = np.minimum(g, np.maximum(r, b) + 3.0)
    return np.clip(out, 0, 255), alpha


def clean_alpha(alpha):
    solid = alpha > 0.5
    lab, n = ndi.label(solid)
    if n > 1:
        sizes = ndi.sum(solid, lab, range(1, n + 1))
        keep = sizes >= max(60, sizes.max() * 0.004)
        mask = np.isin(lab, np.nonzero(keep)[0] + 1)
        grown = ndi.binary_dilation(mask, iterations=6)
        alpha = np.where(grown, alpha, 0.0)
    # fill pin-holes inside the subject
    filled = ndi.binary_fill_holes(alpha > 0.5)
    holes = filled & (alpha <= 0.5)
    hole_lab, hn = ndi.label(holes)
    if hn:
        hs = ndi.sum(holes, hole_lab, range(1, hn + 1))
        small = np.isin(hole_lab, np.nonzero(hs < 120)[0] + 1)
        alpha = np.where(small, 1.0, alpha)
    # shave the 1px halo, then soften
    alpha = ndi.minimum_filter(alpha, size=3)
    alpha = ndi.gaussian_filter(alpha, 0.7)
    return np.clip(alpha, 0.0, 1.0)


def build(path):
    name = path.stem
    mode = "magenta" if name in MAGENTA else "green"
    img = Image.open(path).convert("RGB")
    arr = np.asarray(img).astype(np.float32)
    rgb, alpha = key(arr, mode)
    alpha = clean_alpha(alpha)

    rgba = np.dstack([rgb, alpha * 255.0]).astype(np.uint8)
    im = Image.fromarray(rgba, "RGBA")
    bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        im = im.crop(bbox)
    im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    out = OUT / f"ing-{name}.webp"
    im.save(out, "WEBP", quality=84, method=6)
    return out, im.size


if __name__ == "__main__":
    for p in sorted(SRC.glob("*.jpg")):
        out, size = build(p)
        print(f"{p.name:24s} -> {out.name:28s} {size[0]}x{size[1]}  {out.stat().st_size // 1024} KB")
