import 'vtk.js/Sources/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import 'vtk.js/Sources/Rendering/Profiles/All';

import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkSplineTubeWidget from 'vtk.js/Sources/Widgets/Widgets3D/SplineTubeWidget';
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
import vtkPlane from 'vtk.js/Sources/Common/DataModel/Plane';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// ----------------------------------------------------------------------------
// Widget manager
// ----------------------------------------------------------------------------

const widgetManager = vtkWidgetManager.newInstance();
widgetManager.setRenderer(renderer);

const widget = vtkSplineTubeWidget.newInstance();

const widgetRepresentation = widgetManager.addWidget(widget);

const plane = vtkPlane.newInstance();
plane.setNormal(0.0, 0.0, 1.0);
plane.setOrigin(0.0, 0.0, 0.0);

const points = [
  [-1.0, -1.0, 0.0],
  [-1.0, 1.0, 0.0],
  [1.0, 1.0, 0.0],
  [1.0, -1.0, 0.0],
];

points.forEach((pt) => {
  const handle = widgetRepresentation.getWidgetState().addHandle();
  handle.setOrigin(pt);
});

widgetRepresentation.setPlane(plane);
widgetRepresentation.setHandleSizeInPixels(20);

widgetRepresentation.grabFocus();

renderWindow.render();
renderer.resetCamera();
