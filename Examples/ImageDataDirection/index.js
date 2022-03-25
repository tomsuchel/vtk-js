// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import 'vtk.js/Sources/Rendering/Profiles/Volume';

// Force the loading of HttpDataAccessHelper to support gzip decompression
import 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper';

import vtkHttpDataSetReader from 'vtk.js/Sources/IO/Core/HttpDataSetReader';
import vtkInteractorStyleImage from 'vtk.js/Sources/Interaction/Style/InteractorStyleImage';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkImageReslice from 'vtk.js/Sources/Imaging/Core/ImageReslice';

import { mat3, mat4 } from 'gl-matrix';

import controlPanel from './controlPanel.html';

function setCamera(sliceMode, renderer, data) {
  const ijk = [0, 0, 0];
  const position = [0, 0, 0];
  const focalPoint = [0, 0, 0];
  const viewUp = sliceMode === 1 ? [0, 0, 1] : [0, 1, 0];
  data.indexToWorld(ijk, focalPoint);
  ijk[sliceMode] = 1;
  data.indexToWorld(ijk, position);
  renderer.getActiveCamera().set({ focalPoint, position, viewUp });
  renderer.resetCamera();
}

function updateControlPanel(im, ds) {
  const slicingMode = im.getSlicingMode();
  const extent = ds.getExtent();
  document.querySelector('.slice').setAttribute('min', extent[slicingMode * 2]);
  document
    .querySelector('.slice')
    .setAttribute('max', extent[slicingMode * 2 + 1]);
}

// ---------------------------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------------------------

const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  rootContainer: document.body,
  background: [0.1, 0.1, 0.1],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();
const camera = renderer.getActiveCamera();
fullScreenRenderer.addController(controlPanel);

camera.setParallelProjection(true);
const iStyle = vtkInteractorStyleImage.newInstance();
iStyle.setInteractionMode('IMAGE_SLICING');
renderWindow.getInteractor().setInteractorStyle(iStyle);

reader
  .setUrl(`${__BASE_PATH__}/data/volume/LIDC2.vti`, { loadData: true })
  .then(() => {
    // IMAGE -----------------------------------------
    const imageData = reader.getOutputData();
    const imageMapper = vtkImageMapper.newInstance();
    const imageActor = vtkImageSlice.newInstance();

    imageMapper.setInputData(imageData);
    imageActor.setMapper(imageMapper);
    renderer.addActor(imageActor);

    // RESLICE ---------------------------------------
    const resliceData = vtkImageReslice.newInstance();
    const resliceMapper = vtkImageMapper.newInstance();
    const resliceActor = vtkImageSlice.newInstance();

    resliceData.setInputData(imageData);
    resliceMapper.setInputConnection(resliceData.getOutputPort());
    resliceActor.setMapper(resliceMapper);

    // Rotate reslice cursor by 45° on axis Z
    const resliceAxes = mat4.identity(new Float64Array(16));
    mat4.rotateZ(resliceAxes, resliceAxes, (45 * Math.PI) / 180);
    // resliceActor.setUserMatrix(resliceAxes);
    resliceData.setResliceAxes(resliceAxes);

    renderer.addActor(resliceActor);

    const mapper = imageMapper;
    const data = imageData;

    const sliceMode = vtkImageMapper.SlicingMode.K;
    mapper.setSlicingMode(sliceMode);
    mapper.setSlice(0);

    setCamera(sliceMode, renderer, data);

    updateControlPanel(mapper, data);

    const update = () => {
      const slicingMode = mapper.getSlicingMode() % 3;

      if (slicingMode > -1) {
        const ijk = [0, 0, 0];
        const slicePos = [0, 0, 0];

        // position
        ijk[slicingMode] = mapper.getSlice();
        data.indexToWorld(ijk, slicePos);

        renderWindow.render();

        // update UI
        document
          .querySelector('.slice')
          .setAttribute('max', data.getDimensions()[slicingMode] - 1);
      }
    };

    renderer.resetCamera();
    fullScreenRenderer.resize();
    update();

    // ---------------------------------------------------------------------------------------------
    // UI
    // ---------------------------------------------------------------------------------------------

    document.querySelector('.slice').addEventListener('input', (ev) => {
      mapper.setSlice(Number(ev.target.value));
      resliceMapper.setSlice(Number(ev.target.value));
      renderWindow.render();
    });

    document.querySelector('.axis').addEventListener('input', (ev) => {
      const mode = 'IJKXYZ'.indexOf(ev.target.value) % 3;
      mapper.setSlicingMode(mode);

      setCamera(mode, renderer, data);
      renderWindow.render();
    });

    function updateDirection() {
      const aDeg = document.getElementById('rotI').value;
      const bDeg = document.getElementById('rotJ').value;
      const gDeg = document.getElementById('rotK').value;

      document.querySelector('#valI').textContent = aDeg;
      document.querySelector('#valJ').textContent = bDeg;
      document.querySelector('#valK').textContent = gDeg;

      // Convert to radians
      const [a, b, g] = [aDeg, bDeg, gDeg].map((x) => (x * Math.PI) / 180);

      const yaw = mat3.fromValues(
        Math.cos(a),
        Math.sin(a),
        0,
        -Math.sin(a),
        Math.cos(a),
        0,
        0,
        0,
        1
      );
      const pitch = mat3.fromValues(
        Math.cos(b),
        0,
        -Math.sin(b),
        0,
        1,
        0,
        Math.sin(b),
        0,
        Math.cos(b)
      );
      const roll = mat3.fromValues(
        1,
        0,
        0,
        0,
        Math.cos(g),
        Math.sin(g),
        0,
        -Math.sin(g),
        Math.cos(g)
      );
      const direction = mat3.identity(new Float64Array(9));
      mat3.mul(direction, yaw, pitch);
      mat3.mul(direction, direction, roll);

      const dirI = direction
        .slice(0, 3)
        .map((x) => x.toFixed(3))
        .join(' ');
      const dirJ = direction
        .slice(3, 6)
        .map((x) => x.toFixed(3))
        .join(' ');
      const dirK = direction
        .slice(6, 9)
        .map((x) => x.toFixed(3))
        .join(' ');
      const dirStr = [dirI, dirJ, dirK].join('\n');
      document.querySelector('#direction').textContent = dirStr;
      // imageData.setDirection([0, 1, 0, 0, 0, -1, -1, 0, 0]);
      imageData.setDirection(direction);
      renderer.resetCamera();
      renderWindow.render();
    }
    document.querySelector('#rotI').addEventListener('input', updateDirection);
    document.querySelector('#rotJ').addEventListener('input', updateDirection);
    document.querySelector('#rotK').addEventListener('input', updateDirection);
    updateDirection();
  });
