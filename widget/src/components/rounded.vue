<template>
  <div id="app" class="main-cont" v-if="data[counter]">
    <div id="ajRy2fZIho1o2fZIsuS9_0">
      <div class="ajRy3zjZho1o3zjZsuS9_0 ajRy2riIho1o2riIsuS9_0">
        <div class="ajRy1JYFho1o1JYFsuS9_0 notificationImg">
          <img :src="String(imageStorage) + data[counter].image" alt="Sticky Reviews">
        </div>
        <div class="ajRy2EbCho1o2EbCsuS9_0">
          <div class="ajRy2AUlho1o2AUlsuS9_0 notiHead">{{ data[counter].name }}</div>
          <div class="ajRy13BWho1o13BWsuS9_0 notiBody">{{ data[counter].description }}</div>
          <div class="notiBotom">
            <div class="ajRy2PlWho1o2PlWsuS9_0 inAday">{{ data[counter].created_at | moment('timezone', timezone, 'YYYY-MM-DDTHH:mm')  | moment("from") }}</div>
            <div class="ajRy3eNuho1o3eNusuS9_0 byArea">
              <i v-if="isBranded"><svg width="7" height="13" viewBox="0 0 7 13" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M4.127.496C4.51-.12 5.37.356 5.16 1.07L3.89 5.14H6.22c.483 0 .757.616.464 1.044l-4.338 6.34c-.407.595-1.244.082-1.01-.618L2.72 7.656H.778c-.47 0-.748-.59-.48-1.02L4.13.495z" fill="#F6A623"></path><path fill="#FEF79E" d="M4.606.867L.778 7.007h2.807l-1.7 5.126 4.337-6.34H3.16"></path></g></svg></i>
              <span v-if="isBranded">by</span>
              <div class="bottomRightArea">
                <a class="ajRy12wMho1o12wMsuS9_0" :href="brandingData.url" target="_blank" v-if="isBranded">{{brandingData.brand_name}}</a>
                <div class="ratingContainer">
                  <div class="ratings unchecked" v-if="data[counter].rating === 0">
                    <span>&#9733;</span>
                    <span>&#9733;</span>
                    <span>&#9733;</span>
                    <span>&#9733;</span>
                    <span>&#9733;</span>
                  </div>
                  <div class="ratings" v-else v-for="(item, index) in 5" :key="index">
                    <span :class="index+1 <= data[counter].rating ? 'checked': 'unchecked'">&#9733;</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="ajRy1N_Eho1o1N_EsuS9_0">
          <button type="button" @click="stopIteration">x</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueMoment from 'vue-moment';
  import moment from 'moment-timezone';

  Vue.use(VueMoment, {
    moment,
  });

  export default {
    props: {
      data: {
        type: Array,
        default: []
      },
      counter: {
        type: Number,
        default: 0
      },
      imageStorage: {
        type: String,
        default: ''
      },
      isBranded: {},
      brandingData: {},
      ongoingInterval: {}
    },
    name: "rounded",
    data: function () {
      return {
        componentName: 'Im rounded component'
      };
    },
    computed: {
      timezone: () => moment.tz.guess()
    },
    methods : {
      stopIteration() {
        window.clearInterval(this.ongoingInterval);
        this.$emit('iterationStopped', true);
      }
    }
  }
