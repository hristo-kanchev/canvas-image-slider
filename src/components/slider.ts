import { AssetType, addAsset, getAssets, loadAssets } from "../assets";
import { Vector2, calculateScaleFactor } from "../helpers";
import { InputEventType, attachToInputEvent, getInputState } from "../input";
import { clearRenderTarget, drawFrame, drawImage, getRenderer } from "../renderer";

import slide0Url from "../../assets/0.jpg";
import slide1Url from "../../assets/1.jpg";
import slide2Url from "../../assets/2.jpg";
import slide3Url from "../../assets/3.jpg";

export async function initImageSlider() {
    const renderer = getRenderer();

    loadAssets([
        await addAsset({
            type: AssetType.Image,
            path: slide0Url,
        }),
        await addAsset({
            type: AssetType.Image,
            path: slide1Url,
        }),
        await addAsset({
            type: AssetType.Image,
            path: slide2Url,
        }),
        await addAsset({
            type: AssetType.Image,
            path: slide3Url,
        }),
    ]);

    const assets     = getAssets();
    const inputState = getInputState();

    const sliderPosition : Vector2 = { x : 0, y : 0 };
    const minDragDistance = 0;
    const maxDragDistance = -renderer.width * (assets.length - 1);

    attachToInputEvent(InputEventType.OnMouseMove, () => {
        clearRenderTarget();

        const updatedPosition : Vector2 = {
            x : sliderPosition.x + inputState.mouseDragOffset.x,
            y : sliderPosition.y + inputState.mouseDragOffset.y,
        };
        const isInBounds = updatedPosition.x <= minDragDistance && updatedPosition.x >= maxDragDistance;

        if (isInBounds) {
            sliderPosition.x = updatedPosition.x;
        } else {
            /**
             * IMPORTANT: 
             * If not in bounds make sure to set the slider position
             * to the closest drag position- start or end.
             * Otherwise it the slides will get "stuck" in a weird state.
             */
            sliderPosition.x = Math.sign(inputState.mouseDragOffset.x) === 1 ? minDragDistance : maxDragDistance;
        }

        drawFrame(draw);
    });
    
    drawFrame(draw);

    function draw() {
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            const scale = calculateScaleFactor(
                asset.data.width,
                asset.data.height,
                renderer.width,
                renderer.height,
            );
            const xOffset = Math.floor(renderer.width  - asset.data.width  * scale) * 0.5;
            const yOffset = Math.floor(renderer.height - asset.data.height * scale) * 0.5;
            const position : Vector2 = {
                x : renderer.width * i,
                y : 0,
            };

            position.x += xOffset;
            position.y += yOffset;

            position.x += sliderPosition.x;

            drawImage(asset, position, scale);
        }
    }
}
