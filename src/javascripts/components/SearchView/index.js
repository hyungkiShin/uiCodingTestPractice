import { removeAllChildNodes } from "../../utils/index.js";

export default class SearchView {
  constructor() {
    this.rootElement = SearchView.createRootElement();
    this.searchedMusics = [];
    this.bindEvents();
  }

  static createRootElement() {
    const rootElement = document.createElement("article");
    rootElement.classList.add("contents-search");
    rootElement.innerHTML = `
        <div class="search-controller">
            <input class="search-input" type="text" placeholder="검색" />
            <button class="search-button">
                <i class="icon-search-controller"></i>
            </button>
        </div>
        <ul class="music-list"></ul>
        `;
    return rootElement;
  }

  // 이벤트 바인딩
  bindEvents() {
    // 쿼리를 받아 즉시 검색하는 함수를 부모로 요청합니다. 부모(app.js)는 이 값을 받아서 다시 처리할 것입니다.
    this.rootElement.querySelector(".search-input").addEventListener("input", (event) => {
        const query = event.target.value;
        this.emit("searchMusic", query);
      });

    // 음악에 대한 기능 선택
    this.rootElement.addEventListener("click", (event) => {
      const { target } = event;
      // 버튼인 경우에만 처리하도록 하고, 여기서는 버튼마다 따로 이벤트를 두지 않고 이벤트 위임 형식으로 작성했습니다.
      const isControllerButton = target.tagName === "BUTTON";

      if (!isControllerButton) {
        return;
      }

      // 첫번째 클래스를 가져와서 체크합니다. 이것은 조금 위험할 수 있으니, 주의해서 사용해야합니다. 항상 첫번째 클래스가 이것이라는 보장은 없기 때문입니다. 누군가 수정을 했을 때 바뀔 수도 있고요.
      const buttonRole = target.classList.item(1);
      switch (buttonRole) {
        // 아이콘 플레이인 경우에는
        case "icon-play": {
          // 부모(app.js)에게 음악 재생을 요청합니다.
          this.requestPlay(target);
          break;
        }
        // 아이콘 멈춤인 경우에는
        case "icon-pause": {
          // 부모(app.js)에게 음악 멈춤을 요청합니다.
          this.requestPause(target);
          break;
        }
        // 아이콘 추가인 경우에는
        case "icon-plus": {
          // 부모(app.js)에게 플레이 리스트에 음악 추가를 요청합니다.
          this.requestAddPlayList(target);
          break;
        }
      }
    });
  }

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

  setSearchResult(musicslist = []) {
    this.searchedMusics = musicslist;
    this.renderSearchedMusics();
  }

  on(eventName, callback) {
    this.events = this.events ? this.events : {};
    this.events[eventName] = callback;
  }

  emit(eventName, payload) {
    // App.js 와 통신할수 있게 만들어주는 Method.
    this.events[eventName] && this.events[eventName](payload);
  }

  renderSearchedMusics() {
    const musicListElement = this.rootElement.querySelector(".music-list");
    removeAllChildNodes(musicListElement);
    const searchedMusics = this.searchedMusics
      .map((music, index) => {
        const { cover, title, artists } = music;
        return `
            <li>
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
    musicListElement.innerHTML = searchedMusics;
  }

  render() {
    return this.rootElement;
  }
}
