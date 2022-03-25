import splineBehavior from 'vtk.js/Sources/Widgets/Widgets3D/SplineWidget/behavior';

export default function widgetBehavior(publicAPI, model) {
  // Inherit spline behavior
  splineBehavior(publicAPI, model);
  const superClass = { ...publicAPI };

  publicAPI.handleLeftButtonPress = (e) => {
    // First, run SplineWidget's handleLeftButtonPress
    const result = superClass.handleLeftButtonPress(e);
    // isDragging == true => a handle is being moved
    console.log('Is dragging?', model.isDragging);
    if (model.isDragging) {
      model.manipulator.setOrigin(model.activeState.getOrigin()); // activeState = current handle
    }

    return result;
  };
}
