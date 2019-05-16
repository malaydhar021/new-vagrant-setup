/**
 * Video js configuration model
 * @type VjsOptionsModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export type MediaModel = {
    controls?: boolean;
    autoplay?: boolean;
    fluid?: boolean;
    loop?: boolean;
    width?: number;
    height?: number;
    controlBar?: VjsControlBarModel;
    plugins?: VjsPluginsModel;
}

/**
 * Configuration for media control bar
 * @type MediaControlBar
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @deprecated In version 1.0.0
 */
export type MediaControlBar = {
    volumePanel: boolean;
    muteToggle: boolean;
}


/**
 * Video js control bar configuration model
 * @class VjsControlBarModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
export class VjsControlBarModel {
    volumePanel?: boolean;
}

/**
 * Video js plugins configuration model
 * @class VjsPluginsModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */ 
export class VjsPluginsModel {
    wavesurfer?: VjsWavesurferModel;
    record?: VjsRecordModel;
}

/**
 * Video js wavesurfer package configuration model
 * @class VjsWavesurferModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */ 
export class VjsWavesurferModel {
    src: string;
    waveColor: string;
    progressColor: string;
    debug: boolean;
    cursorWidth: number;
    msDisplayMax: number;
    hideScrollbar: boolean;
}

/**
 * Video js record configuration model
 * @class VjsRecordModel
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */ 
export class VjsRecordModel {
    audio: boolean;
    video: boolean;
    maxLength: number;
    msDisplayMax: number;
    debug: boolean;
}