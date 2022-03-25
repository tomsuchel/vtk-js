import macro from 'vtk.js/Sources/macros';
import vtkSplineWidget from 'vtk.js/Sources/Widgets/Widgets3D/SplineWidget';
import vtkSphereHandleRepresentation from 'vtk.js/Sources/Widgets/Representations/SphereHandleRepresentation';
import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

import vtkSplineTubeContextRepresentation from 'vtk.js/Sources/Widgets/Representations/SplineTubeContextRepresentation';
import widgetBehavior from './behavior';

function vtkSplineTubeWidget(publicAPI, model) {
  model.classHierarchy.push('vtkSplineTubeWidget');

  /* eslint-disable */
  model.methodsToLink = [
    'outputBorder',
    'fill',
    'borderColor',
    'errorBorderColor',
    'plane',
  ];

  model.behavior = widgetBehavior;

  publicAPI.getRepresentationsForViewType = (viewType) => {
    switch (viewType) {
      case ViewTypes.DEFAULT:
      case ViewTypes.GEOMETRY:
      case ViewTypes.SLICE:
      case ViewTypes.VOLUME:
      default:
        return [
          {
            builder: vtkSphereHandleRepresentation,
            labels: ['handles', 'moveHandle'],
            initialValues: {
              scaleInPixels: true,
            },
          },
          {
            builder: vtkSplineTubeContextRepresentation,
            labels: ['handles', 'moveHandle'],
          },
        ];
    }
  };
}

const DEFAULT_VALUES = {};

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkSplineWidget.extend(publicAPI, model, initialValues);

  vtkSplineTubeWidget(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'vtkSplineTubeWidget');
// ----------------------------------------------------------------------------

export default { newInstance, extend };
