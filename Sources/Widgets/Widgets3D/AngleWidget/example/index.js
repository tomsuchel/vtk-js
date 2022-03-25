import 'vtk.js/Sources/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import 'vtk.js/Sources/Rendering/Profiles/Geometry';
import 'vtk.js/Sources/Rendering/Profiles/Glyph';

import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkAngleWidget from 'vtk.js/Sources/Widgets/Widgets3D/AngleWidget';
// import vtkDistanceWidget from 'vtk.js/Sources/Widgets/Widgets3D/DistanceWidget';
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
import vtkPlane from 'vtk.js/Sources/Common/DataModel/Plane';
import vtkLineWidget from 'vtk.js/Sources/Widgets/Widgets3D/LineWidget';

import controlPanel from './controlPanel.html';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();

const cone = vtkCubeSource.newInstance();
const mapper = vtkMapper.newInstance();
const actor = vtkActor.newInstance();

actor.setMapper(mapper);
mapper.setInputConnection(cone.getOutputPort());
actor.getProperty().setOpacity(0.5);

renderer.addActor(actor);

// ----------------------------------------------------------------------------
// Widget manager
// ----------------------------------------------------------------------------

const widgetManager = vtkWidgetManager.newInstance();
widgetManager.setRenderer(renderer);

const plane = vtkPlane.newInstance();
plane.setNormal(0.0, 0.0, 1.0);
plane.setOrigin(0.0, 0.0, 0.0);

/* Angle widget */
const angleWidget = vtkAngleWidget.newInstance();

const anglePoints = [
  [-0.5, 0.5, -0.5],
  [-0.5, -0.5, 0.5],
  [0.5, -0.5, -0.5],
];

anglePoints.forEach((pt) => {
  const handle = angleWidget.getWidgetState().addHandle();
  handle.setOrigin(pt);
});

widgetManager.addWidget(angleWidget);

console.log('angle =', angleWidget.getAngle());

/* Distance widget */
const distanceWidget = vtkLineWidget.newInstance();

// const distancePoints = [
//   [-0.5, -0.5, 0.5],
//   [0.5, 0.5, 0.5],
// ];

// distancePoints.forEach((pt) => {
//   const handle = distanceWidget.getWidgetState().addHandle();
//   handle.setOrigin(pt);
// });

distanceWidget.getWidgetState().getHandle1().setOrigin([-0.5, -0.5, -0.5]);
distanceWidget.getWidgetState().getHandle2().setOrigin([0.5, 0.5, 0.5]);
distanceWidget.getWidgetState().getHandle1().setShape('sphere');
distanceWidget.getWidgetState().getHandle2().setShape('sphere');

const distanceHandle = widgetManager.addWidget(distanceWidget);

distanceHandle.updateHandleVisibility(0);
distanceHandle.updateHandleVisibility(1);

console.log('distance =', distanceWidget.getDistance());

renderer.resetCamera();
widgetManager.enablePicking();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);

document.querySelector('button').addEventListener('click', () => {
  widgetManager.grabFocus(angleWidget);
});

// -----------------------------------------------------------
// globals
// -----------------------------------------------------------

// global.widget = angleWidget;
