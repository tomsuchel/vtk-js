import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';

/**
 * 
 */
interface IAxesActorInitialValues {}

export interface vtkAxesActor extends vtkActor {

    /**
     * 
     */
    getConfig(): object;

    /**
     * 
     */
    getXAxisColor(): number[];

    /**
     * 
     */
    getXAxisColorByReference(): number[];

    /**
     * 
     */
    getYAxisColor(): number[];

    /**
     * 
     */
    getYAxisColorByReference(): number[];

    /**
     * 
     */
    getZAxisColor(): number[];

    /**
     * 
     */
    getZAxisColorByReference(): number[];

    /**
     * 
     * @param config 
     */
    setConfig(config: object): boolean;

    /**
     * 
     * @param r 
     * @param g 
     * @param b 
     */
    setXAxisColor(r: number, g: number, b: number): boolean;

    /**
     * 
     * @param XAxisColor 
     */
    setXAxisColorFrom(XAxisColor: number[]): boolean;

    /**
     * 
     * @param r 
     * @param g 
     * @param b 
     */
    setYAxisColor(r: number, g: number, b: number): boolean;

    /**
     * 
     * @param YAxisColor 
     */
    setYAxisColorFrom(YAxisColor: number[]): boolean;

    /**
     * 
     * @param r 
     * @param g 
     * @param b 
     */
    setZAxisColor(r: number, g: number, b: number): boolean;

    /**
     * 
     * @param ZAxisColor 
     */
    setZAxisColorFrom(ZAxisColor: number[]): boolean;

    /**
     * 
     */
    update(): void;
}

/**
 * Method use to decorate a given object (publicAPI+model) with vtkAxesActor characteristics.
 *
 * @param publicAPI object on which methods will be bounds (public)
 * @param model object on which data structure will be bounds (protected)
 * @param {IAxesActorInitialValues} [initialValues] (default: {})
 */
export function extend(publicAPI: object, model: object, initialValues?: IAxesActorInitialValues): void;

/**
 * Method use to create a new instance of vtkAxesActor.
 * @param initialValues for pre-setting some of its content
 */
export function newInstance(initialValues?: IAxesActorInitialValues): vtkAxesActor;

/** 
 * vtkAxesActor is a hybrid 2D/3D actor used to represent 3D axes in a scene. 
 * The user can define the geometry to use for the shaft or the tip, 
 * and the user can set the text for the three axes. The text will appear 
 * to follow the camera since it is implemented by means of vtkCaptionActor2D. 
 * All of the functionality of the underlying vtkCaptionActor2D objects are accessible so that, 
 * for instance, the font attributes of the axes text can be manipulated through vtkTextProperty. 
 * Since this class inherits from vtkProp3D, one can apply a user transform to the underlying 
 * geometry and the positioning of the labels. For example, a rotation transform could be used to 
 * generate a left-handed axes representation.
 * @see [vtkAnnotatedCubeActor](./Rendering_Core_AnnotatedCubeActor.html)
 * @see [vtkOrientationMarkerWidget](./Interaction_Widgets_OrientationMarkerWidget.html)
 */
export declare const vtkAxesActor: {
    newInstance: typeof newInstance,
    extend: typeof extend,
};
export default vtkAxesActor;
