<template>
  <div class="t5VideoContainer t5video" :id="'t5VideoContainer' + id" @mousemove.prevent="bodyMouseMove($event)"
       @mouseup.prevent="bodyMouseUp">
    <div v-show="loader" class="loadVid">
      <span></span>
    </div>
    <video :width="width" :height="height" :id="'t5videoPlayer' + id" @click.prevent="playPlayer" @loadstart="loadStart" @loadeddata="loadStop" @loadedmetadata="loadedMetadata($event)" @waiting="waitPlayer" @playing="finishWaiting" @seeking="waitPlayer" @seeked="finishWaiting"
           @timeupdate.prevent="timeUpdate" @ended.prevent="stopPlayer">
      <source :src="video" type="video/mp4" v-if="video.substring(video.lastIndexOf('.')+1) === 'mp4'">
      <source :src="video" type="video/webm" v-else-if="video.substring(video.lastIndexOf('.')+1) === 'webm'">
    </video>
    <div class="t5player" :id="'t5PlayerId' + id" v-show="loaded">
      <div class="t5Control t5play-pause t5play" @click.prevent="playPlayer($event)" :id="'t5PlayPauseButton' + id">
        <span class="t5play-button">&#9658;</span>
        <div class="t5pause-button">
          <span> </span>
          <span> </span>
        </div>
      </div>
      <div class="t5Control t5progress" :id="'t5ProgressId' + id" @mousedown.prevent="progreessBarMouseDown($event)">
        <div class="t5progress-bar" :id="'t5ProgressBarId' + id">
          <div class="t5button-holder">
            <div class="t5progress-button" :id="'t5ProgressBarButtonId' + id"></div>
          </div>
        </div>
      </div>
      <div class="t5Control t5time">
        <span class="t5ctime" :id="'t5CtimeId' + id">00:00</span>
        <span class="t5stime"> / </span>
        <span class="t5ttime" :id="'t5TtimeId' + id">00:00</span>
      </div>
      <div class="t5Control t5volume" @mouseover.prevent="volumnMouseOver()" @mouseleave="volumeMouseOut" :id="'t5VolumeId' + id">
        <div class="t5volume-holder" :id="'t5VolumeHolderId' + id">
          <div class="t5volume-bar-holder" :id="'volumeBarHolderId' + id" @mousedown.prevent="volumeBarHolder($event)">
            <div class="t5volume-bar" :id="'volumeBarId' + id">
              <div class="t5volume-button-holder">
                <div class="t5volume-button" :id="'volumeBarButtonId' + id"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="t5volume-icon t5v-change-0" :id="'t5volumeIconId' + id" @mousedown.prevent="volumeIconMouseDown($event)">
          <span> </span>
        </div>
      </div>
      <div class="t5Control t5fullscreen" @click.prevent="fullscreen" :id="'fullScreenId' + id">
        <a href="#"> </a>
      </div>
    </div>
  </div>
</template>
<script>
import '../../assets/css/style.css'