</script>
<style scoped>
  .notiBotom{
    display: inline-block;
    width: 100%;
    height: 14px;
  }
  .main-cont{
    position: fixed;
    bottom: 0;
    left: 0;
    width: auto;
    float: left;
  }
  .ratings{
    display: inline-block;
    width: auto;
    font-size: 11px;
  }
  .unchecked {
    color: black;
  }
  .checked {
    color: orange;
  }
  #ajRy2lriho1o2lrisuS9_0 div, #ajRy2DbIho1o2DbIsuS9_0 div {
    -webkit-font-smoothing: antialiased!important;
    -moz-osx-font-smoothing: grayscale!important;
    color: #2c3e50;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    display: block;
    box-sizing: border-box;
    text-align: left;
  }
  #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0 {
    pointer-events: auto;
    overflow: hidden;
    position: relative;
    height: 70px;
    width: 96%;
    margin: 0 auto;
    background-color: #fff;
    padding: 10px;
    box-sizing: border-box;
    line-height: 1em;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    box-shadow: 0 0 1px rgba(0,0,0,.2), 0 1px 2px rgba(0,0,0,.05), 0 8px 50px rgba(0,0,0,.05);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    letter-spacing: -.02em;
  }

  #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0 .ajRy37xpho1o37xpsuS9_0 {
    padding: 10px;
    width: 70px;
    height: 54px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    transition-duration: .8s;
    transition-property: transform;
  }
  #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0 .ajRyqu5Hho1oqu5HsuS9_0 {
    padding: 0 15px;
    font-size: 15px;
  }
  #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0 .ajRyqu5Hho1oqu5HsuS9_0 div, #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0 .ajRyqu5Hho1oqu5HsuS9_0 span {
    color: #0095f7;
  }
  #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0 .ajRytoc3ho1otoc3suS9_0 {
    font-weight: 700;
    display: inline-block;
    padding: 3px;
    line-height: 1.1em;
    background-color: rgba(0,149,247,.1);
    margin-bottom: 2px;
    border-radius: 3px;
  }
  #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0 .ajRyqu5Hho1oqu5HsuS9_0 div, #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0 .ajRyqu5Hho1oqu5HsuS9_0 span {
    color: #0095f7;
  }

  .inAday{
    float: left;
    padding-top: 1px;
  }
  .byArea{
    float: left;
  }
  .byArea i, .byArea span{
    float: left;
  }
  .byArea a{
    padding: 0 4px;
    display: inline;
  }
  .bottomRightArea{
    float: left;
  }
  .ratingContainer{
    margin-left: 3px;
    width: auto;
    display: inline-block;
  }
  .notificationImg{
    height: 94% !important;
  }
  .notificationImg img{
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 {
    pointer-events: auto;
    overflow: hidden;
    position: relative;
    height: auto;
    min-height: 82px;
    width: 96%;
    margin: 0 auto 10px;
    background-color: #fff;
    padding: 10px;
    box-sizing: border-box;
    line-height: 1em;
    box-shadow: 0 0 1px rgba(0,0,0,.2), 0 1px 2px rgba(0,0,0,.05), 0 8px 50px rgba(0,0,0,.05);
    border-radius: 150px;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 {
    display: block;
    position: absolute;
    float: left;
    top: 3px;
    left: 3px;
    height: 64px;
    width: 64px;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 img, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 img {
    border-radius: 50%;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 img, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 img {
    border-radius: 10px;
    height: 64px;
    width: 64px;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 {
    margin-left: 78px;
    padding-right: 8px;
    letter-spacing: -.02em;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy2AUlho1o2AUlsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy2AUlho1o2AUlsuS9_0 {
    line-height: 17.5px;
    font-size: 14px;
    font-weight: 700;
    color: #222;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy2AUlho1o2AUlsuS9_0, #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy13BWho1o13BWsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy2AUlho1o2AUlsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy13BWho1o13BWsuS9_0 {
    display: block;
    /*text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy13BWho1o13BWsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy13BWho1o13BWsuS9_0 {
    line-height: 17.5px;
    font-size: 11px;
    color: #738c98;
  }
  @media screen and (-webkit-min-device-pixel-ratio:0){
    #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy13BWho1o13BWsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy13BWho1o13BWsuS9_0 {
      font-size: 12px;
    }
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy2AUlho1o2AUlsuS9_0, #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy13BWho1o13BWsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy2AUlho1o2AUlsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy13BWho1o13BWsuS9_0 {
    display: block;
    /*text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy2PlWho1o2PlWsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy2PlWho1o2PlWsuS9_0 {
    line-height: 1em;
    display: inline-block;
    color: #90a4ae;
    font-size: 11px;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy3eNuho1o3eNusuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy3eNuho1o3eNusuS9_0 {
    margin-left: 2px;
    display: inline-block;
    position: relative;
    padding: 3px 5px;
    border-radius: 5px;
    z-index: 10000000;
    font-size: 10px;
    line-height: 1em;
    color: #adbcc4;
    text-decoration: none!important;
    cursor: pointer;
    background-color: #fff;
    letter-spacing: -.03em;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy3eNuho1o3eNusuS9_0 i, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy3eNuho1o3eNusuS9_0 i {
    display: inline;
    margin: -3px 2px;
    vertical-align: middle;
    line-height: 1em;
    font-size: .75rem;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy3eNuho1o3eNusuS9_0 .ajRy12wMho1o12wMsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy2EbCho1o2EbCsuS9_0 .ajRy3eNuho1o3eNusuS9_0 .ajRy12wMho1o12wMsuS9_0 {
    color: #0089d8;
    text-decoration: none!important;
    font-weight: 600;
  }

  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 {
    display: block;
    position: absolute;
    float: left;
    top: 3px;
    left: 3px;
    height: 76px;
    width: 76px;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 img, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 img {
    border-radius: 10px;
    height: 76px;
    width: 76px;
  }
  #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1N_Eho1o1N_EsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1N_Eho1o1N_EsuS9_0 {
    cursor: pointer;
    position: absolute;
    right: 28px;
    top: 0;
    width: 18px;
    height: 18px;
    margin: 0;
    padding: 0;
  }
  .ajRy1N_Eho1o1N_EsuS9_0 button {
    background: whitesmoke;
    border: 1px solid whitesmoke;
    border-radius: 17px;
    color: black;
    margin: 4px 4px 4px 0;
    outline: none;
    cursor: pointer;
    padding: 2px 8px 3px;
    margin-right:3px;
  }

  .notiBody{
    height: 34px;
    width: 90%;
    overflow-wrap: break-word;
    overflow-y: hidden;
  }
  .notiOuter{
    height: 82px !important;
  }

  @media screen and (min-width: 480px){
    #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0.ajRy2riIho1o2riIsuS9_0, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0.ajRy2riIho1o2riIsuS9_0 {
      cursor: pointer;
      transition: all .1s ease-in-out;
    }
  }
  @media screen and (min-width: 480px){
    #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 {
      width: 370px;
      margin: 0 0 10px 10px;
      border-radius: 150px;
      box-shadow: 0 0 1px rgba(0,0,0,.2), 0 1px 2px rgba(0,0,0,.05), 0 8px 50px rgba(0,0,0,.05);
    }
    #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 {
      width: 370px;
      margin: 0 0 10px 10px;
      border-radius: 5px;
      box-shadow: 0 0 1px rgba(0,0,0,.2), 0 1px 2px rgba(0,0,0,.05), 0 8px 50px rgba(0,0,0,.05);
    }
  }
  @media screen and (min-width: 480px){
    #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 img, #ajRy2fZIho1o2fZIsuS9_01 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 img {
      border-radius: 50%;
    }
  }
  @media screen and (min-width: 480px){
    #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0, #ajRy2lriho1o2lrisuS9_01 .ajRy1Xogho1o1XogsuS9_0 {
      width: 320px;
      margin: 0 0 10px 10px;
      box-shadow: 0 0 1px rgba(0,0,0,.2), 0 1px 2px rgba(0,0,0,.05), 0 8px 50px rgba(0,0,0,.05);
      border-radius: 5px;
    }
  }

  @media screen and (min-width: 480px){
    #ajRy2lriho1o2lrisuS9_0 .ajRy1Xogho1o1XogsuS9_0.ajRy27wVho1o27wVsuS9_0, #ajRy2lriho1o2lrisuS9_01 .ajRy1Xogho1o1XogsuS9_0.ajRy27wVho1o27wVsuS9_0  {
      cursor: pointer;
      transition: all .1s ease-in-out;
    }
  }

  @media screen and (max-width: 479px){
    #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0,
    #ajRy2fZIho1o2fZIsuS9_0 .ajRy3zjZho1o3zjZsuS9_0 .ajRy1JYFho1o1JYFsuS9_0 img{
      border-radius: 50px;
    }
  }

  @media screen and (max-width: 480px) {
    .main-cont {
      width: 100%
    }
  }
</style>
