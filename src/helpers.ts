export type Vector2 = {
    x : number,
    y : number,
};

export function calculateScaleFactor(
    srcWidth    : number,
    srcHeight   : number,
    destWidth  ?: number,
    destHeight ?: number
) : number {
    let scaleX = 1;
    let scaleY = 1;

    if (destWidth) {
        scaleX = destWidth / srcWidth;
    }
    if (destHeight) {
        scaleY = destHeight / srcHeight;
    }

    // Keep aspect ratio
    return Math.min(scaleX, scaleY);
}
