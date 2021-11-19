export default class TopMusicItems {
  constructor() {
    this.rootElement = TopMusicItems.createRootElement();
    this.musics = [];
    this.bindEvents();
  }

  static createRootElement() {
    const rootElement = document.createElement("article");
    rootElement.classList.add("contents-top5");

    return rootElement;
  }

  bindEvents() {
    this.rootElement.addEventListener("click", (event) => {
      const { target } = event;
      const isControllerButton = target.tagName === "BUTTON";

      if (!isControllerButton) {
        return;
      }

      const buttonRole = target.classList.item(1); // buttonRole 에 버튼클래스 2번째 클래스를 가져와 대입.
      switch (buttonRole) {
        case "icon-play": {
          this.requestPlay(target);
          break;
        }
        case "icon-pause": {
          this.requestPause(target);
          break;
        }
        case "icon-plus": {
          this.requestAddPlayList(target);
          break;
        }
      }
    });
  }

  // 모든 음악 재생 상태를 중단하는 UI 변경을 처리합니다.
  renderStopAll() {
    const playingButtons = this.rootElement.querySelectorAll(".icon-pause");
    playingButtons.forEach((e) =>
      e.classList.replace("icon-pause", "icon-play")
    );
  }

  // 음악 재생
  requestPlay(target) {
    const controller = target.parentElement;
    const { index: musicIndex } = controller.dataset;
    const payload = { musics: this.musics, musicIndex };
    this.emit("play", payload);
    this.renderStopAll();
    target.classList.replace("icon-play", "icon-pause");
  }

  // 음악 중단
  requestPause(target) {
    this.emit("pause");
    target.classList.replace("icon-pause", "icon-play");
  }

  // 플레이 리스트에 추가 요청
  requestAddPlayList(target) {
    const controller = target.parentElement;
    const { index: musicIndex } = controller.dataset;
    const payload = { musics: this.musics, musicIndex };
    this.emit("addPlayList", payload);
  }

  // 음악 데이터를 받아오기
  setMusics(musics = []) {
    this.musics = musics;
  }

  on(eventName, callback) {
    this.events = this.events ? this.events : {};
    this.events[eventName] = callback;
  }

  emit(eventName, payload) {
    // App.js 와 통신할수 있게 만들어주는 Method.
    this.events[eventName] && this.events[eventName](payload);
  }

  render() {
    const topRoof = `
        <div class="top5-roof">
            <img src="assets/images/Logo.png" />
        </div>
      `;
    const musicsList = this.musics
      .map((music, index) => {
        const { cover, title, artists } = music;
        return `
          <li>
              <div class="music-rank">${index + 1}</div>
              <div class="music-content">
                  <div class="music-data">
                      <div class="music-cover">
                          <img src="${cover}" />
                      </div>
                      <div class="music-info">
                          <strong class="music-title">${title}</strong>
                          <em class="music-artist">${artists[0]}</em>
                      </div>
                  </div>
                  <div class="music-simple-controller" data-index=${index}>
                      <button class="icon icon-play">
                          <span class="invisible-text">재생</span>
                      </button>
                      <button class="icon icon-plus">
                          <span class="invisible-text">추가</span>
                      </button>
                  </div>
              </div>
          </li>
      `;
      })
      .join("");
    this.rootElement.innerHTML = topRoof + `<ol class="top5-list">` + musicsList + `</ol>`

    return this.rootElement;
  }
}