export default {
  name: 'tier5-video-player',
  props: {
    width: {
      type: Number,
      default: 700,
      validator (x) {
        let numChkWidth = new RegExp('^[0-9]*$')
        return numChkWidth.test(x)
      }
    },
    height: {
      type: Number,
      default: 400,
      validator (x) {
        let numChkHeignt = new RegExp('^[0-9]*$')
        return numChkHeignt.test(x)
      }
    },
    video: {
      type: String,
      default: 'http://localhost/movie.mp4'
    }
  },
  data () {
    return {
      loaded: false,
      duration: 0,
      currentTime: 0,
      mclicking: false,
      vclicking: false,
      vidhover: false,
      volhover: false,
      playing: false,
      drop: false,
      begin: false,
      draggingProgess: false,
      storevol: 0,
      x: 0,
      y: 0,
      vtime: 0,
      updProgWidth: 0,
      volume: 0,
      videoEvent: {},
      draggingProgress: false,
      loader: false,
      id: Math.floor(Math.random() * 90000) + 10000
    }
  },
  mounted () {
    //
  },
  methods: {
    loadStop () {
      this.$emit('loadEndProcess', event)
      this.loader = false
    },
    loadedMetadata (event) {
      let playerWidth = '1'
      this.videoEvent = event.target
      this.loaded = true
      // Width of the video
      let videoWidth = event.target.width
      document.getElementById('t5VideoContainer' + this.id).style.width = videoWidth + 'px'
      document.getElementById('t5PlayerId' + this.id).style.width = (playerWidth * 100) + '%'
      // document.getElementById("t5PlayerId").style.left = ((100 - playerWidth * 100) / 2) + '%'
      this.duration = event.target.duration
      this.volume = event.target.volume
      this.bufferLength()
      if (this.isMobile()) {
        document.getElementById('t5ProgressBarButtonId' + this.id).classList.remove('t5progress-button')
      }
      // Set some widths
      this.progWidth = (parseInt(window.getComputedStyle(document.getElementById('t5ProgressId' + this.id)).width) * this.width) / 100
      this.timeUpdate()
      // Set up a playing variable
      if (event.target.currentTime > 0 && event.target.paused === false && event.target.ended === false) {
        this.playing = false
      } else {
        this.playing = true
      }
      this.volanim()
      // Check if fullscreen supported. If it's not just don't show the fullscreen icon.
      if (this.videoEvent.requestFullscreen && !this.videoEvent.mozRequestFullScreen && !this.videoEvent.webkitRequestFullScreen) {
        document.getElementById('fullScreenId' + this.id).style.display = 'none'
      }
    },
    playPlayer (event) {
      this.loader = false
      if (this.playing === false) {
        this.videoEvent.pause()
        this.playing = true
        document.getElementById('t5PlayPauseButton' + this.id).classList.remove('t5pause')
        document.getElementById('t5PlayPauseButton' + this.id).classList.add('t5play')
        this.bufferLength()
        this.$emit('pauseProcess', event)
      } else {
        this.begin = true
        this.playing = false
        this.videoEvent.play()
        document.getElementById('t5PlayPauseButton' + this.id).classList.remove('t5play')
        document.getElementById('t5PlayPauseButton' + this.id).classList.add('t5pause')
        this.$emit('playProcess', event)
      }
    },
    loadStart () {
      this.$emit('loadStartProcess', event)
      this.loader = true
    },
    stopPlayer () {
      this.loader = false
      this.playing = false
      // If the user is not dragging
      if (this.draggingProgress === false) {
        document.getElementById('t5PlayPauseButton' + this.id).classList.remove('t5pause')
        document.getElementById('t5PlayPauseButton' + this.id).classList.add('t5play')
      }
      this.$emit('endProcess', event)
    },
    waitPlayer () {
      this.loader = true
    },
    finishWaiting () {
      this.loader = false
    },
    bufferLength () {
      // The buffered regions of the video
      let buffered = this.videoEvent.buffered
      let duration = this.videoEvent.duration
      // Rest all buffered regions everytime this function is run
      document.querySelectorAll('.t5buffered' + this.id).forEach(e => e.remove())
      if (buffered.length > 0) {
        // The length of the buffered regions is i
        let i = buffered.length

        while (i--) {
          // Max and min buffers
          let maxBuffer = buffered.end(i)
          let minBuffer = buffered.start(i)
          // The offset and width of buffered area
          let bufferOffset = (minBuffer / duration) * 100

          let bufferWidth = ((maxBuffer - minBuffer) / duration) * 100
          let t5buffered = document.createElement('div')
          // If buffered regions exist
          t5buffered.className = 't5buffered' + this.id
          t5buffered.style.left = bufferOffset + '%'
          t5buffered.style.width = bufferWidth + '%'
          document.getElementById('t5ProgressId' + this.id).appendChild(t5buffered)
        }
      }
    },
    timeUpdate (ignore = true) {
      // The current time of the video based on progress bar position
      let progressbarWidth = parseInt(window.getComputedStyle(document.getElementById('t5ProgressBarId' + this.id)).width)
      if (isNaN(progressbarWidth)) {
        progressbarWidth = 1
      }
      let time = (progressbarWidth / this.progWidth) * this.duration
      if (isNaN(time)) {
        time = 0
      }
      // The 'real' time of the video
      let curTime = this.videoEvent.currentTime
      // Seconds are set to 0 by default, minutes are the time divided by 60
      // tminutes and tseconds are the total mins and seconds.
      let seconds = 0
      let minutes = Math.floor(time / 60)
      let tminutes = Math.floor(this.duration / 60)
      let tseconds = Math.floor((this.duration) - (tminutes * 60))

      // If time exists (well, video time)
      if (time) {
        // seconds are equal to the time minus the minutes
        seconds = Math.floor(time) - (60 * minutes)

        // So if seconds go above 59
        if (seconds > 59) {
          // Increase minutes, reset seconds
          seconds = Math.floor(time) - (60 * minutes)
          if (seconds == 60) {
            minutes = Math.floor(time / 60)
            seconds = 0
          }
        }
      }

      // Updated progress width
      this.updProgWidth = (curTime / this.duration) * this.progWidth

      // Set a zero before the number if its less than 10.
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      if (tseconds < 10) {
        tseconds = '0' + tseconds
      }
      // A variable set which we'll use later on
      if (ignore !== true) {
        document.getElementById('t5ProgressBarId' + this.id).style.width = this.updProgWidth + 'px'
        let progressBarWidth = parseInt(window.getComputedStyle(document.getElementById('t5ProgressBarButtonId' + this.id)).width)
        document.getElementById('t5ProgressBarButtonId' + this.id).style.left = (this.updProgWidth - progressBarWidth) + 'px'
      }

      // Update times
      let cTimeDiv = document.createTextNode(minutes + ':' + seconds)
      let tTimeDiv = document.createTextNode(tminutes + ':' + tseconds)
      document.getElementById('t5CtimeId' + this.id).removeChild(document.getElementById('t5CtimeId' + this.id).childNodes[0])
      document.getElementById('t5CtimeId' + this.id).appendChild(cTimeDiv)
      document.getElementById('t5TtimeId' + this.id).removeChild(document.getElementById('t5TtimeId' + this.id).childNodes[0])
      document.getElementById('t5TtimeId' + this.id).appendChild(tTimeDiv)

      if (this.videoEvent.currentTime > 0 && this.videoEvent.paused === false && this.videoEvent.ended === false) {
        this.bufferLength()
      }
    },
    getOffsetLeft (elem) {
      var offsetLeft = 0
      do {
        if (!isNaN(elem.offsetLeft)) {
          offsetLeft += elem.offsetLeft
        }
      } while (elem = elem.offsetParent)
      return offsetLeft
    },
    getOffsetTop (elem) {
      var offsetTop = 0
      do {
        if (!isNaN(elem.offsetTop)) {
          offsetTop += elem.offsetTop
        }
      } while (elem = elem.offsetParent)
      return offsetTop
    },
    isMobile () {
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i)) {
        return true
      } else {
        return false
      }
    },
    progreessBarMouseDown (event) {
      if (event.pageX !== undefined && !this.isMobile()) {
        // Progress bar is being clicked
        this.mclicking = true
        // If video is playing then pause while we change time of the video
        if (this.playing === true) {
          this.videoEvent.pause()
        }
        // The x position of the mouse in the progress bar
        this.x = event.pageX - this.getOffsetLeft(document.getElementById('t5ProgressId' + this.id))
        // Update current time
        this.currentTime = (this.x / this.progWidth) * this.duration
        if (this.currentTime > 0 && this.currentTime <= this.duration) {
          this.videoEvent.currentTime = this.currentTime
        }
      } else {
        document.getElementById('t5ProgressBarButtonId' + this.id).classList.remove('t5progress-button')
      }
    },
    volumeBarHolder (event) {
      this.vclicking = true
      // Y position of mouse in vol ume slider
      this.y = this.getOffsetTop(document.getElementById('t5PlayerId' + this.id)) - event.pageY
      // Return false if user tries to click outside volume area
      if (this.y < 0 || this.y > parseInt(window.getComputedStyle(document.getElementById('volumeBarHolderId' + this.id)).height)) {
        this.vclicking = false
        return false
      }

      // Update CSS to reflect what's happened
      document.getElementById('volumeBarId' + this.id).style.height = this.y + 'px'
      document.getElementById('volumeBarButtonId' + this.id).style.top = (this.y - (document.getElementById('volumeBarButtonId' + this.id).style.height / 2)) + 'px'
      // Update some variables
      this.videoEvent.volume = parseInt(document.getElementById('volumeBarId' + this.id).style.height) / parseInt(window.getComputedStyle(document.getElementById('volumeBarHolderId' + this.id)).height)
      this.storevol = parseInt(document.getElementById('volumeBarId' + this.id).style.height) / parseInt(window.getComputedStyle(document.getElementById('volumeBarHolderId' + this.id)).height)
      this.volume = parseInt(document.getElementById('volumeBarId' + this.id).style.height) / parseInt(window.getComputedStyle(document.getElementById('volumeBarHolderId' + this.id)).height)
      // Run a little animation for the volume icon.
      this.volanim()
    },
    volanim () {
      for (let i = 0; i < 1; i += 0.1) {
        let fi = parseInt(Math.floor(i * 10)) / 10
        let volid = (fi * 10) + 1
        if (this.volume === 1) {
          if (this.volhover === true) {
            document.getElementById('t5volumeIconId' + this.id).className = ''
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon')
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon-hover')
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5v-change-11')
          } else {
            document.getElementById('t5volumeIconId' + this.id).className = ''
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon')
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5v-change-11')
          }
        } else if (this.volume === 0) {
          if (this.volhover === true) {
            document.getElementById('t5volumeIconId' + this.id).className = ''
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon')
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon-hover')
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5v-change-1')
          } else {
            document.getElementById('t5volumeIconId' + this.id).className = ''
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon')
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5v-change-11')
          }
        } else if (this.volume > (fi - 0.1) && this.volume < fi && !document.getElementById('t5volumeIconId' + this.id).classList.contains('t5v-change-' + volid)) {
          if (this.volhover === true) {
            document.getElementById('t5volumeIconId' + this.id).className = ''
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon')
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon-hover')
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5v-change-' + volid)
          } else {
            document.getElementById('t5volumeIconId' + this.id).className = ''
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon')
            document.getElementById('t5volumeIconId' + this.id).classList.add('t5v-change-' + volid)
          }
        }
      }
    },
    fullscreen () {
      if (this.videoEvent.requestFullscreen) {
        this.videoEvent.requestFullscreen()
      } else if (this.videoEvent.mozRequestFullScreen) {
        this.videoEvent.mozRequestFullScreen()
      } else if (this.videoEvent.webkitRequestFullScreen) {
        this.videoEvent.webkitRequestFullScreen()
      }
    },
    volumnMouseOver () {
      this.volhover = true
    },
    volumeMouseOut () {
      this.volhover = false
    },
    volumeIconMouseDown (event) {
      this.volume = this.videoEvent.volume // Update volume
      // If volume is undefined then the store volume is the current volume
      if (this.storevol === 0) {
        this.storevol = this.volume
      }
      // If volume is more than 0
      if (this.volume > 0) {
        // then the user wants to mute the video, so volume will become 0
        this.videoEvent.volume = 0
        this.volume = 0
        document.getElementById('volumeBarId' + this.id).style.height = 0
        this.volanim()
      } else {
        // Otherwise user is unmuting video, so volume is now store volume.
        this.videoEvent.volume = this.storevol
        this.volume = this.storevol
        document.getElementById('volumeBarId' + this.id).style.height = (this.storevol * 100) + '%'
        this.volanim()
      }
    },
    bodyMouseUp () {
      this.mclicking = false
      this.vclicking = false
      this.draggingProgress = false
      if (this.playing === true) {
        document.getElementById('t5PlayPauseButton' + this.id).classList.remove('t5play')
        document.getElementById('t5PlayPauseButton' + this.id).classList.add('t5pause')
        this.videoEvent.play()
      }
      this.bufferLength()
    },
    bodyMouseMove (e) {
      // For the progress bar controls
      if (this.mclicking === true) {
        // Progress bar is being clicked
        this.mclicking = true
        // If video is playing then pause while we change time of the video

        // Update current time
        this.currentTime = (this.x / this.progWidth) * this.duration
        this.videoEvent.currentTime = this.currentTime

        // Dragging is happening
        this.draggingProgress = true
        // The thing we're going to apply to the CSS (changes based on conditional statements);
        let progMove = 0
        // Width of the progress button (a little button at the end of the progress bar)
        let buttonWidth = parseInt(window.getComputedStyle(document.getElementById('t5ProgressBarButtonId' + this.id)).width)

        // The x position of the mouse in the progress bar
        this.x = event.pageX - this.getOffsetLeft(document.getElementById('t5ProgressId' + this.id))

        // If video is playing
        if (this.playing === true) {
          // And the current time is less than the duration
          if (this.currentTime < this.duration) {
            // Then the play-pause icon should definitely be a pause button
            document.getElementById('t5PlayPauseButton' + this.id).classList.remove('t5play')
            document.getElementById('t5PlayPauseButton' + this.id).classList.add('t5pause')
          }
        }

        if (this.x < 0) { // If x is less than 0 then move the progress bar 0px
          this.progMove = 0
          this.videoEvent.currentTime = 0
        } else if (this.x > this.progWidth) { // If x is more than the progress bar width then set progMove to progWidth
          this.videoEvent.currentTime = this.duration
          this.progMove = this.progWidth
        } else { // Otherwise progMove is equal to the mouse x coordinate
          this.progMove = this.x
          this.currentTime = (this.x / this.progWidth) * this.duration
          // this.videoEvent.currentTime = this.currentTime
        }

        // Change CSS based on previous conditional statement
        document.getElementById('t5ProgressBarId' + this.id).style.width = this.progMove + 'px'
        document.getElementById('t5ProgressBarButtonId' + this.id).style.left = (this.progMove - buttonWidth) + 'px'
      }

      // For the volume controls
      if (this.vclicking === true) {
        // The position of the mouse on the volume slider
        this.y = this.getOffsetTop(document.getElementById('t5PlayerId' + this.id)) - event.pageY
        // The position the user is moving to on the slider.
        let volMove = 0

        // If the volume holder box is hidden then just return false
        if (document.getElementById('volumeBarHolderId' + this.id).style.display === 'none') {
          this.vclicking = false
          return false
        }

        // Add the hover class to the volume icon
        if (!document.getElementById('t5volumeIconId' + this.id).classList.contains('t5volume-icon-hover')) {
          document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon-hover')
        }
        if (this.y < 0 || this.y === 0) { // If y is less than 0 or equal to 0 then volMove is 0.
          this.volume = 0
          volMove = 0
          document.getElementById('t5volumeIconId' + this.id).className = ''
          document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon')
          document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon-hover')
          document.getElementById('t5volumeIconId' + this.id).classList.add('t5v-change-11')
        } else if (this.y > document.getElementById('volumeBarHolderId' + this.id).style.height || (this.y / document.getElementById('volumeBarHolderId' + this.id).style.height) === 1) {
          // If y is more than the height then volMove is equal to the height

          this.volume = 1
          volMove = document.getElementById('volumeBarHolderId' + this.id).style.height
          document.getElementById('t5volumeIconId' + this.id).className = ''
          document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon')
          document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon-hover')
          document.getElementById('t5volumeIconId' + this.id).classList.add('t5v-change-1')
        } else { // Otherwise volMove is just y
          this.volume = document.getElementById('volumeBarId' + this.id).style.height / document.getElementById('volumeBarHolderId' + this.id).style.height
          volMove = this.y
          this.volume = parseInt(document.getElementById('volumeBarId' + this.id).style.height) / parseInt(window.getComputedStyle(document.getElementById('volumeBarHolderId' + this.id)).height)
        }
        // Update CSS to reflect what's happened
        document.getElementById('volumeBarId' + this.id).style.height = this.y + 'px'
        document.getElementById('volumeBarButtonId' + this.id).style.top = (this.y - (document.getElementById('volumeBarButtonId' + this.id).style.height / 2)) + 'px'
        // Update some variables
        this.videoEvent.volume = this.volume
        this.storevol = parseInt(document.getElementById('volumeBarId' + this.id).style.height) / parseInt(window.getComputedStyle(document.getElementById('volumeBarHolderId' + this.id)).height)

        // Run a little animation for the volume icon.
        this.volanim()
      }

      // If the user hovers over the volume controls, then fade in or out the volume
      // icon hover class

      if (this.volhover === false) {
        document.getElementById('t5VolumeHolderId' + this.id).style.display = 'none'
        document.getElementById('t5volumeIconId' + this.id).classList.remove('t5volume-icon-hover')
      } else {
        document.getElementById('t5volumeIconId' + this.id).classList.add('t5volume-icon-hover')
       // document.getElementById('t5VolumeHolderId' + this.id).style.display = 'block'
      }
    }
  }
}
</script>
