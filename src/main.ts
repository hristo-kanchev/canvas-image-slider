import "./style.css";

import { initRenderer, RendererType } from "./renderer";
import { initImageSlider } from "./components/slider";
import { initInputEvents } from "./input";

const DEFAULT_RENDERER_WIDTH  = 640;
const DEFAULT_RENDERER_HEIGHT = 400;

init();

function init() {
    initRenderer(RendererType.Canvas, DEFAULT_RENDERER_WIDTH, DEFAULT_RENDERER_HEIGHT);
    initInputEvents();
    initImageSlider();
}
