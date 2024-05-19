import { Vector2 } from "./helpers";
import { RendererType, getRenderer } from "./renderer"

let inputState : {
    isMouseButtonDown : boolean,
    mousePosition     : Vector2,
    mouseDragOffset   : Vector2,
} = {
    isMouseButtonDown : false,
    mousePosition     : { x : 0, y : 0 },
    mouseDragOffset   : { x : 0, y : 0 },
};

export enum InputEventType {
    OnMouseMove = "onMouseMove",
};

let inputEvents : {
    [InputEventType.OnMouseMove] : Array<Function>,
} = {
    [InputEventType.OnMouseMove] : [],
};

export function initInputEvents() {
    const renderer = getRenderer();

    if (renderer.type === RendererType.Canvas) {
        const { canvas } = renderer.context;

        canvas.style.cursor = "grab";

        canvas.addEventListener("mousedown", ({ clientX, clientY }) => {
            inputState.isMouseButtonDown = true;
            inputState.mousePosition = { x : clientX, y : clientY };

            canvas.style.cursor = "grabbing";
        });

        window.addEventListener("mousemove", ({ clientX, clientY }) => {
            if (inputState.isMouseButtonDown) {
                inputState.mouseDragOffset.x = clientX - inputState.mousePosition.x;
                inputState.mouseDragOffset.y = clientY - inputState.mousePosition.y;

                inputEvents.onMouseMove.forEach(callback => callback());
            }

            inputState.mousePosition = { x : clientX, y : clientY };
        });
        window.addEventListener("mouseup", () => {
            inputState.isMouseButtonDown = false;
           
            canvas.style.cursor = "grab";
        });
    }
}

export function getInputState() {
    return inputState;
}

export function attachToInputEvent(event : InputEventType , callback : Function) {
    switch (event) {
        case InputEventType.OnMouseMove:
            inputEvents.onMouseMove.push(callback);
            break;

        default:
            throw new Error(`Unsupported event type: ${event}`);
    }
}
