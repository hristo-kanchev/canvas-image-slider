import { RendererType, getRenderer } from "./renderer";

export enum AssetType {
    Image = "Image",
};

export type AssetResource = {
    type : AssetType,
    path : string,
};

export type Asset = CanvasImage; 

type CanvasImage = {
    resource : AssetResource,
    data     : HTMLImageElement,
};

let assets : Array<Asset> = [];

export function loadAssets(assetsToLoad : Array<Asset>) {
    assetsToLoad.forEach(asset => loadAsset(asset));
}

export function loadAsset(asset : Asset) {
    assets.push(asset);
}

export function getAssets() {
    return assets;
}

export function addAsset(resource : AssetResource) : Promise<Asset>{
    const renderer = getRenderer();

    const promise = new Promise<Asset>((resolve, reject) => {
        switch (resource.type) {
            case AssetType.Image:
                if (renderer.type === RendererType.Canvas) {
                    const image = new Image();

                    image.src = resource.path;
                    image.addEventListener("load", () => {
                        resolve({
                            resource,
                            data : image, 
                        });
                    });
                    
                    image.addEventListener("error", () => {
                        reject(`Unable to load asset with path: ${resource.path}`);
                    });
                }

                break;
            default:
                reject(`Unsupported asset type: ${resource.type}`);
        }
    });

    return promise;
}
