import { Asset, AssetType } from "./assets";
import { Vector2 } from "./helpers";

export enum RendererType {
    Canvas = "Canvas",
}

export type Renderer = CanvasRenderer;

type BaseRenderer = {
    type   : RendererType,
    width  : number,
    height : number,
};

type CanvasRenderer = BaseRenderer & {
    context : CanvasRenderingContext2D, 
};

let renderer : Renderer;

export function initRenderer(type : RendererType, width : number, height : number) {
    switch (type) {
        case RendererType.Canvas:
            const canvas = document.createElement("canvas");

            canvas.width  = width;
            canvas.height = height;

            document.getElementById("render-target")!.prepend(canvas);

            renderer = {
                type,
                width,
                height,
                context : canvas.getContext("2d")!,
            };

            break;
        default:
            throw new Error("Unsupported renderer type");
    }
}

export function getRenderer() {
    return renderer;
}

export function clearRenderTarget() {
    const renderer = getRenderer();

    switch (renderer.type) {
        case RendererType.Canvas:
            renderer.context.clearRect(0, 0, renderer.width, renderer.height);
            
            break;
        default:
            throw new Error("Unsupported renderer type");
    }
}

export function drawFrame(callback : (time : number) => void) {
    const renderer = getRenderer();

    switch (renderer.type) {
        case RendererType.Canvas:
            const { canvas } = renderer.context;

            requestAnimationFrame((time : number) => {
                renderer.context.fillStyle = "rgb(242, 242, 242)";
                renderer.context.fillRect(0, 0, canvas.width, canvas.height)

                callback(time);
            });

            break;
        default:
            throw new Error("Unsupported renderer type");
    }
}

export function drawImage(asset : Asset, position : Vector2, scale = 1) {
    if (asset.resource.type !== AssetType.Image) {
        throw new Error(`Passed asset is not an ${asset.resource.type} asset.`)
    }

    const renderer = getRenderer();

    switch (renderer.type) {
        case RendererType.Canvas:
            renderer.context.drawImage(
                asset.data,
                position.x,
                position.y, 
                asset.data.width * scale,
                asset.data.height * scale
            );
            
            break;
        default:
            throw new Error("Unsupported renderer type");
    }
}
