/**
 * BRFv5 - Extended Face Shape
 *
 * Also see: utils__face_extended.js
 *
 * This example adds 6 more landmarks to the forehead. These additional 6 points
 * are not tracked, but estimated from the other 68 (or 42) landmarks.
 **/

import { setupExample }                     from './setup__example.js'

import { drawCircles, drawTriangles }       from '../utils/utils__canvas.js'

import { drawRect }       from '../utils/utils__canvas.js'

import { drawFaceDetectionResults }         from '../utils/utils__draw_tracking_results.js'

import { BRFv5FaceExtended }                from '../utils/utils__face_extended.js'
import { faceExtendedTriangles74l }         from '../utils/utils__face_triangles.js'

import { brfv5 }                            from '../brfv5/brfv5__init.js'

import { configureNumFacesToTrack }         from '../brfv5/brfv5__configure.js'
//import { setROIsWholeImage }                from '../brfv5/brfv5__configure.js'

import { colorPrimary, colorSecondary }                     from '../utils/utils__colors.js'

const faceExtended  = new BRFv5FaceExtended()

let numFacesToTrack = 1 // set be run()



let __DEBUG__ = false;


export const configureExample = (brfv5Config) => {

	const imageWidth            = brfv5Config.imageConfig.inputWidth
	const imageHeight           = brfv5Config.imageConfig.inputHeight

	const inputSize             = Math.min(imageWidth, imageHeight)

	const fdConfig              = brfv5Config.faceTrackingConfig

	configureNumFacesToTrack(brfv5Config, numFacesToTrack)

	// Let's restrict the region of interest (ROI) for Face Detection
	// to 90% of the center square...
	let size = Math.min(imageWidth, imageHeight) * 0.90
	let roi  = brfv5Config.faceDetectionConfig.regionOfInterest

	roi.width  = size
	roi.height = size
	roi.x = (imageWidth - size) * 0.50
	roi.y = (imageHeight - size) * 0.50

	// ... and to 100% of for the Face Tracking ROI.

	size = Math.min(imageWidth, imageHeight)
	roi = brfv5Config.faceTrackingConfig.regionOfInterest

	roi.width  = size
	roi.height = size
	roi.x = (imageWidth - size) * 0.5
	roi.y = (imageHeight - size) * 0.5

	const scaleFactor           = inputSize / 480.0;

	fdConfig.minFaceScaleStart = 140 * scaleFactor;
	fdConfig.minFaceScaleReset = 140 * scaleFactor;
}


export const handleTrackingResults = (brfv5Manager, brfv5Config, canvas) => {

  const ctx   = canvas.getContext('2d')
  const faces = brfv5Manager.getFaces()

  let doDrawFaceDetection = false

  for(let i = 0; i < faces.length; i++) {

    const face = faces[i]

    if(face.state === brfv5.BRFv5State.FACE_TRACKING) {

      let _scale = Math.pow(2, brfv5Config.imageConfig.inputWidth/640)

	  faceExtended.update(face)

      drawCircles(ctx, faceExtended.landmarks, colorPrimary, 2.0*_scale)

      if(faceExtended.landmarks.length === 74) {

        drawTriangles(ctx, faceExtended.vertices, faceExtendedTriangles74l,
          1.0*_scale, colorPrimary, 0.4)
      }
    } else {
      doDrawFaceDetection = true
      brfv5Manager.reset()
    }
  }

  if(doDrawFaceDetection) {

    drawFaceDetectionResults(brfv5Manager, brfv5Config, canvas)
  }

	if (__DEBUG__)
	{
		drawRect(ctx, brfv5Config.faceTrackingConfig.regionOfInterest, colorPrimary, 10.0)
		drawRect(ctx, brfv5Config.faceDetectionConfig.regionOfInterest, colorSecondary, 10.0)
	}

	return false
}

const exampleConfig = {

  onConfigure:              configureExample,
  onTracking:               handleTrackingResults
}

// run() will be called automatically after 1 second, if run isn't called immediately after the script was loaded.
// Exporting it allows re-running the configuration from within other scripts.

let timeoutId = -1

export const run = (_numFacesToTrack = 1) => {

  numFacesToTrack = _numFacesToTrack

  clearTimeout(timeoutId)
  setupExample(exampleConfig)

  //trackCamera()
}

//timeoutId = setTimeout(() => { run() }, 1000)
timeoutId = setTimeout(() => { run() }, 1000)

export default { run }
