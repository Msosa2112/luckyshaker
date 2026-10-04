"""
Builds the optimized can cut-outs used by the shop carousel.

Source : Media/cocteles/sin fondo/*.png   (transparent can renders, mixed sizes)
Output : shopify-theme/assets/can-<handle>.webp  (identical canvas, bottom aligned)

Every can is cropped to its real alpha bounding box, scaled to the same height
and centered on a common canvas so the carousel can treat them as equals.
Also prints a dominant "tint" colour per can (used for the soft colour aura).
"""
import colorsys
import os
import sys

from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC = os.path.join(ROOT, "Media", "cocteles", "sin fondo")
DST = os.path.join(ROOT, "shopify-theme", "assets")

# source file name (without .png)  ->  Shopify product handle
HANDLES = {
    "Margarita": "margarita",
    "blue hawaian": "blue-hawaii",
    "caipirinha": "caipirinha",
    "classic martini": "classic-martini",
    "cosmopolitan": "cosmopolitan",
    "daiquiri": "daiquiri",
    "expresso martini": "espresso-martini",
    "gin tonic": "gin-tonic",
    "mai tai": "mai-tai",
    "malibu bay breeze": "malibu-bay-breeze",
    "manhatan": "manhattan",
    "mimosa": "mimosa",
    "moscow mule": "moscow-mule",
    "negroni": "negroni",
    "old fashioned": "old-fashioned",
    "paloma": "paloma",
    "piña colada": "pina-colada",
    "sex on the beach": "sex-on-the-beach",
}

CAN_H = 1000          # can height inside the canvas
CANVAS_W, CANVAS_H = 640, 1040
ALPHA_CUT = 24        # ignore faint alpha dust when measuring the bbox


def real_bbox(im):
    alpha = im.getchannel("A").point(lambda a: 255 if a > ALPHA_CUT else 0)
    return alpha.getbbox()


def dominant_tint(im):
    """Saturation-weighted average colour of the opaque pixels."""
    small = im.resize((48, 96))
    r_sum = g_sum = b_sum = w_sum = 0.0
    for r, g, b, a in small.getdata():
        if a < 200:
            continue
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        w = (s ** 1.5) * (0.35 + v)
        r_sum += r * w
        g_sum += g * w
        b_sum += b * w
        w_sum += w
    if w_sum == 0:
        return "#C9CCD6"
    return "#%02X%02X%02X" % (int(r_sum / w_sum), int(g_sum / w_sum), int(b_sum / w_sum))


def main():
    os.makedirs(DST, exist_ok=True)
    tints = {}
    for name, handle in HANDLES.items():
        path = os.path.join(SRC, name + ".png")
        if not os.path.exists(path):
            print("MISSING", path)
            sys.exit(1)
        im = Image.open(path).convert("RGBA")
        box = real_bbox(im)
        can = im.crop(box)
        scale = CAN_H / can.height
        can = can.resize((max(1, round(can.width * scale)), CAN_H), Image.LANCZOS)
        canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
        canvas.alpha_composite(can, ((CANVAS_W - can.width) // 2, CANVAS_H - 20 - CAN_H))
        out = os.path.join(DST, "can-%s.webp" % handle)
        canvas.save(out, "WEBP", quality=86, method=6, alpha_quality=92)
        tints[handle] = dominant_tint(can)
        print("%-20s src=%s bbox=%s -> %s KB" % (handle, im.size, box, os.path.getsize(out) // 1024))
    print()
    for handle, tint in tints.items():
        print("%s:%s" % (handle, tint))


if __name__ == "__main__":
    main()
